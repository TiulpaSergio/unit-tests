const { logout } = require('C:/Users/User/Desktop/Word/blog/public/viewPost.js'); // Підключення вашого скрипту, де знаходиться функція logout

describe('logout', () => {
    beforeEach(() => {
        global.fetch = jest.fn(); // Створюємо мок для функції fetch
    });

    afterEach(() => {
        global.fetch.mockClear(); // Очищаємо мок після кожного тесту
    });

    it('should log success message when logout is successful', async () => {
        // Підготовка моків для успішного виходу
        global.fetch.mockResolvedValueOnce({ json: () => ({ success: true }), ok: true });
    
        // Перед викликом функції logout перевіряємо, чи функція console.log викликається з правильним повідомленням про успішний вихід
        console.log = jest.fn();
    
        // Виклик функції logout
        await logout();
    
        // Перевірка, що функція console.log викликається з правильним повідомленням про успішний вихід
        expect(console.log).toHaveBeenCalledWith('Ви вийшли з системи');
    });
    

    it('should log error message when logout fails', async () => {
        // Підготовка моків для невдалого виходу
        global.fetch.mockRejectedValueOnce(new Error('Failed to logout'));

        // Перед викликом функції logout перевіряємо, чи функція console.error викликається з правильним повідомленням про помилку
        console.error = jest.fn();

        // Виклик функції logout
        await logout();

        // Перевірка, що функція console.error викликається з правильним повідомленням про помилку
        expect(console.error).toHaveBeenCalledWith('Помилка при виході:', new Error('Failed to logout'));
    });
});