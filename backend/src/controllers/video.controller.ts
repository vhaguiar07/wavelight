import { Controller, Post, Req, Res, Body, UploadedFile, UseInterceptors, Inject } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { exec } from 'child_process';
import { DATABASE_CONNECTION } from '../database/database.constants';

const storageDir = './uploads';
const secretKey = '5#jdA2$3z8&%kL!q6@fG9pXs';

@Controller('videos')
export class VideoController {

  constructor(@Inject(DATABASE_CONNECTION) private readonly pool: Pool) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @Req() req: Request,
    @Res() res: Response,
    @Body('title') title: string,
    @Body('description') description: string,
    @UploadedFile() video: Express.Multer.File
  ) {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('JWT token not provided');
      }
      const token = authHeader.split(' ')[1];
      const decodedToken = jwt.verify(token, secretKey) as jwt.JwtPayload;
      const userId = decodedToken.id;
      
      const filename = `${Date.now()}-${video.originalname}`;
      const filePath = path.join(storageDir, filename);

      await promisify(fs.writeFile)(filePath, video.buffer);

      const insertQuery = 'INSERT INTO videos (user_id, title, description, file_name, file_path) VALUES ($1, $2, $3, $4, $5)';
      await this.pool.query(insertQuery, [userId, title, description, filename, filePath]);

      const fileNameAccepted = title.replace(/[<>:"/\\|?* ]/g, '_');

      // Comando ffmpeg para fazer a conversão para gif
      const ffmpegCommand = `ffmpeg -i ${filePath} -vf "fps=10,scale=320:-1:flags=lanczos" ${path.join(storageDir, `${fileNameAccepted}.gif`)}`;

      exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('Erro ao fazer a conversão:', error);
          res.status(500).json({ msg: 'Erro ao fazer a conversão', error });
          return;
        }

        console.log('Video converted to GIF successfully!');
        res.status(201).json({ msg: 'Video convertido com sucesso' });
      });
    } catch (error) {
      console.error('Erro ao subir o vídeo:', error);
      res.status(500).json({ msg: 'Erro ao subir o vídeo' });
    }
  }
}