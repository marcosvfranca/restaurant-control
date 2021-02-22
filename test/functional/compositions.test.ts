import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import objectContaining = jasmine.objectContaining;
import { Composition, STATUS, TYPES } from '@src/models/composition';
import { Company } from '@src/models/company';

describe('Compositions functional tests', () => {
  const defaultUser = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '123456',
  };
  let token: string;
  let companyId: string;

  beforeAll(async () => {
    await User.deleteMany({});
    await Company.deleteMany({});
    await Composition.deleteMany({});

    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.id);

    const defaultCompany = {
      name: 'Exata',
      cnpj: '35980952000101',
      userId: user.id,
    };
    const company = await new Company(defaultCompany).save();
    companyId = company.id;
  });
  describe('When creating a new composition', () => {
    it('should create a composition with success', async () => {
      const newComposition = {
        name: 'Ingredientes',
        type: TYPES.ONE,
        quantity_max: 1,
        quantity_min: 1,
        status: STATUS.S,
        companyId: companyId,
      };

      const response = await global.testRequest
        .post('/compositions')
        .set({ 'x-access-token': token })
        .send(newComposition);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(objectContaining(newComposition));
    });

    it('should return 400 when there name is required', async () => {
      const newComposition = {
        name: '',
        type: TYPES.ONE,
        quantity_max: 1,
        quantity_min: 1,
        status: STATUS.S,
        companyId: companyId,
      };

      const response = await global.testRequest
        .post('/compositions')
        .set({ 'x-access-token': token })
        .send(newComposition);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message:
          'Composition validation failed: name: Path `name` is required.',
      });
    });

    it('should return 409 when the type is invalid', async () => {
      const newComposition = {
        name: 'Ingredientes',
        type: 3,
        quantity_max: 1,
        quantity_min: 1,
        status: STATUS.S,
        companyId: companyId,
      };

      const response = await global.testRequest
        .post('/compositions')
        .set({ 'x-access-token': token })
        .send(newComposition);
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'Conflict',
        message: 'Composition validation failed: type: Path `type` is invalid.',
      });
    });

    it('should return 422 when the quantity min is < 0', async () => {
      const newComposition = {
        name: 'Test composition',
        type: TYPES.ONE,
        quantity_min: -1,
        quantity_max: 1,
        status: STATUS.S,
        companyId: companyId,
      };

      const response = await global.testRequest
        .post('/compositions')
        .set({ 'x-access-token': token })
        .send(newComposition);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message:
          'Composition validation failed: quantity_min: Path `quantity_min` is invalid.',
      });
    });

    it('should return 422 when the quantity max is < 0', async () => {
      const newComposition = {
        name: 'Test composition',
        type: TYPES.ONE,
        quantity_min: 5,
        quantity_max: -5,
        status: STATUS.S,
        companyId: companyId,
      };

      const response = await global.testRequest
        .post('/compositions')
        .set({ 'x-access-token': token })
        .send(newComposition);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message:
          'Composition validation failed: quantity_max: Path `quantity_max` is invalid.',
      });
    });
  });
});
