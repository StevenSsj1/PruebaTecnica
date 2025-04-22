import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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
    return this.tasksService.create(createTaskDto, user.userId, user.organizationId);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.tasksService.findAll(user.email, user.organizationId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.update(id, updateTaskDto, user.userId, user.organizationId);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.softDelete(id, user.userId, user.organizationId);
  }

  @Post(':id/restore')
  restore(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.restore(id, user.userId, user.organizationId);
  }
}