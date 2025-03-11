import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { authGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('artists')
  getAllArtists() {
    return this.usersService.getAllArtists();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(authGuard)
  @Patch('')
  update(@Req() request, @Body() updateUserDto: UpdateUserDto) {
    const userId = request.userId;
    return this.usersService.update(userId, updateUserDto);
  }
  @UseGuards(authGuard)
  @Delete('')
  remove(@Req() request) {
    const userId = request.userId;
    return this.usersService.remove(userId);
  }
}
