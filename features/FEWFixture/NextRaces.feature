Feature: Next Races GET request

  Scenario Outline: Validate the Next Races API response for Horse Racing and Grayhound
    When I make a GET request to fetch Next Races API for '<SPORT>'
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE     |
      | on  | EachWay   |
      | su  | false     |
      | on  | WinSP     |
      | on  | EachWaySP |
      | on  | Place3    |
      | on  | Place2    |
      | on  | Win       |

    Examples:
      | SPORT        |
      | Horse Racing |
      | Grayhound    |