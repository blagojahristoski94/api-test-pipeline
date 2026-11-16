Feature: Get Algo Price POST request

  Scenario Outline: Validate Get Algo Price POST request
    When I make a GET request to fetch Highlights for following sport "<Sport>"
    And I make a GET request to fetch Get Match Odds on "web"
    And I make a POST request to API Get Algo Price for markets Winner and "<marketID>"
    Then I expect the response status to be OK with code 200
    And I expect response body to have TotalOdds and probability values greater than 0
    And I open Notification Hub
    When I make a POST request for Algo Placement with stake "16"
    Then I expect the response status to be OK with code 200
    And I expect the Response Message to be "Ticket is waiting for authorization."
    And I wait for Notification Message containing "has been accepted"
    When I save ticketsIDs for algo single prematch

    Examples:
      | Sport  | marketID        |
      | Soccer | Over Under      |
      | Soccer | Odd Even        |
      | Tennis | First set Total |

  Scenario: I validate the placed tickets in Betslip History Details
    When I make a GET request to fetch Betslip History Details for algo single Prematch
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE                    |
      | st  | BetSlipStatusType.Placed |
      | ty  | BetSlipMatchType.ABB     |
      | bty | BetSlip.Single           |


  Scenario Outline: Negativ Get Algo Price POST request
    When I make a GET request to fetch Highlights for following sport "<Sport>"
    And I make a GET request to fetch Get Match Odds on "web"
    And I make a POST request to API Get Algo Price for markets Winner and "<marketID>"
    Then I expect the response status to be OK with code 200
    Then I expect the response to be "Incompatible Algo Item"

    Examples:
      | Sport  | marketID                       |
      | Soccer | Home & Away                    |
      | Tennis | First Player and Second Player |