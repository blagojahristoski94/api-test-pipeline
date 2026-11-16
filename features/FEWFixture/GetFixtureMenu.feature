
Feature: Fixture Menu GET request

  Scenario: Validate Fixture Menu GET request
    When I make a GET request to fetch Fixture Menu on 'web'
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | SPORT      |
      | n   | Soccer     |
      | n   | Basketball |
      | n   | Ice Hockey |
      | n   | Tennis     |
      | n   | Basketball |
      | n   | Baseball   |
    And I expect the response body object to have the following values:
      | KEY | CATEGORY |
      | pn  | Italy    |
      | pn  | USA      |
      | pn  | Germany  |
      | pn  | France   |
      | pn  | England  |
    And I expect the response body object to have the following values:
      | KEY | TOURNAMENT     |
      | n   | NBA            |
      | n   | NHL            |
      | n   | Serie A        |
      | n   | Premier League |

  Scenario Outline: Validate Fixture Menu GET request with invalid load period
    When I make a GET request to fetch Fixture Menu on '<platform>' with load period 'test' and culture 'en' and timeOffset '-60'
    Then I expect the response status to be NOT OK with code 400
    And I expect the response body object to have the following values:
      | property          | expectedValue                                 |
      | errors.LoadPeriod | The value 'test' is not valid for LoadPeriod. |
      | title             | One or more validation errors occurred.       |
    Examples:
      | platform |
      | web      |
      | mobile   |

  Scenario Outline: Validate Fixture Menu GET request with unsupported culture
    When I make a GET request to fetch Fixture Menu on '<platform>' with load period '0' and culture 'mk' and timeOffset '-60'
    Then I expect the response status to be NOT OK with code 400
    And I expect the response error message to be "Language not found for mk"
    Examples:
      | platform |
      | web      |
      | mobile   |
