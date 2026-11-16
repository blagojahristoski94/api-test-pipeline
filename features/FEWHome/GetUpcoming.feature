Feature: Upcoming GET request

  Scenario Outline: Validate Upcoming GET request
    When I make a GET request to fetch Upcoming API
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE |
      | n   | 1X2   |
      | n   | 1     |
      | n   | X     |
      | n   | 2     |



