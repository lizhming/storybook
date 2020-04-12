/* eslint-disable jest/expect-expect */
import { visitExample } from '../helper';

describe('Navigation', () => {
  before(() => {
    visitExample();
  });

  it('should search navigation item', () => {
    cy.get('#storybook-explorer-searchfield').click().clear().type('with some emoji');

    cy.get('.sidebar-container a').should('contain', 'with some emoji and action');

    cy.get('#button--with-some-emoji-and-action').click();

    cy.get('.sidebar-container a').should('not.contain', 'to Storybook');
  });

  it('should display no results after searching a non-existing navigation item', () => {
    cy.get('#storybook-explorer-searchfield').click().clear().type('zzzzzzzzzz');

    cy.get('.sidebar-container').should('contain', 'This filter resulted in 0 results');
  });
});
