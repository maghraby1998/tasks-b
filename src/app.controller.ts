import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get('/verify-email/:email')
  async verifyEmail(
    @Param('email') email: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.verifyEmail(email);
    res.redirect('http://localhost:3000');
  }
}
