Feature: Print Fixture Logo GET request

  Scenario: Validate Print Fixture Logo GET request
    When I make a GET request to fetch Print 'Fixture' Logo
    Then I expect the response status to be OK with code 200
    And I expect the response Content-Type to be image