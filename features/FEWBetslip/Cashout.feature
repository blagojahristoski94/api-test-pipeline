Feature: Cashout API POST request

  Scenario Outline: Connect and collect data from cashout hub
    When I get Cashout offer from Cashout Hub
    And I make a Cashout POST request for "<TicketType>" ticket

    Examples:
      | TicketType     |
      | singlePrematch |
      | combiPrematch  |

  Scenario Outline: Check the cashouted ticket in Betslip History
    When I make a GET request to fetch Bet identifier for "<Ticket>"
    And I make a GET request to fetch Check Betslip API
    Then I expect the response status to be OK with code 200
    And I expect the ticket ID to be the same as the previously placed "<Ticket>"
    And I expect the response body object to have the following values:
      | KEY | VALUE         |
      | t   | <Type>        |
      | mt  | <BetType>     |
      | c   | <Combination> |
      | cs  | <Status>      |

    Examples:
      | Ticket         | Type                | BetType            | Combination    | Status     |
      | singlePrematch | BetSlip.Single      | BetSlipMatchType.P | Combinations.1 | Cashed Out |
      | combiPrematch  | BetSlip.Accumulator | BetSlipMatchType.P | Combinations.2 | Cashed Out |
