import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { BaseController } from '@src/controllers/index';
import { Request, Response } from 'express';
import { ProductComposition } from '@src/models/product-composition';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('products-compositions')
@ClassMiddleware(authMiddleware)
export class ProductCompositionsController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const productComposition = new ProductComposition(req.body);
      const result = await productComposition.save();
      res.status(201).send(result);
    } catch (e) {
      this.sendCreateUpdatedErrorResponse(res, e);
    }
  }
}
