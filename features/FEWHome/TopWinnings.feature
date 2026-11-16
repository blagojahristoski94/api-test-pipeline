Feature: Top Winnings GET request on web

  Scenario Outline: Validate Top Winnings GET request on web
    When I make a GET request to fetch Top Winnings API
    Then I expect the response status to be OK with code 200
    And I expect the usernames to be encrypted in the middle
    And I expect bet payout to have appropiate value