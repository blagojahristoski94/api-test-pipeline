Feature: Winnings Details GET request

  Scenario Outline: Validate Winnings Details GET request
    When I make a GET request to fetch Winnings Details API
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE              |
      | st  | Placed             |
      | t   | BetSlip.Single     |
      | sn  | Soccer             |
      | mt  | BetSlipMatchType.P |
      | c   | Combinations.1     |
      | cc  | EUR                |