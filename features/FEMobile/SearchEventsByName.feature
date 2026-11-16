Feature: Search Events By Name GET request on mobile

  Scenario Outline: Validate Search Events By Name GET request on mobile
    When I make a GET request to fetch Search Events By Name on "mobile" with search term "<Search>"
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE        |
      | sn  | <Sport>      |
      | cn  | <Country>    |
      | tn  | <Tournament> |
      | t   | P            |

    Examples:
      | Search  | Sport      | Country | Tournament |
      | NBA     | Basketball | USA     | NBA        |
      | Serie A | Soccer     | Italy   | Serie A    |
      | NHL     | Ice Hockey | USA     | NHL        |
# | NFL     | American Football | USA     | NFL        |