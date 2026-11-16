Feature: Race Outright GET request

  Scenario Outline: Validate Race Outright GET request
    When I make a GET request to fetch Next Races API for '<SPORT>'
    When I make a GET request to fetch Race Outright API
    Then I expect the response status to be OK with code 200
    And I expect the Odds for Race Outrights to have appropriate value
    And I expect to have Outrights with the appropriate name

    Examples:
      | SPORT        |
      | Horse Racing |
      | Grayhound    |