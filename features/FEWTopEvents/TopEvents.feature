Feature: Top Events API GET request

  Scenario Outline: Validate Top Events API request
    When I make a GET request to fetch Top Events
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE |
      | su  | false |
      | tus | true  |
      | ca  | true  |