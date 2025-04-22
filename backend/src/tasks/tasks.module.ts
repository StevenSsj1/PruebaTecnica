import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.services';
import { TasksController } from './controllers/tasks.controller';
import { PrismaService } from 'src/prisma.service'; // Prisma para interactuar con la base de datos

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService], // Asegúrate de incluir PrismaService
})
export class TasksModule {}