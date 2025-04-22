import { Module } from '@nestjs/common';
import { UsersService } from '../users/services/users.service';
import { UsersController } from '../users/controllers/users.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
