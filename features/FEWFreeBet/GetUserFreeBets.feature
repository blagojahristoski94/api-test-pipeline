Feature: User Free Bet GET request

  Scenario: Validate User Free Bet GET request
    When I make a GET request to fetch User Free Bet API
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY             | VALUE |
      | NumberFreeBets  | 1     |
      | Currency        | €     |
      | IsNetWinning    | false |
      | ResponseMessage | null  |