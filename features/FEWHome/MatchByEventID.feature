Feature: Match By Event ID GET request on web

  Scenario Outline: Validate Match By Event ID GET request on mobile
    When I make a GET request to fetch Match By Event ID API
    Then I expect the response status to be OK with code 200
    And I expect the Home team to be the same
    And I expect the Away team to be the same
    And I expect the response body object to have the following values:
      | KEY | VALUE          |
      | n   | 1X2            |
      | n   | Odd/Even       |
      | n   | Asian Handicap |
      | sid | 1              |