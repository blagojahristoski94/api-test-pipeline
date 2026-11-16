Feature: GET Algosport Markets request

  Scenario: Validate Algosport Markets GET request
    When I make a GET request to collect Algo Sports Markets for sport '1'
    Then I expect the response status to be OK with code 200
    And I expect the response body to contain a list of prematch markets


  Scenario: Validate Live Algo Sports Markets GET request
    When I make a GET request to collect Algo Sports Markets for sport '1'
    Then I expect the response status to be OK with code 200
    And I expect the response body to contain a list of live markets