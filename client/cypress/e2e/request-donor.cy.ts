import { RequestDonorPage } from '../support/request-donor.po';

const page = new RequestDonorPage();

describe('Donor View', () => {
  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });
  //Tests for the page with no filters
  it('Should have the correct title', () => {
    page.getDonorViewTitle().should('have.text', 'Needs requested');
  });

  it('Should display 7 requests', () => {
    page.getRequestListItems().should('have.length', 7);
  });

});
