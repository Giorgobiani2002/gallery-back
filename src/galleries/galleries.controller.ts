import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  NotFoundException,
} from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import * as jwt from 'jsonwebtoken';

@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @Post()
  create(@Body() createGalleryDto: CreateGalleryDto) {
    return this.galleriesService.create(createGalleryDto);
  }

  @Get()
  findAll(@Headers('authorization') authorization: string) {
    let userId = null;

    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.split(' ')[1];
      let decodedToken: any;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        userId = decodedToken.userId;
      } catch (error) {
        throw new NotFoundException('Invalid or expired token');
      }
    }

    console.log(userId, 'userId userId');

    return this.galleriesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galleriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleriesService.update(+id, updateGalleryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galleriesService.remove(+id);
  }
}
