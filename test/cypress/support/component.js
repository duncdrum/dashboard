import '../../../src/existdb-dashboard.js';

Cypress.Commands.add('mount', (html) => {
  return cy.get('#root').then(($root) => {
    $root.html(html);
  });
});
