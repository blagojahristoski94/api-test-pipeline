Feature: Set User Wagered Bonus mobile POST request

  Scenario Outline: Validate Paged Matches mobile GET request
    When I make a POST request for Set User Wagered Bonus on mobile
    Then I expect the response status to be OK with code 200
    And I expect the response to be with value true