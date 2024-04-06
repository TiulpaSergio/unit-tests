jest.mock('C:/Users/User/Desktop/Word/blog/public/viewPost.js', () => {
    const originalModule = jest.requireActual('C:/Users/User/Desktop/Word/blog/public/viewPost.js');
    return {
      ...originalModule,
      fetchPosts: jest.fn(() => Promise.resolve()),
    };
  });
  
  const { fetchCurrentUser, fetchPosts } = require('C:/Users/User/Desktop/Word/blog/public/viewPost.js');
  
  describe('fetchPosts function', () => {
    test('fetchPosts function is called', async () => {
      // Виклик функції fetchPosts
      await fetchPosts();
  
      // Перевірка, чи була викликана функція fetch
      expect(fetchPosts).toHaveBeenCalled();
    });
  });
  