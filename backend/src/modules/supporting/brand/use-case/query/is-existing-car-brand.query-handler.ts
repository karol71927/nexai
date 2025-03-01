import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsExistingCarBrandQuery } from './is-existing-car-brand.query';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from '../../model/brand.model';
import { Model } from 'mongoose';

@QueryHandler(IsExistingCarBrandQuery)
export class IsExistingCarBrandQueryHandler
  implements IQueryHandler<IsExistingCarBrandQuery, boolean>
{
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {}

  async execute(query: IsExistingCarBrandQuery): Promise<boolean> {
    const brand = await this.brandModel.findOne({ name: query.name }).exec();

    return !!brand;
  }
}
