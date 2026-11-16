Feature: LCGetMobileStream GET request

  Scenario: Validate response for LC Get Mobile Stream
    When I make a GET request to fetch stream 'LCGetMobileStream'
    Then I expect the response status to be OK with code 200
    And I expect the Stream URL ID to have appropiate value
    Then I expect the response body object to have the following values:
      | KEY    | VALUE |
      | tstamp | null  |
      | ems    | null  |