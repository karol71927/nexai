import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CarClientService } from '../../service/car-client.service';
import { AssignClientHttpRequest } from './request/assign-client.http-request';

@Controller('cars/:id/clients')
@ApiTags('cars')
export class CarClientController {
  constructor(private readonly carClientService: CarClientService) {}

  @Patch()
  @ApiOkResponse()
  @ApiNotFoundResponse({
    description: 'Car not found',
  })
  @ApiBadRequestResponse({
    description: 'Car already has a client',
  })
  async assignClient(
    @Param('id') carId: string,
    @Body() body: AssignClientHttpRequest,
  ) {
    await this.carClientService.assignClient(carId, body.email, body.address);
  }

  @Delete()
  @ApiOkResponse()
  @ApiNotFoundResponse({
    description: 'Car not found',
  })
  @ApiBadRequestResponse({
    description: 'Car does not have a client',
  })
  @HttpCode(HttpStatus.OK)
  async unassignClient(@Param('id') carId: string) {
    await this.carClientService.unassignClient(carId);
  }
}
