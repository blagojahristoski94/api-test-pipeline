Feature: Check Item For Incompatibility API POST request

  Scenario Outline: Validate Check Item For Incompatibility API request
    When I make a POST request for Check Item For Incompatibility API
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY                 | VALUE                                                  |
      | IncompatibleMatches | []                                                     |
      | ResponseMessage     | The competitor cannot be played twice in a single bet! |
      | ResponseCode        | 56                                                     |