describe('The dashboard', function () {
  it('public index loads launcher', function () {
    cy.visit('/dashboard/index.html');
    cy.get('existdb-launcher-app').should('exist');
  });

  describe('admin login', function () {
    before(function () {
      cy.visit('/dashboard/admin#/launcher');
      cy.get('existdb-dashboard').should('exist');
    });

    it('should show launcher page', function () {
      cy.get('existdb-dashboard').should('exist');
      cy.url().should('include', '/dashboard/admin#/launcher');
    });

    it('should navigate to package manager', function () {
      cy.get('existdb-dashboard').shadow().find('.nav-item').contains('Package Manager').click();
      cy.url().should('include', '/dashboard/admin#/packagemanager');
      cy.get('existdb-dashboard').find('existdb-packagemanager').should('exist');
    });

    it('should navigate to user manager', function () {
      cy.get('existdb-dashboard').shadow().find('.nav-item').contains('User Manager').click();
      cy.url().should('include', '/dashboard/admin#/usermanager');
      cy.get('existdb-dashboard').find('existdb-usermanager-app').should('exist');
    });

    it('should navigate to backup', function () {
      cy.get('existdb-dashboard').shadow().find('.nav-item').contains('Backup').click();
      cy.url().should('include', '/dashboard/admin#/backup');
      cy.get('existdb-dashboard').find('existdb-backup-app').should('exist');
    });

    it('should navigate to settings', function () {
      cy.get('existdb-dashboard').shadow().find('.nav-item').contains('Settings').click();
      cy.url().should('include', '/dashboard/admin#/settings');
      cy.get('existdb-dashboard').find('existdb-settings').should('exist');
    });

    after(function () {
      cy.visit('/dashboard/index.html?logout=true');
    });
  });
});
