import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';


@Module({
  imports: [UsersModule, AuthModule, TasksModule],
})
export class AppModule {}
