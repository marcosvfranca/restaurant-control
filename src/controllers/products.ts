import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { BaseController } from '@src/controllers/index';
import { Request, Response } from 'express';
import { Product } from '@src/models/product';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('products')
@ClassMiddleware(authMiddleware)
export class ProductController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const product = new Product(req.body);
      const result = await product.save();
      res.status(201).send(result);
    } catch (e) {
      this.sendCreateUpdatedErrorResponse(res, e);
    }
  }
}
