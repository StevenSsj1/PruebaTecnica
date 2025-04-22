import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { hashPassword } from 'src/shared/utils/password.utils';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      createUserDto.password = await hashPassword(createUserDto.password);
    }

    return this.prisma.user.create({ data: createUserDto });
  }


  async findByEmail(email: string) {
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Invalid email address');
    }
    console.log('Email:', email);
    const user = await this.prisma.user.findUnique({
      where: {
        email: email, 
      },
    });

    if (!user) {
      throw new BadRequestException('User not found with the provided email');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}