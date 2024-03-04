# Блог

## Технології

1. Node.js (Серверна частина JS).
2. Express.js (Веб-фреймворк).
3. Mongoose.js (ODM - Об'єктно-документний відображувач).
4. MongoDB (Документ-орієнтована база даних).
5. Passport.js (Аутентифікація та управління сесіями).

## Передумови

Встановіть Node.js [Дивіться це](https://www.guru99.com/download-install-node-js.html) для інструкцій з встановлення.

## Інсталяція

1. Завантажте проєкт як zip-архів або використовуйте git clone [тут](https://github.com/TiulpaSergio/blog).
2. Перейдіть до кореневого каталогу (Blog).
3. Використовуйте стандартний процес встановлення додатка Node.js (npm install).
   - Це повинно встановити всі залежні модулі Node.js з package.json.

## Початок

1. Режим запуску за звичайними правилами (зміни коду не відображаються на льоту) `node app.js`.
2. Відкрийте програму у будь-якому браузері за адресою http://localhost:3000/

## Підключення до MongoDB Atlas

1. Створіть обліковий запис на MongoDB Atlas.
2. Створіть новий кластер для вашого проєкту на головній панелі керування Atlas.
3. У секції "Clusters" виберіть свій кластер.
4. Клацніть "Connect" та виберіть "Connect your application".
5. Скопіюйте рядок підключення для додатку.
6. Замініть рядок підключення в своєму коді, де ви використовуєте Mongoose.

    ```javascript
    const mongoose = require('mongoose');
    mongoose.connect('<Your-Connection-String>', { useNewUrlParser: true, useUnifiedTopology: true });
    ```

7. Зверніть увагу на безпеку вашого рядка підключення та розгляньте використання змінних середовища.

## Додаткові ресурси

- [Офіційна документація MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Офіційна документація Mongoose](https://mongoosejs.com/docs/)
