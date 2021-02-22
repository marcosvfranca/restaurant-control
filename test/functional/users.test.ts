import { User } from '@src/models/user';
import AuthService from '@src/services/auth';

describe('Users functional tests', () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });
  describe('When creating a new user', () => {
    it('should create a user with success a with encrypted password', async () => {
      const newUser = {
        name: 'Marcos',
        email: 'mfranca@exata.net',
        password: '123456',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
      await expect(
        AuthService.comparePasswords(newUser.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        })
      );
    });

    it('should return 400 when there email is required', async () => {
      const newUser = {
        name: 'Marcos',
        email: '',
        password: '123456',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message: 'User validation failed: email: Path `email` is required.',
      });
    });

    it('should return 409 when the email already users', async () => {
      const newUser = {
        name: 'Marcos',
        email: 'mfranca@exata.net',
        password: '123456',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'Conflict',
        message:
          'User validation failed: email: already exists in the database.',
      });
    });

    it('should return 409 when the email is invalid', async () => {
      const newUser = {
        name: 'Marcos',
        email: 'invalid_mail',
        password: '123456',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'Conflict',
        message: 'User validation failed: email: is invalid value.',
      });
    });
  });
  describe('When authenticating a user', () => {
    it('should generate a token for a valid user', async () => {
      const newUser = {
        name: 'Marcos',
        email: 'mfranca2@exata.net',
        password: '123456',
      };
      await new User(newUser).save();
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: newUser.password });
      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });
    it('should return UNAUTHORIZED if the user with the given email is not found', async () => {
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: 'some-user@email.com', password: '123456' });
      expect(response.status).toBe(401);
    });
    it('should return UNAUTHORIZED if the password is incorrect', async () => {
      const newUser = {
        name: 'Marcos',
        email: 'mfranca3@exata.net',
        password: '123456',
      };
      await new User(newUser).save();
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: '654321' });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        code: 401,
        error: 'Unauthorized',
        message: 'Password does not match!',
      });
    });
  });
});
