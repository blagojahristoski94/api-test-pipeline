Feature: Single Live Placement API POST request

  Scenario Outline: Single Live Placement API
    Given I connect to WebSocket and write decompressed data to liveMatches
    And I open Notification Hub
    When I make a POST request place a single live ticket with stake "16"
    Then I expect the response status to be OK with code 200
    Then I expect the response status to be OK with code 200
    And I expect the BetSlipGroupID to match the BetSlip number in the waiting for authorization and has been accepted Notification Messages
    When I save ticketsIDs for single live
    When I make a GET request to fetch Betslip History Details for single live
    Then I expect the response status to be OK with code 200
    And I expect that the betting time of last placed tickets to not be greater than 1 minute
    And I expect status of the tickets to be "Placed"
    And I expect the type of the placed ticket to be "BetSlip.Single" bet type
    And I expect the type of the placed ticket to be "L" betslip type
    And I expect the number of combinations to be 1