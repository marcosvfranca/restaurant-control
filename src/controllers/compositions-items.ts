import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { BaseController } from '@src/controllers/index';
import { Request, Response } from 'express';
import { CompositionItem } from '@src/models/composition-item';
import { authMiddleware } from '@src/middlewares/auth';
import { Composition, TYPES } from '@src/models/composition';

@Controller('compositions-items')
@ClassMiddleware(authMiddleware)
export class CompositionItemController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const composition = await Composition.findById(req.body.compositionId);
      if (!composition) {
        this.sendErrorResponse(res, {
          code: 404,
          message: `Composition {${req.body.compositionId} not found`,
        });
      } else if (
        composition.type == TYPES.TWO &&
        (req.body.pre_selected_quantity != 0 ||
          req.body.pre_selected_quantity != 1)
      ) {
        this.sendErrorResponse(res, {
          code: 422,
          message:
            'CompositionItem validation failed: pre_selected_quantity: Path `pre_selected_quantity` is invalid.',
        });
        return;
      }
      const compositionItem = new CompositionItem(req.body);
      const result = await compositionItem.save();
      res.status(201).send(result);
    } catch (e) {
      this.sendCreateUpdatedErrorResponse(res, e);
    }
  }
}
