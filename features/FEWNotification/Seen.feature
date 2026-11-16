Feature: Seen Notification GET request

  Scenario: Validate Seen Notification GET request
    When I make a GET request to fetch Seen Notification API
    Then I expect the response status to be OK with code 200