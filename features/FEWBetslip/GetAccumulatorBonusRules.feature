
Feature: Accumulator Bonus Rules API GET request

  Scenario: Calculate Bonus API
    When I make a GET request to fetch Accumulator Bonus Rules
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY                            | VALUE |
      | MaxBonus                       | 1000  |
      | BonusOnPotentinalWinningAmount | false |

  # Negative Scenarios
  Scenario: Validate Accumulator Bonus Rules GET request with invalid brandId returns validation error
    When I make a GET request to fetch Accumulator Bonus Rules with brandId "abc"
    Then I expect the response status to be NOT OK with code 400
    And I expect the response body object to have the following values:
      | property       | expectedValue                           |
      | errors.brandId | The value 'abc' is not valid.           |
      | title          | One or more validation errors occurred. |

  Scenario Outline: Validate Accumulator Bonus Rules GET request with non-existent brandId returns null values
    When I make a GET request to fetch Accumulator Bonus Rules with brandId "<brandId>"
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY              | VALUE |
      | AccumulatorRules | null  |
      | MaxBonus         | null  |

    Examples:
      | brandId |
      | 10      |
      | 99999   |
      | -123    |
