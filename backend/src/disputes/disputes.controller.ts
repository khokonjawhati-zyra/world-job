import { Controller, Post, Body, Get } from '@nestjs/common';
import { DisputesService } from './disputes.service';

@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  create(@Body() data: any) {
    return this.disputesService.create(data);
  }

  @Get()
  findAll() {
    return this.disputesService.findAll();
  }
}
