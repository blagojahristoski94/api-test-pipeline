
Feature: Language Resources GET request on web

  Scenario: Validate Language Resources GET request
    When I make a GET request to fetch Language Resources on 'web' with culture 'en'
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY                         | VALUE     |
      | Outcome.Even                | Even      |
      | W.Stake                     | Stake     |
      | W.Amount                    | Amount    |
      | W.M.None                    | None      |
      | W.M.O                       | Over      |
      | W.M.Odd                     | Odd       |
      | W.M.OddEven                 | Odd/Even  |
      | BetSlip.System              | System    |
      | BetSlip.Single              | Single    |
      | BetSlipMatchType.L          | Live      |
      | BetSlipMatchType.O          | Outright  |
      | BetSlipStatusType.Accepted  | Accepted  |
      | BetSlipStatusType.Lost      | Lost      |
      | BetSlipStatusType.Placed    | Placed    |
      | BetSlipStatusType.Cancelled | Cancelled |
      | BetSlip.Market              | Market    |
      | Button.Calculate            | Calculate |

  Scenario: Validate Language Resources GET request without params
    When I make a GET request to fetch Language Resources on 'web' without params
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY                         | VALUE     |
      | Outcome.Even                | Even      |
      | W.Stake                     | Stake     |
      | W.Amount                    | Amount    |
      | W.M.None                    | None      |
      | W.M.O                       | Over      |
      | W.M.Odd                     | Odd       |
      | W.M.OddEven                 | Odd/Even  |
      | BetSlip.System              | System    |
      | BetSlip.Single              | Single    |
      | BetSlipMatchType.L          | Live      |
      | BetSlipMatchType.O          | Outright  |
      | BetSlipStatusType.Accepted  | Accepted  |
      | BetSlipStatusType.Lost      | Lost      |
      | BetSlipStatusType.Placed    | Placed    |
      | BetSlipStatusType.Cancelled | Cancelled |
      | BetSlip.Market              | Market    |
      | Button.Calculate            | Calculate |

  Scenario: Scenario: Validate Language Resources GET request with unsupported culture
    When I make a GET request to fetch Language Resources on "web" with culture "<culture>"
    Then I expect the response status to be NOT OK with code 400
    And I expect the response error message to be "Language not found for <culture>"
    Examples:
      | culture |
      | ''      |
      | 123     |
      | mk      |