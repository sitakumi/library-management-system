import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(
    @Body() body: { email: string; password: string; name?: string; role?: 'MEMBER' | 'LIBRARIAN' },
  ) {
    return this.auth.register(body.email, body.password, body.name, body.role);
  }

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts / minute
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }
}