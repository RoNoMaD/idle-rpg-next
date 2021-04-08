/* eslint-disable jest/expect-expect */
describe("smoke", () => {
  before(() => {
    cy.log(`Visiting ${Cypress.env("SITE_NAME")}`);
    cy.visit("/");
  });

  it("Login with Github", () => {
    const username = Cypress.env("GITHUB_USER");
    const password = Cypress.env("GITHUB_PW");
    const loginUrl = `${Cypress.env("SITE_NAME")}/api/auth/signin`;
    const cookieName = Cypress.env("COOKIE_NAME");
    const socialLoginOptions = {
      username,
      password,
      loginUrl,
      headless: true,
      logs: true,
      isPopup: false,
      loginSelector: `.signin .provider form[action="${Cypress.env(
        "SITE_NAME"
      )}/api/auth/signin/github"] button[type="submit"]`,
      postLoginSelector: `[data-testid="username-display"]`,
    };

    return cy
      .task("GitHubSocialLogin", socialLoginOptions)
      .then(({ cookies }) => {
        cy.clearCookies();

        cy.log({ cookies });

        const cookie = cookies
          .filter((cookie) => cookie.name === cookieName)
          .pop();
        if (cookie) {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
          });

          Cypress.Cookies.defaults({
            preserve: cookieName,
          });
        }
      });
  });

  it("New Character", () => {
    cy.visit("/");
    const newCharacterName = "Frodo";
    cy.findByRole("link", { name: /new character/i }).click();
    cy.findByRole("textbox", { name: /name/i }).click().type(newCharacterName);
    cy.findByRole("button", { name: /create/i }).click();
    cy.findByRole("heading", { name: newCharacterName });
  });

  it("Update Character", () => {
    cy.findByRole("heading", { name: /frodo/i }).click();
    cy.findByRole("link", { name: /edit/i }).click();
    cy.findByRole("spinbutton", { name: /magik/i }).click().type("{upArrow}");
    cy.findByRole("button", { name: /submit/i }).click();
  });

  it("Delete Character", () => {
    cy.visit("/");
    cy.findByRole("heading", { name: /frodo/i }).click();
    cy.findByRole("button", { name: /delete/i }).click();
  });

  it("Logout", () => {
    cy.visit("/api/auth/signout");
    cy.get("form").submit();
  });
});
