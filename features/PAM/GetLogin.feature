Feature: Login GET request

  Scenario: Validate Login GET request
    When I make a GET request to Login
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY          | VALUE |
      | IsLoggedIn   | true  |
      | IsSuccessful | true  |
      | IsActivated  | true  |

