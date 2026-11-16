Feature: Sports Tabs GET request on web

  Scenario: Validate Fixture Sports Tabs GET request on web
    When I make a GET request to fetch Sports Tabs on web
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | SPORT   |
      | n   | Soccer  |
      | n   | Popular |
      | n   | Goals   |
      | n   | totals  |