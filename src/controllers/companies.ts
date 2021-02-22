import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { BaseController } from '@src/controllers/index';
import { Request, Response } from 'express';
import { Company } from '@src/models/company';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('companies')
@ClassMiddleware(authMiddleware)
export class CompanyController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const company = new Company({
        ...req.body,
        ...{ userId: req.context?.userId },
      });
      const result = await company.save();
      res.status(201).send(result);
    } catch (e) {
      this.sendCreateUpdatedErrorResponse(res, e);
    }
  }
}
