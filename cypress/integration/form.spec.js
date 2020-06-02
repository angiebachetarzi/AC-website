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
    const input = "falseemail"
    cy.get('[data-cy-form-input]')
      .type(input)
      .should('have.value', input);
  })

  it('invalid email', () => {
    const input = "falseemail"
    const pass = "testtes";
    cy.get('[data-cy-form-input]')
      .type(input)
      .should('have.length', 1);
    cy.get('[data-cy-form-password]')
      .type(pass)
    cy.get('.is-invalid')
      .should('have.length', 1);
  })

  it('incorrect password', () => {
    const mail = "angie@gmail.com"
    const pass = "testtes";
    cy.get('.alert')
      .should('have.length', 0);
    cy.get('[data-cy-form-input]')
      .type(mail);
    cy.get('[data-cy-form-password]')
      .type(pass)
      .type('{enter}');
    cy.get('.alert')
      .should('have.length', 1);
  })

  it('login', () => {
    const mail = "angie@gmail.com"
    const pass = "testtest";
    cy.get('[data-cy-form-input]')
      .type(mail);
    cy.get('[data-cy-form-password]')
      .type(pass)
      .type('{enter}');
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/')
    })
  })
})
