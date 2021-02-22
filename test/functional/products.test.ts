import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import objectContaining = jasmine.objectContaining;
import { Product, STATUS } from '@src/models/product';
import { Company } from '@src/models/company';
import { Departament } from '@src/models/departament';

describe('Products functional tests', () => {
  const defaultUser = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '123456',
  };
  let token: string;
  let companyId: string;
  let departamentId: string;

  beforeAll(async () => {
    await Company.deleteMany({});
    await Departament.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

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
  });
  describe('When creating a new product', () => {
    it('should create a product with success', async () => {
      const newProduct = {
        name: 'Product 1',
        description: 'Description Product 1',
        image: '',
        price: 1.99,
        status: STATUS.S,
        companyId: companyId,
        departamentId: departamentId,
      };

      const response = await global.testRequest
        .post('/products')
        .set({ 'x-access-token': token })
        .send(newProduct);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(objectContaining(newProduct));
    });

    it('should return 400 when there name is required', async () => {
      const newProduct = {
        name: '',
        description: 'Description Product 1',
        image: '',
        price: 1.99,
        status: STATUS.S,
        companyId: companyId,
        departamentId: departamentId,
      };

      const response = await global.testRequest
        .post('/products')
        .set({ 'x-access-token': token })
        .send(newProduct);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message: 'Product validation failed: name: Path `name` is required.',
      });
    });
  });
});
