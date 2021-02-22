import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { BaseController } from '@src/controllers/index';
import { Request, Response } from 'express';
import { Departament } from '@src/models/departament';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('departaments')
@ClassMiddleware(authMiddleware)
export class DepartamentController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const departament = new Departament(req.body);
      const result = await departament.save();
      res.status(201).send(result);
    } catch (e) {
      this.sendCreateUpdatedErrorResponse(res, e);
    }
  }
}
