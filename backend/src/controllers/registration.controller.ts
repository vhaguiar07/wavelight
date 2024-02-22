import { Controller, Post, Body, Res, HttpStatus, HttpException, Inject } from '@nestjs/common';
import { Response } from 'express';
import { Pool } from 'pg';
import { DATABASE_CONNECTION } from '../database/database.constants';

@Controller('api')
export class RegistrationController {
  constructor(@Inject(DATABASE_CONNECTION) private readonly pool: Pool) {}

  @Post('check-email')
  async checkEmail(@Body() body: { email: string }, @Res() res: Response) {
    const { email } = body;

    try {
      const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        return res.status(HttpStatus.CONFLICT).json({ message: 'Email já está em uso.' });
      }
      return res.status(HttpStatus.OK).json({ message: 'Email disponível para cadastro.' });
    } catch (error) {
      console.error('Erro ao verificar o email:', error);
      throw new HttpException('Erro interno do servidor.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}