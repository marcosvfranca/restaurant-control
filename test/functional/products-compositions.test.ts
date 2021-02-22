import { User } from '@src/models/user';
import { Company } from '@src/models/company';
import { Composition, STATUS, TYPES } from '@src/models/composition';
import AuthService from '@src/services/auth';
import { CompositionItem } from '@src/models/composition-item';
import { ProductComposition } from '@src/models/product-composition';
import { Product } from '@src/models/product';
import { Departament } from '@src/models/departament';
import objectContaining = jasmine.objectContaining;

describe('Product compositions functional tests', () => {
  const defaultUser = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '123456',
  };
  let token: string;
  let companyId: string;
  let departamentId: string;
  let productId: string;
  let compositionTamanhoId: string;
  let compositionFrutasId: string;
  let compositionMontagemId: string;
  let compositionAdicionaisId: string;

  beforeAll(async () => {
    await User.deleteMany({});
    await Company.deleteMany({});
    await Departament.deleteMany({});
    await Product.deleteMany({});
    await Composition.deleteMany({});
    await CompositionItem.deleteMany({});
    await ProductComposition.deleteMany({});

    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.id);

    const defaultCompany = {
      name: 'Exata',
      cnpj: '35980952000101',
      userId: user.id,
    };
    const company = await new Company(defaultCompany).save();
    companyId = company.id;

    const defaultDepartament = {
      name: 'Geral',
      companyId: companyId,
    };

    const departament = await new Departament(defaultDepartament).save();
    departamentId = departament.id;

    const compositionTamanho = await new Composition({
      name: 'Tamanho',
      type: TYPES.TWO,
      quantity_min: 1,
      quantity_max: 1,
      status: STATUS.S,
      companyId: companyId,
    }).save();
    compositionTamanhoId = compositionTamanho.id;

    await new CompositionItem({
      name: '300 ML',
      quantity_max: 1,
      value: 5.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionTamanhoId,
    }).save();

    await new CompositionItem({
      name: '500 ML',
      quantity_max: 1,
      value: 10.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionTamanhoId,
    }).save();

    await new CompositionItem({
      name: '700 ML',
      quantity_max: 1,
      value: 15.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionTamanhoId,
    }).save();

    await new CompositionItem({
      name: '1L',
      quantity_max: 1,
      value: 20.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionTamanhoId,
    }).save();

    const compositionFrutas = await new Composition({
      name: 'Frutas',
      type: TYPES.TWO,
      quantity_min: 0,
      quantity_max: 3,
      status: STATUS.S,
      companyId: companyId,
    }).save();
    compositionFrutasId = compositionFrutas.id;

    await new CompositionItem({
      name: 'Morango',
      quantity_max: 0,
      value: 0.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionFrutasId,
    }).save();

    await new CompositionItem({
      name: 'Banana',
      quantity_max: 0,
      value: 0.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionFrutasId,
    }).save();

    await new CompositionItem({
      name: 'Uva',
      quantity_max: 0,
      value: 0.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionFrutasId,
    }).save();

    await new CompositionItem({
      name: 'Kiwi',
      quantity_max: 0,
      value: 0.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionFrutasId,
    }).save();

    await new CompositionItem({
      name: 'Manga',
      quantity_max: 0,
      value: 0.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionFrutasId,
    }).save();

    const compositionMontagem = await new Composition({
      name: 'Montagem',
      type: TYPES.TWO,
      quantity_min: 1,
      quantity_max: 1,
      status: STATUS.S,
      companyId: companyId,
    }).save();
    compositionMontagemId = compositionMontagem.id;

    await new CompositionItem({
      name: 'Mais Açai',
      quantity_max: 0,
      value: 0.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionMontagemId,
    }).save();

    await new CompositionItem({
      name: 'Mais complemento',
      quantity_max: 0,
      value: 0.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionMontagemId,
    }).save();

    await new CompositionItem({
      name: 'Meio a meio',
      quantity_max: 0,
      value: 0.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionMontagemId,
    }).save();

    await new CompositionItem({
      name: 'Mais frutas',
      quantity_max: 0,
      value: 0.0,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionMontagemId,
    }).save();

    const compositionAdicionais = await new Composition({
      name: 'Adicionais',
      type: TYPES.ONE,
      quantity_min: 0,
      quantity_max: 0,
      status: STATUS.S,
      companyId: companyId,
    }).save();
    compositionAdicionaisId = compositionAdicionais.id;

    await new CompositionItem({
      name: 'BIS',
      quantity_max: 1,
      value: 1.5,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionAdicionaisId,
    }).save();

    await new CompositionItem({
      name: 'Confetes',
      quantity_max: 1,
      value: 1.5,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionAdicionaisId,
    }).save();

    await new CompositionItem({
      name: 'Chocobol',
      quantity_max: 1,
      value: 1.5,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionAdicionaisId,
    }).save();

    await new CompositionItem({
      name: 'Cereja',
      quantity_max: 1,
      value: 1.5,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionAdicionaisId,
    }).save();

    await new CompositionItem({
      name: 'Bombom',
      quantity_max: 1,
      value: 1.5,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionAdicionaisId,
    }).save();

    await new CompositionItem({
      name: 'Ovomaltine',
      quantity_max: 1,
      value: 1.5,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionAdicionaisId,
    }).save();

    await new CompositionItem({
      name: 'Nutella',
      quantity_max: 1,
      value: 2,
      pre_selected_quantity: 0,
      status: STATUS.S,
      compositionId: compositionAdicionaisId,
    }).save();

    const defaultProduct = {
      name: 'Açai',
      description: 'Açai',
      image: '',
      price: 0.0,
      status: STATUS.S,
      companyId: companyId,
      departamentId: departamentId,
    };

    const product = await new Product(defaultProduct).save();
    productId = product.id;
  });

  describe('When associating a composition in product', () => {
    it('should associate product to compositionTamanho with success', async () => {
      const newProductComposition = {
        status: STATUS.S,
        productId: productId,
        compositionId: compositionTamanhoId,
      };

      const response = await global.testRequest
        .post('/products-compositions')
        .set({ 'x-access-token': token })
        .send(newProductComposition);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(objectContaining(newProductComposition));
    });
    it('should associate product to compositionFrutas with success', async () => {
      const newProductComposition = {
        status: STATUS.S,
        productId: productId,
        compositionId: compositionFrutasId,
      };

      const response = await global.testRequest
        .post('/products-compositions')
        .set({ 'x-access-token': token })
        .send(newProductComposition);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(objectContaining(newProductComposition));
    });
    it('should associate product to compositionMontagem with success', async () => {
      const newProductComposition = {
        status: STATUS.S,
        productId: productId,
        compositionId: compositionMontagemId,
      };

      const response = await global.testRequest
        .post('/products-compositions')
        .set({ 'x-access-token': token })
        .send(newProductComposition);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(objectContaining(newProductComposition));
    });
    it('should associate product to compositionAdicionais with success', async () => {
      const newProductComposition = {
        status: STATUS.S,
        productId: productId,
        compositionId: compositionAdicionaisId,
      };

      const response = await global.testRequest
        .post('/products-compositions')
        .set({ 'x-access-token': token })
        .send(newProductComposition);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(objectContaining(newProductComposition));
    });
  });
});
