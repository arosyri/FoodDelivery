![Tests](https://github.com/arosyri/FoodDelivery/actions/workflows/test.yml/badge.svg)

# Food Delivery App 

## Про проект

**Food Delivery App** - це веб-додаток для замовлення їжі, розроблений з використанням сучасних технологій та **10 патернів проектування**. Додаток дозволяє користувачам переглядати меню, створювати замовлення, застосовувати знижки та відстежувати статус доставки.

## Патерни проектування (10/10)

| № | Паттерн | Файл | Статус |
|---|---------|------|--------|
| 1 | Builder | `patterns/builder/OrderBuilder.js` | ✅ |
| 2 | Factory | `patterns/factory/UserFactory.js` | ✅ |
| 3 | Strategy | `patterns/strategy/payment/PaymentContext.js` | ✅ |
| 4 | Observer | `patterns/observer/NotificationService.js` | ✅ |
| 5 | Chain of Responsibility | `patterns/chain/*.js` | ✅ |
| 6 | Command | `patterns/command/CancelOrderCommand.js` | ✅ |
| 7 | Decorator | `patterns/decorator/*.js` | ✅ |
| 8 | Facade | `patterns/facade/OrderFacade.js` | ✅ |
| 9 | Proxy | `patterns/proxy/MenuProxy.js` | ✅ |
| 10 | State | `patterns/state/*.js` | ✅ |

> <img width="479" height="743" alt="image" src="https://github.com/user-attachments/assets/fdb84abb-8876-4e44-8bac-ac9c8882c2f6" />
> <img width="464" height="606" alt="image" src="https://github.com/user-attachments/assets/b2b16d2b-661c-4287-8062-dece5d5dbe79" />
---
## Скріншоти додатку

### 1. Сторінка аутентифікації
> <img width="1915" height="984" alt="image" src="https://github.com/user-attachments/assets/d715f305-e0bd-46ff-b62b-0e5772149fd3" />
> <img width="1919" height="986" alt="image" src="https://github.com/user-attachments/assets/8a80ea63-c81a-4e63-a615-59e5950bae43" />


*Форма входу/реєстрації з валідацією полів*

### 2. Головна сторінка (Dashboard)
> <img width="1914" height="945" alt="image" src="https://github.com/user-attachments/assets/dd8d68ae-e239-426e-aa2b-e7a6334496d9" />

*Список страв з можливістю додавання до замовлення*

### 3. Форма створення замовлення
> <img width="1707" height="410" alt="image" src="https://github.com/user-attachments/assets/1364f115-e401-4046-8eb1-69dd3125eedf" />

*Вибір кількості, способу оплати, застосування знижки*

### 4. Список замовлень
> <img width="1919" height="944" alt="image" src="https://github.com/user-attachments/assets/f60384ad-c6b8-4059-aee0-c6bd5e171956" />

*Всі замовлення користувача зі статусами*

## Встановлення та запуск

### Вимоги
- Node.js 18+
- MongoDB 
- npm 
## Додаток доступний:
- Фронтенд: http://localhost:5173
- Бекенд API: http://localhost:3000

## Патерни в дії:
| № | Паттерн | Де використовується | 
|---|---------|------|
| 1 | Builder | Створення складних замовлень |
| 2 | Factory | Створення користувачів різних ролей | 
| 3 | Strategy | Різні способи оплати | 
| 4 | Observer | Email/SMS сповіщення | 
| 5 | Chain of Responsibility | Валідація замовлення | 
| 6 | Command | Скасування з можливістю Undo |
| 7 | Decorator | Додавання опцій до замовлення | 
| 8 | Facade | Спрощений API для замовлень | 
| 9 | Proxy | Кешування меню |
| 10 | State | Управління статусами | 

# Висновок
У рамках даної роботи було:

- Розроблено повноцінний веб-додаток для доставки їжі
- Реалізовано 10 патернів проектування
- Створено систему аутентифікації JWT
- Налаштовано роботу з MongoDB
- Проведено тестування всіх патернів
- Оформлено документацію




