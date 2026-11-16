Feature: Retrive POST request

  Scenario: Validate response for Retrive a Betslip for Prematch Event
    When I make a POST request to Retrive a Betslip for "prematch" Event with "valid" code
    Then I expect the response status to be OK with code 200
    And I expect the sport for reserved ticket to be Soccer
    And I expect to have only one item for reserved ticket
    And I expect the match name to be the same as the reserved one
    And I expect the tournament name to be the same as the reserved one
    And I expect the Odds to be the same as the reserved one
    And I expect the Max Win to be the same as the reserved one


  Scenario: Validate response for Retrive a Betslip for Live Event
    When I make a POST request to Retrive a Betslip for "live" Event with "valid" code
    Then I expect the response status to be OK with code 200
    And I expect to have only one item for reserved Live ticket
    And I expect the Live match name to be the same as the reserved one
    And I expect the Live tournament name to be the same as the reserved one
    And I expect the Live Odds to be the same as the reserved one
    And I expect the Live Max Win to be the same as the reserved one

  Scenario: Validate response for Retrive a Betslip with invalid code
    When I make a POST request to Retrive a Betslip for "prematch" Event with "invalid" code
    Then I expect the response status to be OK with code 200
    And I expect empty response body for invalid booking code
