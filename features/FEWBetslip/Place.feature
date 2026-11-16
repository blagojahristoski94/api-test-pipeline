Feature: Placement API POST request

  Scenario Outline: Placement API
    When I make a GET request to fetch Highlights for following sport "<Sport>"
    And I open Notification Hub
    When I make a POST request for placement with stake "16"
    Then I expect the response status to be OK with code 200
    And I expect the BetSlipGroupID to match the BetSlip number in the waiting for authorization and has been accepted Notification Messages
    When I save ticketsIDs for single prematch
    When I make a GET request to fetch Betslip History Details for single Prematch
    Then I expect the response status to be OK with code 200
    And I expect that the betting time of last placed tickets to not be greater than 1 minute
    And I expect status of the tickets to be "<Status>"
    And I expect the type of the placed ticket to be "<BetslipType>" betslip type
    And I expect the type of the placed ticket to be "<BetType>" bet type
    And I expect the number of combinations to be <NumberOfCombinations>

    Examples:
      | Sport             | BetType        | BetslipType | Status | NumberOfCombinations |
      | Soccer            | BetSlip.Single | P           | Placed | 1                    |
      | American Football | BetSlip.Single | P           | Placed | 1                    |
  #   | Tennis            | BetSlip.Single | P                  | Placed | 1                    |

  # Negative Scenarios

  Scenario: Placement without both Token and ExternalUserID is rejected
    When I make a GET request to fetch Highlights for following sport "Soccer"
    When I make a POST request for placement without token and without externaluserid with stake "1"
    Then I expect the response status to be OK with code 200
    And I expect the Response Message to be "User not authenticated. Token and ExternalUserID headers missing."

  Scenario: Placement with Token but without ExternalUserID is rejected
    When I make a GET request to fetch Highlights for following sport "Soccer"
    When I make a POST request for placement with token but without externaluserid with stake "1"
    Then I expect the response status to be OK with code 200
    And I expect the Response Message to be "User not authenticated. Invalid Token."

  Scenario: Placement without Token but with ExternalUserID is rejected
    When I make a GET request to fetch Highlights for following sport "Soccer"
    When I make a POST request for placement without token but with externaluserid with stake "1"
    Then I expect the response status to be OK with code 200
    And I expect the Response Message to be "User not authenticated. Invalid Token or ExternalUserID"

  Scenario: Placement with invalid token is rejected
    When I make a GET request to fetch Highlights for following sport "Soccer"
    When I make a POST request for placement with invalid token and stake "1"
    Then I expect the response status to be OK with code 200
    And I expect the Response Message to be "User not authenticated. Invalid Token or ExternalUserID"

  Scenario: Placement with empty body is not allowed
    When I make a GET request to fetch Highlights for following sport "Soccer"
    When I make a POST request for placement with empty body
    Then I expect the response status to be NOT OK with code 415

  Scenario: Placement via GET method is not allowed
    When I make a GET request to the Place endpoint
    Then I expect the response status to be NOT OK with code 405

  Scenario: Placement with stake below the minimum bet amount is not allowed
    When I make a GET request to fetch Highlights for following sport "Soccer"
    And I open Notification Hub
    When I make a POST request for placement with stake "0.01"
    Then I expect the response status to be OK with code 200
    And I wait for Notification Message containing "The minimum allowed Stake amount is"

  Scenario: Placement with stake above the maximum bet amount is not allowed
    When I make a GET request to fetch Highlights for following sport "Soccer"
    And I open Notification Hub
    When I make a POST request for placement with stake "9999999"
    Then I expect the response status to be OK with code 200
    And I wait for Notification Message containing "The maximum allowed Stake is"

  Scenario Outline: Placement with an invalid stake value is not allowed
    When I make a GET request to fetch Highlights for following sport "Soccer"
    And I open Notification Hub
    When I make a POST request for placement with stake "<Stake>"
    Then I expect the response status to be OK with code 200
    And I wait for Notification Message containing "Invalid amount"

    Examples:
      | Stake |
      | -10   |
      | 0     |

  Scenario: Placement with invalid match id is not allowed
    When I make a GET request to fetch Highlights for following sport "Soccer"
    And I open Notification Hub
    When I make a POST request for placement with invalid match id "999999999" and stake "16"
    Then I expect the response status to be OK with code 200
    And I wait for Notification Message containing "Match is not open for betting"

  Scenario: Placement with changed odds is not allowed
    When I make a GET request to fetch Highlights for following sport "Soccer"
    And I open Notification Hub
    When I make a POST request for placement with changed odds and stake "16"
    Then I expect the response status to be OK with code 200
    And I wait for Notification Message containing "BetSlip Odds are changed!"
