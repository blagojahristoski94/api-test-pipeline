Feature: Cancel Group POST request

  Scenario: Validate Cancel Group POST request
    When I make a GET request to fetch Highlights for following sport "Soccer"
    And I open Notification Hub
    When I make a POST request for placement with stake "16"
    Then I expect the response status to be OK with code 200
    And I expect the Response Message to be "Ticket is waiting for authorization."
    And I wait for Notification Message containing "has been accepted"
    When I save ticketsIDs for single prematch

    And I make a POST request to Cancel Group API
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY             | VALUE |
      | ResponseMessage | null  |
      | ResponseCode    | 0     |

    When I make a GET request to fetch Betslip History Details for single Prematch
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE              |
      | sn  | Soccer             |
      | t   | BetSlip.Single     |
      | st  | Cancelled          |
      | c   | Combinations.1     |
      | mt  | BetSlipMatchType.P |


  Scenario: Validate Cancel Group POST request from user without permission
    And I open Notification Hub
    When I make a POST request for placement with stake "16"
    Then I expect the response status to be OK with code 200
    And I expect the Response Message to be "Ticket is waiting for authorization."
    And I wait for Notification Message containing "has been accepted"
    When I save ticketsIDs for single prematch

    And I make a POST request to Cancel Group API with user without permission
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY             | VALUE                                                         |
      | ResponseMessage | missing permissions canCancelBetSlip or canForceCancelBetSlip |
      | ResponseCode    | 68                                                            |

    When I make a GET request to fetch Betslip History Details for single Prematch
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE              |
      | t   | BetSlip.Single     |
      | st  | Placed             |
      | c   | Combinations.1     |
      | mt  | BetSlipMatchType.P |
