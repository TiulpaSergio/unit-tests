const request = require('supertest');
const app = require('../server.js'); 

describe('API авторизації', () => {
  it('Повинен авторизувати користувача та повернути статус 200', async () => {
    const response = await request(app)
      .post('/authorization')
      .send({ email: '1@1', password: '2' });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('Повинен повернути помилку при неправильних облікових даних', async () => {
    const response = await request(app)
      .post('/authorization')
      .send({ email: 'wrong@example.com', password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Invalid email or password');
  });
});