import { Company } from '@src/models/company';
import { User } from '@src/models/user';
import { Order } from '@src/models/order';
import AuthService from '@src/services/auth';
import objectContaining = jasmine.objectContaining;

describe('Orders functional tests', () => {
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
    await Order.deleteMany({});

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
  describe('When creating a new order', () => {
    it('should create a order with success', async () => {
      const newOrder = {
        number: '01',
        number_of_customers: 1,
        // status: 1,
        amount: 0.0,
        companyId: companyId,
      };
      const response = await global.testRequest
        .post('/orders')
        .set({ 'x-access-token': token })
        .send(newOrder);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(objectContaining(newOrder));
    });

    it('should return 422 when then number is required', async () => {
      const newOrder = {
        number: '',
        number_of_customers: 1,
        // status: 1,
        amount: 0.0,
        companyId: companyId,
      };
      const response = await global.testRequest
        .post('/orders')
        .set({ 'x-access-token': token })
        .send(newOrder);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message: 'Order validation failed: number: Path `number` is required.',
      });
    });
  });
});
