Feature: Outright Details GET request

  Scenario Outline: Validate Outright Details GET request
    When I make a GET request to fetch SPort Outrights on web for following sport "Soccer"
    And I make a GET request to fetch Outright Details API
    Then I expect the response status to be OK with code 200
    And I expect the Odds for Outrights to have appropiate value
    And I expect to have Outrights with the appropriate name