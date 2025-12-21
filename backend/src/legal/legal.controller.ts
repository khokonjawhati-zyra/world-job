import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { LegalService } from './legal.service';

@Controller('legal')
export class LegalController {
    constructor(private readonly legalService: LegalService) { }

    @Get('terms')
    getTerms() {
        return this.legalService.getTerms();
    }

    @Post('clause')
    addClause(@Body('content') content: string) {
        return this.legalService.addClause(content);
    }

    @Delete('clause/:id')
    removeClause(@Param('id') id: string) {
        return this.legalService.removeClause(id);
    }

    @Put('clause/:id')
    updateClause(@Param('id') id: string, @Body('content') content: string) {
        return this.legalService.updateClause(id, content);
    }
}
