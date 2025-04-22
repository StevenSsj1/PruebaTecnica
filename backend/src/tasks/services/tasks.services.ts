import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear una nueva tarea
  async create(createTaskDto: CreateTaskDto, userId: string, organizationId: string) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
        organizationId,
      },
    });
  }

  // Obtener todas las tareas de la organización del usuario
  async findAll(sub: string, organizationId: string) {
    return this.prisma.task.findMany({
      where: {
        organizationId,
        userId: sub,
        deleted: false,
      },
    });
  }

  // Buscar tarea por ID o Título (validando organización)
  async findByIdOrTitle(identifier: string, sub: string, organizationId: string) {

    const task = await this.prisma.task.findFirst({
      where: {
        OR: [{ id: identifier }, { title: identifier }],
        organizationId,
        userId: sub, 
        deleted: false,
      },
    });
    console.log('Task found:', task);

    if (!task) {
      throw new ForbiddenException('Task not found or you do not have access to it');
    }

    return task;
  }

  // Búsqueda parcial por título (validando organización)
  async findByTitle(title: string, userId: string, organizationId: string) {
    return this.prisma.task.findMany({
      where: {
        title: {
          contains: title, 
          mode: 'insensitive', 
        },
        organizationId,
        userId,
        deleted: false,
      },
    });
  }

  // Actualizar tarea por ID o título
  async update(identifier: string, updateTaskDto: UpdateTaskDto, userId: string, organizationId: string) {
   
    const task = await this.findByIdOrTitle(identifier, userId, organizationId);
    console.log('Task found:', task);

    return this.prisma.task.update({
      where: { id: task.id },
      data: updateTaskDto,
    });
  }

  // Eliminar (soft delete) tarea por ID o título
  async softDelete(identifier: string, userId: string, organizationId: string) {
    const task = await this.findByIdOrTitle(identifier, userId, organizationId);

    return this.prisma.task.update({
      where: { id: task.id },
      data: { deleted: true },
    });
  }

  // Restaurar tarea eliminada por ID o título
  async restore(identifier: string, userId: string, organizationId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        OR: [{ id: identifier }, { title: identifier }],
        organizationId,
        userId,
        deleted: true, // Solo tareas eliminadas
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