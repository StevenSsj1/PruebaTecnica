import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string, organizationId: string) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
        organizationId,
      },
    });
  }

  async findAll(userId: string, organizationId: string) {
    return this.prisma.task.findMany({
      where: {
        organizationId,
        deleted: false,
      },
    });
  }

  async findOne(id: string, userId: string, organizationId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        organizationId,
        deleted: false,
      },
    });

    if (!task) {
      throw new ForbiddenException('Task not found or you do not have access to it');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string, organizationId: string) {
    const task = await this.findOne(id, userId, organizationId);

    return this.prisma.task.update({
      where: { id: task.id },
      data: updateTaskDto,
    });
  }

  async softDelete(id: string, userId: string, organizationId: string) {
    const task = await this.findOne(id, userId, organizationId);

    return this.prisma.task.update({
      where: { id: task.id },
      data: { deleted: true },
    });
  }

  async restore(id: string, userId: string, organizationId: string) {
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