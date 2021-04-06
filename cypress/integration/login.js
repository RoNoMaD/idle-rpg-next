describe("Login page", () => {
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
      postLoginSelector: `[class^="index_grid"]`,
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

          // remove the two lines below if you need to stay logged in
          // for your remaining tests
          // cy.visit("/api/auth/signout");
          // cy.get("form").submit();
        }
      });
  });

  it("New Character", () => {
    const newCharacterName = "Robert";
    cy.findByRole("link", { name: /new character/i }).click();
    cy.findByRole("textbox", { name: /name/i }).click().type(newCharacterName);
    cy.findByRole("button", { name: /create/i }).click();
    cy.findByRole("heading", { name: newCharacterName });
  });

  it("Update Character", () => {
    const newCharacterName = "Robert";
    cy.findByRole("heading", { name: /robert/i }).click();
    cy.findByRole("link", { name: /edit/i }).click();
  });

  it("Logout", () => {
    cy.visit("/api/auth/signout");
    cy.get("form").submit();
  });
});
