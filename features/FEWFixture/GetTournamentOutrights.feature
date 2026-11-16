Feature: Tournament Outrights GET request

  Scenario: Validate Tournament Outrights GET request
    When I make a GET request to fetch Highlights for following sport "Soccer"
    When I make a GET request to fetch Tournament Outrights on web
    Then I expect the response status to be OK with code 200
    And I expect tournament name to have appropiate value
    And I expect the response body object to have the following values:
      | KEY | SPORT  |
      | n   | Soccer |
      | su  | false  |
      | ttn | Other  |