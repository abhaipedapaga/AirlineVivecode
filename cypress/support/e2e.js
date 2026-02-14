Cypress.on('window:before:load', (win) => {
  win.__DISABLE_RANDOM_FAIL__ = true;
});
