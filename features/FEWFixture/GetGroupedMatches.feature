Feature: Get Grouped Matches request on web

  Scenario Outline: Validate Grouped Matches GET request on web
    Given I make GET request to fetch upcoming Widget for following "<Sport>"
    When I make a GET request to fetch Grouped Matches on web
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY    | VALUE        |
      | n      | <SportName>  |
      | n      | 1            |
      | n      | 2            |
      | is3way | <is3way>     |
      | n      | <MarketName> |

    Examples:
      | Sport            | SportName         | MarketName | is3way |
      | Soccer           | Soccer            | 1X2        | true   |
      | AmericanFootball | American Football | Money Line | false  |
      | Tennis           | Tennis            | Winner     | false  |