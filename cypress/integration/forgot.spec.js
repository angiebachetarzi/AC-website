describe('Form', () => {
  beforeEach(() => {
    cy.visit('/account/forgot-password');
  })

  it('it focuses the input', () => {
    cy.focused().should('have.class', 'form-control')
  })

  it('invalid email', () => {
  const input = "falseemail"
  cy.get('[data-cy-form-input]')
    .type(input)
    .should('have.length', 1);
  cy.get('.card-header').click()
  cy.get('.is-invalid')
    .should('have.length', 1);
  })

  it('correct email', () => {
  const input = "falseemail@false.com"
  cy.get('[data-cy-form-input]')
    .type(input)
    .should('have.length', 1);
  cy.get('.card-header').click()
  cy.get('.is-invalid')
    .should('have.length', 0);
  })
})
