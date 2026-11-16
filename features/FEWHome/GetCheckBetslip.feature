Feature: Check Betslip GET request

  Scenario Outline: Validate Check Betslip GET request with Bet identifier
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
      | Ticket         | Type                | BetType            | Combination    | Status |
      | singlePrematch | BetSlip.Single      | BetSlipMatchType.P | Combinations.1 | Placed |
      | combiPrematch  | BetSlip.Accumulator | BetSlipMatchType.P | Combinations.2 | Placed |
      | system         | BetSlip.Combination | BetSlipMatchType.P | Combinations.3 | Placed |
      | singleLive     | BetSlip.Single      | BetSlipMatchType.L | Combinations.1 | Placed |
      | combiLive      | BetSlip.Accumulator | BetSlipMatchType.L | Combinations.2 | Placed |