const { logout } = require('../public/viewPost.js');

describe('logout', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        global.fetch.mockClear();
    });

    it('should log success message when logout is successful', async () => {
        global.fetch.mockResolvedValueOnce({ json: () => ({ success: true }), ok: true });
    
        console.log = jest.fn();
    
        await logout();
    
        expect(console.log).toHaveBeenCalledWith('Ви вийшли з системи');
    });
    

    it('should log error message when logout fails', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Failed to logout'));

        console.error = jest.fn();

        await logout();

        expect(console.error).toHaveBeenCalledWith('Помилка при виході:', new Error('Failed to logout'));
    });
});