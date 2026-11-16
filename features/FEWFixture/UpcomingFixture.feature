
Feature: Upcoming Fixture GET request

  Scenario Outline: Validate Upcoming GET request with valid culture
    When I make a GET request to fetch Upcoming Fixture API with culture "<culture>"
    Then I expect the response status to be OK with code 200
    And I expect the response body object to appropiate value
    Examples:
      | culture |
      | en      |
      | fr      |
      | es      |

  Scenario: Validate Upcoming Fixture GET request without params
    When I make a GET request to fetch Upcoming Fixture API without params
    Then I expect the response status to be NOT OK with code 400
    And I expect the response body object to have the following values:
      | property       | expectedValue                           |
      | errors.culture | The culture field is required.          |
      | title          | One or more validation errors occurred. |

  Scenario Outline: Validate Upcoming Fixture GET request with unsupported culture
    When I make a GET request to fetch Upcoming Fixture API with culture "<culture>"
    Then I expect the response status to be NOT OK with code 400
    And I expect the response error message to be "Language not found for <culture>"
    Examples:
      | culture |
      | ''      |
      | 123     |
      | mk      |