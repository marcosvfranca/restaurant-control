import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { BaseController } from '@src/controllers/index';
import { Order } from '@src/models/order';
import { Request, Response } from 'express';

@Controller('orders')
@ClassMiddleware(authMiddleware)
export class OrderController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const order = new Order(req.body);
      const response = await order.save();
      res.status(201).send(response);
    } catch (error) {
      this.sendCreateUpdatedErrorResponse(res, error);
    }
  }
}
