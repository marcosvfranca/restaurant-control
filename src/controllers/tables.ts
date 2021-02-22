import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { BaseController } from '@src/controllers/index';
import { Table } from '@src/models/table';
import { Request, Response } from 'express';

@Controller('tables')
@ClassMiddleware(authMiddleware)
export class TableController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const table = new Table(req.body);
      const response = await table.save();
      res.status(201).send(response);
    } catch (error) {
      this.sendCreateUpdatedErrorResponse(res, error);
    }
  }
}
