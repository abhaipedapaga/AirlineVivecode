describe('Booking flow', () => {
  it('login -> search -> flight -> seat -> checkout -> bookings', () => {
    cy.visit('/login');

    // adjust selectors to your actual login inputs
    cy.get('input[type="email"]').type('demo@example.com');
    cy.get('input[type="password"]').type('password');
    cy.contains(/login/i).click();

    cy.visit('/search');
    cy.contains(/view/i).first().click();

    cy.contains(/Seat Map/i);
    cy.get('button[aria-label*="available"]').first().click();

    cy.contains(/checkout/i).click();
    cy.contains(/confirm booking/i).click();

    cy.url().should('include', '/bookings');
  });
});
