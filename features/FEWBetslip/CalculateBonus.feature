Feature: Calculate Bonus API POST request

  Scenario: Calculate Bonus API
    When I make a POST request for Calculate Bonus API with "5" events and stake "1"
    Then I expect the response status to be OK with code 200
    And I expect the bonus amount to be calculated appropriately
    And I expect Max Winnings to be calculated appropriately
    And I expect Min Winnings to be equal on Max Winnings calculation
    And I expect Min Bonus to be equal on Max Bonus calculation
