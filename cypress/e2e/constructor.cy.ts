import ingredients from '../fixtures/ingredients.json';

 const mockUser = {
    email: 'test@example.com',
    password: 'password'
  };

  const mockOrderResponse = {
    success: true,
    name: 'Заказ успешно создан',
    order: {
      number: 12345
    }
  };

describe('доступность приложения', () => {
  it('сервис должен быть доступен по адресу localhost:4000', () => {
    cy.visit('/');
  })
});

describe('процесс входа в систему', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', 'api/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        token: 'mockAuthToken'
      }
    }).as('mockLogin');
  });

  it('пользователь может войти с моковыми данными', () => {
    cy.get('[name="email"]').type(mockUser.email);
    cy.get('[name="password"]').type(mockUser.password);
    cy.get('form').submit();

    cy.wait('@mockLogin').its('request.body').should('deep.equal', {
      email: mockUser.email,
      password: mockUser.password
    });

    cy.url().should('eq', 'http://localhost:4000/');
  });
});

describe('страница конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      statusCode: 200,
      body: ingredients,
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
  });

  it('добавление булки и начинок в конструктор', () => {
    cy.get('[data-cy="bun"]').first().contains('Добавить').click();
    cy.get('[data-cy="main"]').first().contains('Добавить').click();
    cy.get('[data-cy="main"]').eq(3).contains('Добавить').click();
    cy.get('[data-cy="sauce"]').first().contains('Добавить').click();
    cy.get('[data-cy="constructor"]').find('[data-cy="bun-top"]').should('exist');
    cy.get('[data-cy="constructor"]').find('[data-cy="filling"]').should('exist');
  });

  it('открытие и закрытие модального окна ингредиента', () => {
    cy.get('[data-cy="bun"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mockAuthToken');
    });

    cy.intercept('GET', 'api/auth/user', {
      statusCode: 200,
      body: { email: mockUser.email }
    }).as('getUserData');

    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      body: mockOrderResponse
    }).as('createOrder');

    cy.intercept('POST', 'api/auth/login', {
            statusCode: 200,
            body: {
              success: true,
              token: 'mockAuthToken'
            }
          }).as('mockLogin');

    cy.visit('/');
  });

  it('собирается бургер и оформляется заказ', () => {
    cy.get('[data-cy="bun"]').first().contains('Добавить').click();
    cy.get('[data-cy="main"]').first().contains('Добавить').click();
    cy.get('[data-cy="sauce"]').first().contains('Добавить').click();

    cy.get('[data-cy="submit-order"]').click();

    cy.get('[name="email"]').type(mockUser.email);
    cy.get('[name="password"]').type(mockUser.password);
    cy.get('form').submit();

    cy.get('[data-cy="submit-order"]').click();

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain', mockOrderResponse.order.number);

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    cy.get('[data-cy="bun-top"]').should('not.exist');
    cy.get('[data-cy="filling"]').children().should('have.length', 1);
    cy.get('[data-cy="bun-top-empty"]').contains('Выберите булки').should('be.visible');
    cy.get('[data-cy="filling-empty"]').contains('Выберите начинку').should('be.visible');
  });
});
