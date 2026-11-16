
Feature: User Bonuses GET request on mobile

  Scenario Outline: Validate User Bonuses GET request
    When I make a GET request to fetch User Bonuses API on mobile
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE        |
      | tr  | FreeBet      |
      | n   | BONUSFREEBET |

  # Negative Scenarios
  Scenario: Validate User Bonuses GET request without user parameter returns validation error
    When I make a GET request to fetch User Bonuses API on mobile without user parameter
    Then I expect the response status to be NOT OK with code 400
    And I expect the response body object to have the following values:
      | property    | expectedValue                           |
      | errors.user | The user field is required.             |
      | title       | One or more validation errors occurred. |

  Scenario: Validate User Bonuses GET request with empty user parameter returns validation error
    When I make a GET request to fetch User Bonuses API on mobile with user ""
    Then I expect the response status to be NOT OK with code 400
    And I expect the response body object to have the following values:
      | property    | expectedValue                           |
      | errors.user | The user field is required.             |
      | title       | One or more validation errors occurred. |

  Scenario Outline: Validate User Bonuses GET request with non-existent user returns empty array
    When I make a GET request to fetch User Bonuses API on mobile with user "<user>"
    Then I expect the response status to be OK with code 200
    And I expect the response body to be an empty array

    Examples:
      | user                |
      | 000000000           |
      | this-user-not-exist |
