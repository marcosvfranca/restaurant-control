import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import objectContaining = jasmine.objectContaining;
import { Composition, STATUS, TYPES } from '@src/models/composition';
import { Company } from '@src/models/company';
import { CompositionItem } from '@src/models/composition-item';

describe('Items compositions functional tests', () => {
  const defaultUser = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '123456',
  };
  let token: string;
  let companyId: string;
  let compositionId: string;
  let compositionId2: string;

  beforeAll(async () => {
    await User.deleteMany({});
    await Company.deleteMany({});
    await Composition.deleteMany({});
    await CompositionItem.deleteMany({});

    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.id);

    const defaultCompany = {
      name: 'Exata',
      cnpj: '35980952000101',
      userId: user.id,
    };
    const company = await new Company(defaultCompany).save();
    companyId = company.id;

    const defaultComposition = {
      name: 'Ingredientes',
      type: TYPES.ONE,
      quantity_min: 1,
      quantity_max: 5,
      status: STATUS.S,
      companyId: companyId,
    };

    const composition = await new Composition(defaultComposition).save();
    compositionId = composition.id;

    const defaultComposition2 = {
      name: 'Adicionais',
      type: TYPES.TWO,
      quantity_min: 0,
      quantity_max: 5,
      status: STATUS.S,
      companyId: companyId,
    };

    const composition2 = await new Composition(defaultComposition2).save();
    compositionId2 = composition2.id;
  });
  describe('When creating a new composition item', () => {
    it('should create a composition item with success', async () => {
      const newCompositionItem = {
        name: 'Item Composição 11',
        quantity_max: 0,
        value: 1,
        pre_selected_quantity: 1,
        status: STATUS.S,
        compositionId: compositionId,
      };

      const response = await global.testRequest
        .post('/compositions-items')
        .set({ 'x-access-token': token })
        .send(newCompositionItem);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(objectContaining(newCompositionItem));
    });

    it('should return 422 when there name is required', async () => {
      const newCompositionItem = {
        name: '',
        quantity_max: 0,
        value: 1,
        pre_selected_quantity: 1,
        status: STATUS.S,
        compositionId: compositionId,
      };

      const response = await global.testRequest
        .post('/compositions-items')
        .set({ 'x-access-token': token })
        .send(newCompositionItem);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message:
          'CompositionItem validation failed: name: Path `name` is required.',
      });
    });

    it('should return 422 when there value is invalid', async () => {
      const newCompositionItem = {
        name: 'Composition item test 1',
        quantity_max: 0,
        value: -1,
        pre_selected_quantity: 1,
        status: STATUS.S,
        compositionId: compositionId,
      };

      const response = await global.testRequest
        .post('/compositions-items')
        .set({ 'x-access-token': token })
        .send(newCompositionItem);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message:
          'CompositionItem validation failed: value: Path `value` is invalid.',
      });
    });

    it('should return 422 when there pre selected quantity is invalid', async () => {
      const newCompositionItem = {
        name: 'Composition item test 2',
        quantity_max: 0,
        value: 1.9,
        pre_selected_quantity: 2,
        status: STATUS.S,
        compositionId: compositionId2,
      };

      const response = await global.testRequest
        .post('/compositions-items')
        .set({ 'x-access-token': token })
        .send(newCompositionItem);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message:
          'CompositionItem validation failed: pre_selected_quantity: Path `pre_selected_quantity` is invalid.',
      });
    });
  });
});
