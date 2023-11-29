import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Book } from './schemas/book.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async finAll(query: ExpressQuery): Promise<Book[]> {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = limit * (page - 1);
    const keyword = query?.keyword
      ? {
          title: { $regex: query.keyword, $options: 'i' },
        }
      : {};
    const books = await this.bookModel
      .find({ ...keyword })
      .skip(skip)
      .limit(limit);
    return books;
  }
  async create(book: Book, user: User): Promise<Book> {
    const data = Object.assign(book, { user: user._id });
    const res = await this.bookModel.create(data);
    return res;
  }
  async findById(id: string): Promise<Book> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }
  async updateById(id: string, book: Partial<Book>): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
  }
  async deleteById(id: string): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(id);
  }
}
