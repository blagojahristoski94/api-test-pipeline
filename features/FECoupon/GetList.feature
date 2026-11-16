Feature: Coupon List GET request on mobile

  Scenario Outline: Validate Coupon List GET request with valid sportID
    When I make a GET request to fetch Coupon List with sportID "<SportID>"
    Then I expect the response status to be OK with code 200
    And I expect to have coupons with the appropriate name

    Examples:
      | SportID |
      | 1       |

  Scenario: Validate Coupon List GET request without sportID returns 400
    When I make a GET request to fetch Coupon List without sportID
    Then I expect the response status to be NOT OK with code 400
    And I expect the response error message to be "SportID is required"

  Scenario Outline: Validate Coupon List GET request with non-existent sportID returns empty response
    When I make a GET request to fetch Coupon List with sportID "<SportID>"
    Then I expect the response status to be OK with code 200
    And I expect the response body to be an empty array

    Examples:
      | SportID |
      | 999999  |

  Scenario Outline: Validate Coupon List GET request with zero or negative sportID returns 400
    When I make a GET request to fetch Coupon List with sportID "<SportID>"
    Then I expect the response status to be NOT OK with code 400
    And I expect the response error message to be "SportID is required"

    Examples:
      | SportID |
      | 0       |
      | -1      |

  Scenario Outline: Validate Coupon List GET request with non-integer sportID returns 400
    When I make a GET request to fetch Coupon List with sportID "<SportID>"
    Then I expect the response status to be NOT OK with code 400
    And I expect the response error message to be "The value '<SportID>' is not valid."

    Examples:
      | SportID |
      | abc     |
      | @       |