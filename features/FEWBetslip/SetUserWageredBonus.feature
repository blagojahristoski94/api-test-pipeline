Feature: Set User Wagered Bonus web POST request

  Scenario Outline: Validate Paged Matches web GET request
    When I make a POST request for Set User Wagered Bonus on web
    Then I expect the response status to be OK with code 200
    And I expect the response to be with value true