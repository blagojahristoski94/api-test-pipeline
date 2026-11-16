Feature: Search User GET request

  Scenario Outline: Validate Search User GET request
    When I make a GET request to API Search User "<Username>"
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE           |
      | un  | <Username>      |
      | n   | API Testing     |
      | cc  | EUR             |
      | em  | api@testing.com |

    Examples:
      | Username   |
      | apiTesting |