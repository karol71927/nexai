import { Injectable } from '@nestjs/common';
import { Brand } from '../model/brand.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {}

  async findAll(): Promise<Brand[]> {
    return this.brandModel.find({}).exec();
  }
}
