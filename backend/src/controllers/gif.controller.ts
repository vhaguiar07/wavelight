import { Controller, Get, Res, HttpStatus, HttpException, Headers, Inject } from '@nestjs/common'; // Importe Inject
import { Pool } from 'pg';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('api')
export class GifController {
  constructor(@Inject('DATABASE_CONNECTION') private readonly pool: Pool) {}

  @Get('gifs')
  async getGifs(@Res() res: Response, @Headers('authorization') authorization: string) {
    try {
      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new HttpException('Token de autenticação não fornecido', HttpStatus.UNAUTHORIZED);
      }
      
      const token = authorization.split(' ')[1];
      let decodedToken: jwt.JwtPayload;

      if (typeof token === 'string') {
        decodedToken = jwt.verify(token, '5#jdA2$3z8&%kL!q6@fG9pXs') as jwt.JwtPayload;
      } else {
        throw new HttpException('Token de autenticação inválido', HttpStatus.UNAUTHORIZED);
      }

      if (!decodedToken.id) {
        throw new HttpException('Token de autenticação inválido', HttpStatus.UNAUTHORIZED);
      }

      const userId = decodedToken.id;

      const query = 'SELECT title FROM videos WHERE user_id = $1';
      const { rows } = await this.pool.query(query, [userId]);
      
      // Tratando os nomes dos arquivos para serem válidos (sem caracteres inválidos)
      const gifNames = rows.map(row => row.title.replace(/[<>:"/\\|?* ]/g, '_'));

      return res.json({ gifs: gifNames });
    } catch (error) {
      console.error('Erro ao obter os GIFs do usuário:', error);
      throw new HttpException('Erro ao obter os GIFs do usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}