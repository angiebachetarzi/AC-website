describe('Form', () => {
  beforeEach(() => {
    cy.visit('/');
  })

  it('it focuses the input', () => {
    cy.focused().should('have.class', 'form-control')
  })

  it('displays email and password', () => {
  cy.get('.form-control')
    .should('have.length', 2);
  })

  it('accepts input', () => {
  const input = "mytestemail@test.com"
  cy.get('[data-cy-form-input]')
    .type(input)
    .should('have.value', input);
  })
})
