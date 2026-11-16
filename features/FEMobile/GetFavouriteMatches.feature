Feature: Get Favourite Matches request on mobile

  Scenario: Validate Mobile Favourite Matches GET request
    When I make a POST request to fetch Mobile Favourite Matches
    Then I expect the response status to be OK with code 200
    And I expect the match ID to be the same
    And I expect the Home team to be the same
    And I expect the Away team to be the same
