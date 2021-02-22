import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import objectContaining = jasmine.objectContaining;
import { Departament } from '@src/models/departament';
import { Company } from '@src/models/company';

describe('Departaments functional tests', () => {
  const defaultUser = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '123456',
  };

  let token: string;
  let companyId: string;

  beforeAll(async () => {
    await Departament.deleteMany({});
    await Company.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    const defaultCompany = {
      name: 'Exata',
      cnpj: '35980952000101',
      userId: user.id,
    };
    const company = await new Company(defaultCompany).save();
    token = AuthService.generateToken(user.id);
    companyId = company.id;
  });
  describe('When creating a new departament', () => {
    it('should create a departament with success', async () => {
      const newDepartament = {
        name: 'Geral',
        companyId: companyId,
      };

      const response = await global.testRequest
        .post('/departaments')
        .set({ 'x-access-token': token })
        .send(newDepartament);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(objectContaining(newDepartament));
    });

    it('should return 400 when there name is required', async () => {
      const newDepartament = {
        name: '',
        companyId: companyId,
      };

      const response = await global.testRequest
        .post('/departaments')
        .set({ 'x-access-token': token })
        .send(newDepartament);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message:
          'Departament validation failed: name: Path `name` is required.',
      });
    });
  });
});
