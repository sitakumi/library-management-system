import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GenresService } from './genres.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('genres')
export class GenresController {
    constructor(private readonly genresService: GenresService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('LIBRARIAN')
    create(@Body() body: { name: string }) {
        return this.genresService.create(body);
    }

    @Get()
    findAll() {
        return this.genresService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.genresService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('LIBRARIAN')
    update(@Param('id') id: string, @Body() body: { name?: string }) {
        return this.genresService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('LIBRARIAN')
    remove(@Param('id') id: string) {
        return this.genresService.remove(id);
    }
}