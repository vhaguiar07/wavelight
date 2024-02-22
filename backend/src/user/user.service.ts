import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UserService {
  constructor(private readonly pool: Pool) {}

  async createUser(email: string, password: string) {
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
    const values = [email, password];

    try {
      const { rows } = await this.pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Erro ao criar usuário no banco de dados' + error);
    }
  }
}