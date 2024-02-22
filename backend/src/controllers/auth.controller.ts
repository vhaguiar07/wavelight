import { Controller, Post, Body, Res, HttpStatus, Inject } from '@nestjs/common';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { DATABASE_CONNECTION } from '../database/database.constants';

@Controller('api')
export class AuthController {
  constructor(@Inject(DATABASE_CONNECTION) private readonly pool: Pool) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    const { email, password } = body;

    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      client.release();

      if (result.rows.length === 0 || password !== result.rows[0].password) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Email ou senha inválidos.' });
      }

      const token = jwt.sign({
        id: result.rows[0].id,
        email: result.rows[0].email,
      }, '5#jdA2$3z8&%kL!q6@fG9pXs', { expiresIn: '1h' });

      return res.status(HttpStatus.OK).json({ token });

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro interno do servidor.' });
    }
  }
}