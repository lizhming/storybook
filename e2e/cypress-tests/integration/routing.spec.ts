/* eslint-disable jest/expect-expect */
import { visitExample } from '../helper';

describe('Routing', () => {
  before(() => {
    visitExample();
  });

  it('should navigate to Button story', () => {
    cy.get('#button').click();
    cy.get('#button--with-some-emoji-and-action').click();

    cy.url().should('include', 'path=/story/button--with-some-emoji-and-action');
  });

  it('should directly visit a certain story and render correctly', () => {
    visitExample('?path=/story/button--with-some-emoji-and-action');

    cy.preview().should('contain.text', '😀 😎 👍 💯');
  });
});
