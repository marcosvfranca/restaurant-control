import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import objectContaining = jasmine.objectContaining;
import { Company } from '@src/models/company';

describe('Companies functional tests', () => {
  const defaultUser = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '123456',
  };
  let token: string;

  beforeAll(async () => {
    await Company.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.id);
  });
  describe('When creating a new company', () => {
    it('should create a company with success', async () => {
      const newCompany = {
        name: 'Exata',
        cnpj: '35980952000101',
      };

      const response = await global.testRequest
        .post('/companies')
        .set({ 'x-access-token': token })
        .send(newCompany);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(objectContaining(newCompany));
    });

    it('should return 400 when there cnpj is required', async () => {
      const newCompany = {
        name: 'Exata',
        cnpj: '',
      };

      const response = await global.testRequest
        .post('/companies')
        .set({ 'x-access-token': token })
        .send(newCompany);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message: 'Company validation failed: cnpj: Path `cnpj` is required.',
      });
    });

    it('should return 409 when there cnpj already exists', async () => {
      const newCompany = {
        name: 'Exata',
        cnpj: '35980952000101',
      };

      const response = await global.testRequest
        .post('/companies')
        .set({ 'x-access-token': token })
        .send(newCompany);
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'Conflict',
        message:
          'Company validation failed: cnpj: already exists in the database.',
      });
    });
  });
});
