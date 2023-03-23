import { Request } from 'src/app/requests/request';
import { NewRequestPage } from '../support/new-request.po';

describe('Add request', () => {
  const page = new NewRequestPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text',' Item Request Form ');
  });

  it('Should enable the submit request button once all criteria are met', () => {
    // ADD USER button should be disabled until all the necessary fields
    // are filled. Once the last (`#emailField`) is filled, then the button should
    // become enabled.
    page.newRequestButton().should('be.disabled');
    page.setMatSelect('itemType', 'Food');
    page.newRequestButton().should('be.disabled');
    page.getFormField('description').type('test');
    page.newRequestButton().should('be.disabled');
    // Write a description with more than 5 characters
    page.getFormField('description').type('te1212121212st');
    page.newRequestButton().should('be.enabled');
  });

  it('Should show error messages for invalid inputs', () => {
    // Before doing anything there shouldn't be an error
    cy.get('[data-test=descriptionError]').should('not.exist');
    // Just clicking the description field without entering anything should cause an error message
    page.getFormField('description').click().blur();
    cy.get('[data-test=descriptionError]').should('exist').and('be.visible');
    // Some more tests for various invalid description inputs
    page.getFormField('description').type('Milk').blur();
    cy.get('[data-test=descriptionError]').should('exist').and('be.visible');
    let veryLongString = 'This is a very long name that goes beyond the 50 character limit,This is a very long name that';
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    veryLongString = veryLongString.concat('This is a very long name that goes beyond the 50 characteg name that');
    page.getFormField('description').clear().type(veryLongString).blur();
    cy.get('[data-test=descriptionError]').should('exist').and('be.visible');
    // Entering a valid description should remove the error.
    page.getFormField('description').clear().type('Old dutch chips').blur();
    cy.get('[data-test=descriptionError]').should('not.exist');

    page.setMatSelect('itemType', '--');
    cy.get('[data-test=itemTypeError]').should('exist').and('be.visible');
    page.setMatSelect('itemType', 'Other');
    cy.get('[data-test=itemTypeError]').should('not.exist');
  });

  describe('Adding a new request', () => {

    beforeEach(() => {
      cy.task('seed:database');
    });

    it('Should go to the right page, and have the right info', () => {
      const request: Request = {
        _id: null,
        itemType: 'food',
        foodType: 'meat',
        description: ' TEST REQUEST!!!!',
      };
      page.setMatSelect('itemType', 'Other');
      page.newRequest(request);
      page.getSnackBar().should('contain', `Request successfully submitted`);
      // New URL should end in the 24 hex character Mongo ID of the newly added request
      cy.url()
        .should('match', /\/requests\/client$/)
        .should('not.match', /\/requests\/new$/);

      // The new request should have all the same attributes as we entered
      cy.visit('/requests/donor');
      cy.get('.donor-list-description').should('contain.text', request.description);
      cy.get('.donor-list-itemType').should('contain.text', request.itemType);
      cy.get('.donor-list-foodType').should('contain.text', request.foodType);
      // We should see the confirmation message at the bottom of the screen
    });
  });
});
