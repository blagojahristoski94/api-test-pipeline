
Feature: Get Active Special Bet Type Combinations request on web

  Scenario: Validate Active Special Bet Type Combinations GET request
    When I make a GET request to fetch Active Special Bet Type Combinations
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY  | VALUE       |
      | Name | Trixie      |
      | Name | Patent      |
      | Name | Yankee      |
      | Name | Lucky 15    |
      | Name | Canadian    |
      | Name | Lucky 31    |
      | Name | Heinz       |
      | Name | Lucky 63    |
      | Name | Super Heinz |
      | Name | Goliath     |