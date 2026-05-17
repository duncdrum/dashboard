describe('The dashboard', function () {
  it('should load', function () {
    cy.visit('/dashboard/index.html');
  });

  describe('admin login', function () {
    before(function () {
      cy.get('existdb-launcher-app')
        .find('a#login', { includeShadowDom: true })
        .click()
        .url()
        .should('include', '/dashboard/login.html')
        .get('#user')
        .type('admin')
        .get('.button')
        .click()
        .url()
        .should('include', '/dashboard/admin#/launcher');
    });

    it('should enable package manager', function () {
      cy.get('body')
        .find('wa-dropdown-item', { includeShadowDom: true })
        .contains('Package Manager')
        .click()
        .url()
        .should('include', 'dashboard/admin#/packagemanager');
    });

    it('should enable user manager', function () {
      cy.get('body')
        .find('wa-dropdown-item', { includeShadowDom: true })
        .contains('User Manager')
        .click()
        .url()
        .should('include', 'dashboard/admin#/usermanager');
    });

    it('should enable backup', function () {
      cy.get('body')
        .find('wa-dropdown-item', { includeShadowDom: true })
        .contains('Backup')
        .click()
        .url()
        .should('include', 'dashboard/admin#/backup');
    });

    it('should enable settings', function () {
      cy.get('body')
        .find('wa-dropdown-item', { includeShadowDom: true })
        .contains('Settings')
        .click()
        .url()
        .should('include', 'dashboard/admin#/settings');
    });

    after(function () {
      cy.get('body')
        .find('wa-dropdown-item', { includeShadowDom: true })
        .contains('Logout')
        .click()
        .url()
        .should('include', 'dashboard/index.html?logout=true');
    });
  });
});
