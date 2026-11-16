Feature: Get User Profile request on mobile

  Scenario: Validate User Profile GET request on mobile
    When I make a GET request to fetch User Profile on mobile
    Then I expect the response status to be OK with code 200
    And I expect the User ID to have appropiate value
    And I expect the Currency Code to have appropiate value
