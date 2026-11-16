Feature: History API GET request

  Scenario Outline: History API filtered by status "<Status>"
    When I make a GET request to fetch Betslip History with status <StatusCode> placed from "last year" period
    Then I expect the response status to be OK with code 200
    And I expect status of the tickets to be "<Status>"

    Examples:
      | StatusCode | Status    |
      | 0          | Placed    |
      | 1          | Won       |
      | 2          | Lost      |
      | 9          | Void      |
      | 12         | CachedOut |

  Scenario Outline: History API filtered by type "<Type>"
    When I make a GET request to fetch Betslip History for "<TypeIndex>" placed from "last year" period
    Then I expect the response status to be OK with code 200
    And I expect the type of the placed ticket to be "<Type>" betslip type

    Examples:
      | TypeIndex | Type |
      | P         | P    |
      | L         | L    |
      | M         | M    |
      | ABB       | ABB  |
      | BO        | BO   |

  Scenario Outline: History API filtered by placed time for <Period>
    When I make a GET request to fetch Betslip History placed from "<Period>" period
    Then I expect the response status to be OK with code 200
    And I expect the placement date of the returned tickets for "<Period>" to be within the filter date range

    Examples:
      | Period     |
      | today      |
      | last week  |
      | last month |
