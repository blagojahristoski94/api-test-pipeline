Feature: Tournament Match Odds GET request on web

  Scenario: Validate Fixture Tournament Match Odds GET request on web
    When I make a GET request to fetch Tournament Match Odds on web
    Then I expect the response status to be OK with code 200
    And I expect the Odds for Tournament to have appropiate value
    And I expect the response body object to have the following values:
      | KEY | SPORT |
      | n   | 1X2   |
      | n   | 1     |
      | n   | X     |
      | n   | 2     |
      | su  | false |