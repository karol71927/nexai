import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CarService } from '../../service/car.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CarHttpResponse } from './response/car.http-response';
import { PaginatedQueryParams } from '../../../../../shared/pagination/paginated.query-params';
import { PaginatedHttpResponse } from '../../../../../shared/pagination/paginated.http-response';
import { ApiOkPaginatedResponse } from '../../../../../shared/pagination/api-ok-paginated-response.decorator';
import { CreateCarHttpRequest } from './request/create-car.http-request';
import { UpdateCarHttpRequest } from './request/update-car.http-request';

@Controller('cars')
@ApiTags('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  @ApiOkPaginatedResponse(CarHttpResponse)
  async find(
    @Query() { limit, offset }: PaginatedQueryParams,
  ): Promise<PaginatedHttpResponse<CarHttpResponse>> {
    const [cars, total] = await this.carService.findPaginated(limit, offset);

    return new PaginatedHttpResponse(
      limit,
      offset,
      total,
      cars.map((car) => new CarHttpResponse(car)),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: CarHttpResponse })
  @ApiNotFoundResponse({
    description: 'Car not found',
  })
  async findById(@Param('id') id: string): Promise<CarHttpResponse> {
    const car = await this.carService.findOne(id);

    return new CarHttpResponse(car);
  }

  @Post()
  @ApiCreatedResponse()
  @ApiNotFoundResponse({
    description: 'Brand not found',
  })
  @ApiConflictResponse({
    description: 'Car with this vin or registration number already exists',
  })
  async add(@Body() body: CreateCarHttpRequest): Promise<void> {
    await this.carService.add(body.brand, body.vin, body.registrationNumber);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse({
    description: 'Car or brand not found',
  })
  @ApiConflictResponse({
    description: 'Car with this vin or registration number already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCarHttpRequest,
  ): Promise<void> {
    await this.carService.update(
      id,
      body.brand,
      body.vin,
      body.registrationNumber,
    );
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @ApiNotFoundResponse({
    description: 'Car not found',
  })
  @ApiBadRequestResponse({
    description: 'Car is rented',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.carService.remove(id);
  }
}
