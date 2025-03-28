import { Injectable } from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery } from './schema/gallery.schema';

@Injectable()
export class GalleriesService {
  constructor(@InjectModel('gallery') private galleryModel: Model<Gallery>) {}

  create(createGalleryDto: CreateGalleryDto) {
    return 'This action adds a new gallery';
  }

  findAll() {
    return this.galleryModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} gallery`;
  }

  update(id: number, updateGalleryDto: UpdateGalleryDto) {
    return `This action updates a #${id} gallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} gallery`;
  }
}
