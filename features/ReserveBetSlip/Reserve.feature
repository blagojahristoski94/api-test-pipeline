
Feature: Reserve POST request

  Scenario: Validate response for Reserve for Prematch Event
    When I make a POST request to Reserve a Betslip with "prematch" events
    Then I expect the response status to be OK with code 200
    And I expect the booking code to be generated for "prematch"


  Scenario: Validate response for Reserve Live Event
    When I make a POST request to Reserve a Betslip with "live" events
    Then I expect the response status to be OK with code 200
    And I expect the booking code to be generated for "live"
