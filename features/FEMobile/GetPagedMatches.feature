Feature: Paged Matches mobile GET request

  Scenario Outline: Validate Paged Matches mobile GET request
    When I make a GET request to fetch Paged Matches API for "<widgetType>" on mobile
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE |
      | n   | 1X2   |
      | n   | 1     |
      | n   | X     |
      | n   | 2     |

    Examples:
      | widgetType |
      | today      |
      | upcoming   |
      | highlights |
