import { Company } from '@src/models/company';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import objectContaining = jasmine.objectContaining;

describe('Tables functional tests', () => {
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
  describe('When creating a new table', () => {
    it('should create a table with success', async () => {
      const newTable = {
        name: '01',
        number: '01',
        companyId: companyId,
        orderId: null,
      };
      const response = await global.testRequest
        .post('/tables')
        .set({ 'x-access-token': token })
        .send(newTable);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(objectContaining(newTable));
    });

    it('should return 422 when then name is required', async () => {
      const newTable = {
        name: null,
        number: '01',
        companyId: companyId,
        orderId: null,
      };
      const response = await global.testRequest
        .post('/tables')
        .set({ 'x-access-token': token })
        .send(newTable);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message: 'Table validation failed: name: Path `name` is required.',
      });
    });
  });
});
