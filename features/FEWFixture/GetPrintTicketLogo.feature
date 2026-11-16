Feature: Print Ticket Logo GET request

  Scenario: Validate Print Ticket Logo GET request
    When I make a GET request to fetch Print 'Ticket' Logo
    Then I expect the response status to be OK with code 200
    And I expect the response Content-Type to be image