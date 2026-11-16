Feature: Check Cashout GET request on mobile

  Scenario Outline: Validate Check Cashout GET request
    When I make a GET request to fetch Check Cashout for "<Ticket>" ticket
    Then I expect the response status to be OK with code 200
    And I expect the ticket ID to be the same as the previously placed "<Ticket>"
    And I expect the Cashout Value to have appropiate value

    Examples:
      | Ticket         |
      | singlePrematch |
      | combiPrematch  |