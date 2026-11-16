Feature: PlayerInfo GET request

  Scenario: Validate Player Info GET request
    When I make a GET request to fetch Player Info
    Then I expect the response status to be OK with code 200
    Then I expect the response body object to have the following values:
      | KEY | VALUE |
      | ca  | true  |