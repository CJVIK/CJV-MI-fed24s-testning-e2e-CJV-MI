// cypress/e2e/spec.cy.ts
describe("Movie app tests", () => {

  describe("Initial state and empty results", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("Should display empty results message when searching with no results", () => {
      // assign
      cy.get("#searchText").should("exist");
      cy.get("#movie-container").should("exist").and("be.empty");
      cy.get("#search").should("exist").and("have.text", "Sök");

      // act
      cy.get("#search").click();

      // assert
      cy.get("#movie-container p").should("exist")
        .and("have.text", "Inga sökresultat att visa");
    });
  });

  describe("Mocked data tests", () => {
    beforeEach(() => {
      cy.visit("/");

      // assign MOCK API RESPONSE  
      cy.intercept("GET", "http://omdbapi.com/*", {
        statusCode: 200,
        body: {
          Search: [
            {
              Title: "Mother of all tests",
              Year: "2012",
              imdbID: "tt123456",
              Type: "movie",
              Poster: "https://via.placeholder.com/150"
            }
          ]
        }
      }).as("mockSearch");
    });

    it("Should display mocked movie data after search", () => {
      // assign
      cy.get("#searchText").type("test");
      cy.get("#movie-container").should("exist").and("be.empty");

      // act

      cy.get("#search").click();

      // MOCK API RESPONSE från intercept ovan
      cy.wait("@mockSearch");

      // assert
      cy.get("#movie-container").should("exist").and("not.be.empty");
      cy.get(".movie").should("have.length", 1);
      cy.get(".movie h3").should("have.text", "Mother of all tests");
      cy.get(".movie img").should("have.attr", "src", "https://via.placeholder.com/150");
      cy.get(".movie img").should("have.attr", "alt", "Mother of all tests");
    });
  });

  describe("Happy flow with API", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("Should display real movie data from API", () => {
      // assign
      cy.get("#searchText").should("exist");
      cy.get("#movie-container").should("exist").and("be.empty");
      cy.get("#searchText").type("Star Wars");

      // act
      cy.get("#search").click();

      // assert
      cy.get(".movie", { timeout: 10000 }).should("exist");
      cy.get(".movie h3").should("exist");
      cy.get(".movie h3").should("contain.text", "Star Wars");
      cy.get(".movie img").should("exist");
    });
  });
});