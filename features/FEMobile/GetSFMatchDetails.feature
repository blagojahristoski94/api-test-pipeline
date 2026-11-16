Feature: Get Swish Match Details

  Scenario: Validate Swish match details
    When I make a GET request to fetch Fixtures Menu BB API
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY             | VALUE |
      | ResponseMessage | null  |
      | ResponseCode    | 0     |
    And I make a GET request to fetch all Grouped Matches BB API
    Then I expect the response status to be OK with code 200
    When I make a GET request to fetch the Swish match details API
    Then I expect the response status to be OK with code 200
    And I expect the Odds for All Swish Markets to have appropiate value