Feature: Match Odds For Market GET request

  Scenario: Validate Match Odds For Market GET request
    When I make a GET request to fetch Match Odds For Market
    Then I expect the response status to be OK with code 200
    And I expect the Odds for Markets on web to have appropiate value
