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
  UseInterceptors,
  Headers,
  UploadedFiles,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { authGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/upload/aws-s3.service';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private s3Service: AwsS3Service,
  ) {}

  @Post('uploadProfile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfile(
    @Headers('authorization') authorization: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { userBio: string },
  ) {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new NotFoundException('Authorization header missing or invalid');
    }

    if (!file) {
      throw new NotFoundException('No file uploaded');
    }

    if (
      !body ||
      !body.userBio ||
      typeof body.userBio !== 'string' ||
      body.userBio.trim() === ''
    ) {
      throw new NotFoundException(
        'User bio is required and should be a non-empty string',
      );
    }

   
    if (!file.mimetype.startsWith('image/')) {
      throw new NotFoundException(
        'Invalid file type. Please upload an image file',
      );
    }

    const profileImgPath = `images/${Math.random().toString().slice(2)}`;

    await this.s3Service.uploadFile(profileImgPath, file);

    const profileImgUrl =
      await this.s3Service.generateSignedUrl(profileImgPath);

    const token = authorization.split(' ')[1];
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, 'GELASUYVARSMAWONI');
    } catch (error) {
      throw new NotFoundException('Invalid or expired token');
    }

    const userId = decodedToken.userId;
    const { userBio } = body;

    const user = await this.usersService.updateProfileImage(
      userId,
      profileImgUrl,
      userBio,
    );

    return {
      message: 'Profile updated successfully',
      user,
    };
  }

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
