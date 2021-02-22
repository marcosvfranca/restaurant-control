import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import * as database from '@src/database';
import * as http from 'http';
import logger from '@src/logger';

import { UserController } from '@src/controllers/users';
import { CompanyController } from '@src/controllers/companies';
import { DepartamentController } from '@src/controllers/departaments';
import { ProductController } from '@src/controllers/products';
import { CompositionController } from '@src/controllers/compositions';
import { CompositionItemController } from '@src/controllers/compositions-items';
import { ProductCompositionsController } from '@src/controllers/products-compositions';
import { TableController } from '@src/controllers/tables';
import { OrderController } from '@src/controllers/orders';

export class SetupServer extends Server {
  private server?: http.Server;

  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const userController = new UserController();
    const companyController = new CompanyController();
    const departamentController = new DepartamentController();
    const productController = new ProductController();
    const compositionController = new CompositionController();
    const compositionItemController = new CompositionItemController();
    const productCompositionsController = new ProductCompositionsController();
    const tableController = new TableController();
    const orderController = new OrderController();
    this.addControllers([
      userController,
      companyController,
      departamentController,
      productController,
      compositionController,
      compositionItemController,
      productCompositionsController,
      tableController,
      orderController,
    ]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close((err) => {
          if (err) {
            return reject(err);
          }
          resolve({});
        });
      });
    }
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port);
    });
  }
}
