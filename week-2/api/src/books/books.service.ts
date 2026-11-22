import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Prisma } from '@prisma/client';

export interface FindBooksQuery {
  genreId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookDto) {
    try {
      return await this.prisma.book.create({ data, include: { genre: true } });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('ISBN already exists');
      throw e;
    }
  }

  async findAll({ genreId, search, page = 1, limit = 10 }: FindBooksQuery) {
    const where: Prisma.BookWhereInput = {};
    if (genreId) where.genreId = genreId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: { genre: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async update(id: string, data: UpdateBookDto) {
    await this.findOne(id);
    return this.prisma.book.update({ where: { id }, data, include: { genre: true } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }
}