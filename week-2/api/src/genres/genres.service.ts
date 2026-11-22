import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string }) {
    try {
      return await this.prisma.genre.create({ data });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Genre name already exists');
      throw e;
    }
  }

  findAll() {
    return this.prisma.genre.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException(`Genre ${id} not found`);
    return genre;
  }

  async update(id: string, data: { name?: string }) {
    await this.findOne(id);
    return this.prisma.genre.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.genre.delete({ where: { id } });
  }
}
