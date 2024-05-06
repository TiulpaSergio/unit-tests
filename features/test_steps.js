const { Given, When, Then } = require('cucumber');
const { Builder, By, Key, until } = require('selenium-webdriver');

let driver;

Given('Користувач відкриває сторінку авторизації', async function () {
  driver = await new Builder().forBrowser('chrome').build();
  await driver.get('http://localhost:3000/authorization');
});

When('Користувач вводить ім\'я користувача {string} та пароль {string}', async function (username, password) {
  const usernameField = await driver.findElement(By.id('username'));
  await usernameField.sendKeys(username);
  
  const passwordField = await driver.findElement(By.id('password'));
  await passwordField.sendKeys(password);
});

When('Користувач натискає кнопку {string}', async function (buttonName) {
  const loginButton = await driver.findElement(By.xpath("//button[@type='submit']"));
  await loginButton.click();
});

Then('Користувач переходить на головну сторінку', async function () {
  await driver.wait(until.titleIs('Блог - Пости'), 10000);
});
