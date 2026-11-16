
Feature: Main Widget Markets API GET request

  Scenario Outline: Fetch data from Main Widget Markets API with valid culture
    When I make a GET request to fetch Main Widget Markets with culture "<culture>"
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE                 |
      | n   | <Over/Under>          |
      | n   | <Both teams to score> |
      | n   | <DoubleChance>        |
      | n   | <Odd/Even>            |

    Examples:
      | culture | Over/Under       | Both teams to score        | DoubleChance      | Odd/Even    |
      | en      | Over/Under       | Both teams to score        | Double Chance     | Odd/Even    |
      | fr      | Plus de/Moins de | Les Deux Ã‰quipes Marquent | Double Chance     | Impair/Pair |
      | es      | Altas / Bajas    | Ambos Equipos Anotan       | Doble Oportunidad | Par/Impar   |


  Scenario: Fetch data from Main Widget Markets API with unsupported culture
    When I make a GET request to fetch Main Widget Markets with culture "<culture>"
    Then I expect the response status to be NOT OK with code 400
    And I expect the response error message to be "Language not found for <culture>"
    Examples:
      | culture |
      | ''      |
      | 123     |
      | mk      |

  Scenario: Fetch data from Main Widget Markets API without culture parameter
    When I make a GET request to fetch Main Widget Markets without culture parameter
    Then I expect the response status to be NOT OK with code 400
    And I expect the response body object to have the following values:
      | property | expectedValue                           |
      | Culture  | The culture field is required.          |
      | title    | One or more validation errors occurred. |