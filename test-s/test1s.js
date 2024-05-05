const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Авторизація', function() {
  let driver;

  before(async function() {
    this.timeout(30000);
    driver = await new Builder().forBrowser('chrome').build();

    await driver.get('http://localhost:3000/authorization');
    await driver.findElement(By.id('username')).sendKeys('1@1');
    await driver.findElement(By.id('password')).sendKeys('2', Key.RETURN);
    const loginButton = await driver.findElement(By.xpath("//button[@type='submit']"));
    await loginButton.click();
    console.log('Кнопка "Увійти" була натиснута.');
    
    await driver.wait(until.titleIs('Блог - Пости'), 10000);
  });

  it('Має пройти авторизацію коректно', async function() {

    await driver.wait(until.titleIs('Блог - Пости'), 5000);

    const currentUrl = await driver.getCurrentUrl();

    assert.equal(currentUrl, 'http://localhost:3000/');
  });

  after(async function() {
    await driver.quit();
  });
});
