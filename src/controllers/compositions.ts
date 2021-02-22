import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { BaseController } from '@src/controllers/index';
import { Request, Response } from 'express';
import { Composition } from '@src/models/composition';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('compositions')
@ClassMiddleware(authMiddleware)
export class CompositionController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const composition = new Composition(req.body);
      const result = await composition.save();
      res.status(201).send(result);
    } catch (e) {
      this.sendCreateUpdatedErrorResponse(res, e);
    }
  }
}
