const request = require('supertest');
const app = require('C:/Users/User/Desktop/Word/blog/server.js'); // Підключаємо ваш сервер

describe('GET /api/posts/:postId/comments', () => {
  it('should return comments for a specific post', async () => {
    // Створюємо тестові дані
    const postData = {
      title: 'Test Post',
      author: 'Test Author',
      body: 'Test Post Body',
      desc: 'Test Description',
    };
    const postResponse = await request(app)
      .post('/create-post')
      .send(postData);

    // Отримуємо id створеного поста
    const postId = postResponse.body.post._id;

    // Додаємо тестовий коментар
    const commentData = {
      text: 'Test Comment',
    };
    await request(app)
      .post(`/api/posts/${postId}/comments`)
      .send(commentData);

    // Виконуємо запит на отримання коментарів для створеного поста
    const response = await request(app).get(`/api/posts/${postId}/comments`);

    // Перевіряємо, чи повертається статус код 200
    expect(response.statusCode).toBe(200);

    // Перевіряємо, чи повертається масив коментарів
    expect(Array.isArray(response.body.comments)).toBeTruthy();

    // Перевіряємо, чи містить кожен коментар правильну структуру
    response.body.comments.forEach(comment => {
      expect(comment).toHaveProperty('_id');
      expect(comment).toHaveProperty('post', postId);
      expect(comment).toHaveProperty('user');
      expect(comment).toHaveProperty('text', commentData.text);
    });
  });
});
