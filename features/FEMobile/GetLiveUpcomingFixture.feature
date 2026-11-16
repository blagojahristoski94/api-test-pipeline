
Feature: Live Upcoming Fixture GET request on mobile

  Scenario: Validate Live Upcoming Fixture GET request
    When I make a GET request to fetch Live Upcoming Fixture with culture 'en'
    Then I expect the response status to be OK with code 200
    And I expect the response body object to appropiate value

  Scenario: Validate Live Upcoming Fixture GET request with unsupported culture
    When I make a GET request to fetch Live Upcoming Fixture with culture 'mk'
    Then I expect the response status to be NOT OK with code 400
    And I expect the response error message to be "Language not found for mk"
