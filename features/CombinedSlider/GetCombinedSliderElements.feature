Feature: GetCombined Slider Elements GET request

  Scenario Outline: Validate Get Combined Slider Elements GET request
    When I make a GET request to API Get Combined Slider Elements
    Then I expect the response status to be OK with code 200
    And I expect the response body to have array of elements