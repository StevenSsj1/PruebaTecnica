import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TasksService } from '../services/tasks.services';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard) 
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(createTaskDto, user.sub, user.organizationId);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.tasksService.findAll(user.sub, user.organizationId);
  }

  @Get('search/by-title')
  findByTitle(@Query('title') title: string, @CurrentUser() user: any) {
    return this.tasksService.findByTitle(title, user.sub, user.organizationId);
  }

  @Patch(':identifier') // Actualizar por ID o título
  update(@Param('identifier') identifier: string, @Body() updateTaskDto: UpdateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.update(identifier, updateTaskDto, user.sub, user.organizationId);
  }

  @Delete(':identifier') // Soft delete por ID o título
  softDelete(@Param('identifier') identifier: string, @CurrentUser() user: any) {
    return this.tasksService.softDelete(identifier, user.sub, user.organizationId);
  }

  @Post(':identifier/restore') // Restaurar por ID o título
  restore(@Param('identifier') identifier: string, @CurrentUser() user: any) {
    return this.tasksService.restore(identifier, user.sub, user.organizationId);
  }
}