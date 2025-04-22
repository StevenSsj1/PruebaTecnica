import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userEmail: string) {
    // Obtener la organización del usuario autenticado
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }
    const { organizationId } = user;
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        description: createTaskDto.description,
        userId: userEmail, 
        organizationId, 
      },
    });
  }

  async findAll(userEmail: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const { organizationId } = user;

    return this.prisma.task.findMany({
      where: {
        organizationId,
        deleted: false, // Excluir tareas marcadas como eliminadas
      },
    });
  }

  async findOne(id: string, userEmail: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const { organizationId } = user;

    const task = await this.prisma.task.findFirst({
      where: {
        id,
        organizationId,
        deleted: false, // Excluir tareas eliminadas
      },
    });

    if (!task) {
      throw new ForbiddenException('Task not found or you do not have access to it');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userEmail: string) {
    const task = await this.findOne(id, userEmail);

    return this.prisma.task.update({
      where: { id: task.id },
      data: updateTaskDto,
    });
  }

  async softDelete(id: string, userEmail: string) {
    const task = await this.findOne(id, userEmail);

    return this.prisma.task.update({
      where: { id: task.id },
      data: { deleted: true },
    });
  }

  async restore(id: string, userEmail: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const { organizationId } = user;

    const task = await this.prisma.task.findFirst({
      where: {
        id,
        organizationId,
        deleted: true,
      },
    });

    if (!task) {
      throw new ForbiddenException('Task not found or you do not have access to it');
    }

    return this.prisma.task.update({
      where: { id: task.id },
      data: { deleted: false },
    });
  }
}