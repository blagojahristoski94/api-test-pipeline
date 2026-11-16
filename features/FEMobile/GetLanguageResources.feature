
Feature: Language Resources GET request on mobile

  Scenario: Validate Language Resources GET request
    When I make a GET request to fetch Language Resources on 'mobile' with culture 'en'
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY                                  | VALUE     |
      | Outcome.Even                         | Even      |
      | W.Stake                              | Stake     |
      | W.Amount                             | Amount    |
      | W.M.None                             | None      |
      | W.M.O                                | Over      |
      | W.M.Odd                              | Odd       |
      | W.M.OddEven                          | Odd/Even  |
      | Outcome.Draw                         | Draw      |
      | Accumulator.MaxBonus                 | Max Bonus |
      | Accumulator.MinOdd                   | Min. Odd  |
      | AussieRulesLiveOddType.AsianHandicap | Spread    |
      | AuthorizeBetSlips.Download           | Download  |
      | AuthorizeBetSlips.Filters            | Filters   |
      | BetSlip.System                       | System    |
      | BetSlip.Single                       | Single    |
      | BetSlipMatchType.L                   | Live      |
      | BetSlipMatchType.O                   | Outright  |
      | BetSlipStatusType.Accepted           | Accepted  |

  Scenario: Validate Language Resources GET request without params
    When I make a GET request to fetch Language Resources on 'mobile' without params
    Then I expect the response status to be NOT OK with code 400
    And I expect the response body object to have the following values:
      | property       | expectedValue                           |
      | errors.culture | The culture field is required.          |
      | title          | One or more validation errors occurred. |

  Scenario: Scenario: Validate Language Resources GET request with unsupported culture
    When I make a GET request to fetch Language Resources on "mobile" with culture "<culture>"
    Then I expect the response status to be NOT OK with code 400
    And I expect the response error message to be "Language not found for <culture>"
    Examples:
      | culture |
      | ''      |
      | 123     |
      | mk      |