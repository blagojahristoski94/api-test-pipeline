Feature: Category Print API GET request

  Scenario Outline: Fetch data from Category Print API
    When I make a GET request to fetch Category Print API
    Then I expect the response status to be OK with code 200
    And I expect all odds to have appropiate format
