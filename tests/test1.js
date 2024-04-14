jest.mock('../public/viewPost.js', () => {
    const originalModule = jest.requireActual('../public/viewPost.js');
    return {
      ...originalModule,
      fetchPosts: jest.fn(() => Promise.resolve()),
    };
  });
  
  const { fetchCurrentUser, fetchPosts } = require('../public/viewPost.js');
  
  describe('fetchPosts function', () => {
    test('fetchPosts function is called', async () => {
      await fetchPosts();
  
      expect(fetchPosts).toHaveBeenCalled();
    });
  });
  