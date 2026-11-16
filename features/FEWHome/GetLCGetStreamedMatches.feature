Feature: LCStreamedMatches GET request

  Scenario Outline: Validate LC Streamed Matches GET request
    When I make a GET request to fetch LC Get Streamed Matches
    Then I expect the response status to be OK with code 200
    And I expect response body object to return array with key "streamedMatches" and to have following values
      | KEY | VALUE |
      | lve | true  |
      | su  | false |
      | act | true  |

