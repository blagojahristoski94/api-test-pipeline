Feature: MatchOdds GET request

  Scenario: Validate Match Odds GET request
    When I make a GET request to fetch Get Match Odds on "web"
    Then I expect the response status to be OK with code 200
    And I expect the Odds for All Markets to have appropiate value
