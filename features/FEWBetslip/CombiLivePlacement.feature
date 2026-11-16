Feature: Combi Live Placement API POST request

  Scenario: Combi Live Placement API
    Given I connect to WebSocket and write decompressed data to liveMatches
    And I open Notification Hub
    When I make a POST request place a Combi live ticket with "2" events and stake "16"
    Then I expect the response status to be OK with code 200
    And I expect the BetSlipGroupID to match the BetSlip number in the waiting for authorization and has been accepted Notification Messages
    When I save ticketsIDs for combi live
    And I make a GET request to fetch Betslip History Details for combi live
    Then I expect the response status to be OK with code 200
    And I expect that the betting time of last placed tickets to not be greater than 1 minute
    And I expect status of the tickets to be "Placed"
    And I expect the type of the placed ticket to be "BetSlip.Accumulator" bet type
    And I expect the type of the placed ticket to be "L" betslip type
    And I expect the number of combinations to be 2