Feature: AllSettings GET request on web

  Scenario: Validate response currencies, signs and rates on web
    When I make a GET request to fetch All Settings on 'web'
    Then I expect the response status to be OK with code 200
    And I expect the response to have the following currencies, signs and rates
      | currencies | currencySign | exchangeRate |
      | EUR        | €            | 1            |
      | USD        | $            | 0.8729050279 |
      | GBP        | £            | 1.1532695191 |
      | NGN        | N            | 0.0006402476 |
      | XAF        | CFA          | 0.0015254146 |

