import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto, UpdateBookDto } from './dtos/book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
    return this.bookService.finAll(query);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createBook(@Body() book: CreateBookDto, @Req() request): Promise<Book> {
    return this.bookService.create(book, request.user);
  }

  @Get(':id')
  async findABook(@Param('id') id: string): Promise<Book> {
    return this.bookService.findById(id);
  }

  @Put(':id')
  async updateABook(
    @Param('id') id: string,
    @Body() book: Partial<UpdateBookDto>,
  ): Promise<Book> {
    return this.bookService.updateById(id, book);
  }

  @Delete(':id')
  async deleteAbook(@Param('id') id: string): Promise<Book> {
    return this.bookService.findById(id);
  }
}
