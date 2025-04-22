import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth/services/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module'; // Importamos el módulo de usuarios
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    UsersModule, // Dependencia del módulo de usuarios
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // Usa variables de entorno para mayor seguridad
      signOptions: { expiresIn: '1h' }, // Expiración del token
    }),
  ],
  controllers:[AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}