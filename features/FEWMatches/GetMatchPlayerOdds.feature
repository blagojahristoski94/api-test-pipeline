Feature: MatchPlayerOdds GET request

  Scenario: Validate MatchPlayerOdds GET request
    When I make a GET request to fetch Get Match Player Odds
    Then I expect the response status to be OK with code 200
    And I expect the Odds for All Markets to have appropiate value
    And I expect the response body object to have the following values:
      | KEY | VALUE          |
      | s   | null           |
      | n   | Player Markets |
      | n   | {PlayerAL}     |
      | n   | {PlayerW}      |
      | n   | {PlayerY}      |
    And I expect response body object to return array with key "matchTabs" and to have following values
      | KEY | VALUE          |
      | n   | Player Markets |
      | id  | 0              |



