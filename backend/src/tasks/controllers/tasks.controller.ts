import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from '../services/tasks.services';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(createTaskDto, user.email);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.tasksService.findAll(user.email);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.findOne(id, user.email);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.update(id, updateTaskDto, user.email);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.softDelete(id, user.email);
  }

  @Post(':id/restore')
  restore(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.restore(id, user.email);
  }
}