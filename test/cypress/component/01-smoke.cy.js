describe('existdb-dashboard smoke', () => {
  it('registers existdb-dashboard', () => {
    cy.mount('<existdb-dashboard></existdb-dashboard>');
    cy.get('existdb-dashboard').should('exist');
  });

  it('renders drawer and header', () => {
    cy.mount('<existdb-dashboard></existdb-dashboard>');
    cy.get('existdb-dashboard').shadow().contains('eXist-db Dashboard');
    cy.get('existdb-dashboard').shadow().find('wa-drawer').should('exist');
    cy.get('existdb-dashboard').shadow().find('.nav-item').should('have.length.at.least', 5);
  });
});
