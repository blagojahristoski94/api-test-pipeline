Feature: Highlights API GET request

  Scenario Outline: Fetch data from Highlights API
    When I make a GET request to fetch Highlights for following sport "<sport>"
    Then I expect the response status to be OK with code 200
    And I expect response body object to return array with key "highlights" and to have following values
      | KEY | VALUE  |
      | sn  | "<sn>" |
      | sid | <id>   |


    Examples:
      | sport             | sn       | id |
      | American Football | Football | 14 |
      | Soccer            | Soccer   | 1  |
