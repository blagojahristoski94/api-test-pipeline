Feature: GetMatchTabsFirst GET request

  Scenario: Validate GetMatchTabsFirst GET request
    When I make a GET request to fetch Get Match Tabs First
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE  |
      | s   | Soccer |
      | sid | 1      |
      | tus | false  |
      | su  | false  |
    And I expect response body object to return array with key "matchTabs" and to have following values
      | KEY | VALUE     |
      | n   | Popular   |
      | n   | 1st Half  |
      | n   | 2nd  Half |
      | n   | Goals     |




