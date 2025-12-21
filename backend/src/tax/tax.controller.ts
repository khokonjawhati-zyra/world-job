import { Controller, Get, Param } from '@nestjs/common';
import { TaxService } from './tax.service';

@Controller('tax')
export class TaxController {
  constructor(private taxService: TaxService) {}

  @Get('worker/:id/:year')
  getWorkerReport(@Param('id') id: string, @Param('year') year: string) {
    return this.taxService.generateWorkerReport(id, parseInt(year));
  }

  @Get('employer/:id/:year')
  getEmployerReport(@Param('id') id: string, @Param('year') year: string) {
    return this.taxService.generateEmployerReport(id, parseInt(year));
  }

  @Get('admin/:year')
  getAdminReport(@Param('year') year: string) {
    return this.taxService.generateAdminReport(parseInt(year));
  }
}
