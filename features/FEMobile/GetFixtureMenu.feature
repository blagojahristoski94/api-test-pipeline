
Feature: Fixture Menu and sports GET request on mobile

  Scenario: Validate Fixture Menu GET request
    When I make a GET request to fetch Fixture Menu on 'mobile'
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

  Scenario: Validate Mobile Fixtures Sports GET request
    When I make a GET request to fetch Mobile Fixtures Sports
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | SPORT             |
      | n   | Soccer            |
      | n   | Basketball        |
      | n   | Ice Hockey        |
      | n   | Tennis            |
      | n   | Basketball        |
      | n   | Baseball          |
      | n   | American Football |
      | n   | Volleyball        |
      | n   | Handball          |

