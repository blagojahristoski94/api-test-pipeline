Feature: System Placement API POST request
  
  Scenario: System Placement API
    When I make a GET request to fetch Highlights for following sport "<Sport>"
    When I open Notification Hub
    When I make a POST request for system placement with "3" events and stake "16"
    Then I expect the response status to be OK with code 200
    And I expect the BetSlipGroupID to match the BetSlip number in the waiting for authorization and has been accepted Notification Messages
    When I save ticketsIDs for system prematch
    And I make a GET request to fetch Betslip History Details for system Prematch
    Then I expect the response status to be OK with code 200
    Then I expect the response status to be OK with code 200
    And I expect that the betting time of last placed tickets to not be greater than 1 minute
    And I expect status of the tickets to be "<Status>"
    And I expect the type of the placed ticket to be "<Type>" bet type
    And I expect the type of the placed ticket to be "<BetType>" betslip type
    And I expect the Bet combination to have appropriate value
    And I expect the total Stake to have appropriate value

    Examples:
      | Sport  | Type                | BetType            | Status |
      | Soccer | BetSlip.Combination | P                  | Placed |
