describe('Form', () => {
  beforeEach(() => {
    cy.visit('/account/register');
  })

  it('it focuses the input', () => {
    cy.focused().should('have.class', 'form-control')
  })

  it('displays email, password, creatorID, confirmPassword, friendCode', () => {
    cy.get('.form-control')
    .should('have.length', 5);
  })

  it('accepts input', () => {
    const input = "falseinput"
    cy.get('[data-cy-form-email]')
    .type(input)
    .should('have.value', input);
    cy.get('[data-cy-form-creatorID]')
    .type(input)
    .should('have.value', input);
    cy.get('[data-cy-form-password]')
    .type(input)
    .should('have.value', input);
    cy.get('[data-cy-form-confirmPassword]')
    .type(input)
    .should('have.value', input);
    cy.get('[data-cy-form-friendCode]')
    .type(input)
    .should('have.value', input);
  })

  it('invalid all', () => {
    const input = "t"
    cy.get('[data-cy-form-creatorID]')
    .type(input)
    cy.get('[data-cy-form-email]')
    .type(input)
    cy.get('[data-cy-form-password]')
    .type(input)
    cy.get('[data-cy-form-confirmPassword]')
    .type(input+input)
    cy.get('[data-cy-form-friendCode]')
    .type(input)
    cy.get('[data-cy-form-email]')
      .type(input)
    cy.get('.is-invalid')
    .should('have.length', 5);
  })

  it('valid register', () => {
    const email = "test@test.com"
    const pass = "Password111"
    const creatorID = "MA-0000-0000-0000"
    const friendCode = "SW-0000-0000-0000"
    cy.get('[data-cy-form-creatorID]')
    .type(creatorID)
    cy.get('[data-cy-form-email]')
    .type(email)
    cy.get('[data-cy-form-password]')
    .type(pass)
    cy.get('[data-cy-form-confirmPassword]')
    .type(pass)
    cy.get('[data-cy-form-friendCode]')
    .type(friendCode)
    .type('{enter}');
    cy.get('.is-invalid')
    .should('have.length', 0);
  })

})
