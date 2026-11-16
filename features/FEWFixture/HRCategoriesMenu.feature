Feature: HR Categories Menu GET API requests

  Scenario Outline: Validate the HR Categories Menu GET API requests
    When I make a GET request to fetch HR Categories Menu API
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY   | VALUE   |
      | cname | UK      |
      | cname | France  |
      | cname | Ireland |
      | cname | Japan   |