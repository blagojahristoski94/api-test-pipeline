Feature: Sport Outrights GET request

  Scenario Outline: Validate Sport Outrights GET request
    When I make a GET request to fetch SPort Outrights on web for following sport "<Sport>"
    Then I expect the response status to be OK with code 200
    And I expect tournament name to have appropiate value
    And I expect the response body object to have the following values:
      | KEY | SPORT        |
      | sn  | <Sport>      |
      | sid | <ID>         |
      | cn  | <Country>    |
      | tn  | <Tournament> |

    Examples:
      | Sport      | ID | Country | Tournament     |
      | Ice Hockey | 4  | USA     | NHL            |
      | Soccer     | 1  | England | Premier League |
