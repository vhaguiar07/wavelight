import { Controller, Post, Body, Res, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service'
import { Response } from 'express';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@Body() body: { email: string; password: string }, @Res() res: Response) {
    const { email, password } = body;

    try {
      await this.userService.createUser(email, password);

      res.status(HttpStatus.CREATED).json({ msg: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      throw new HttpException('Erro ao cadastrar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
