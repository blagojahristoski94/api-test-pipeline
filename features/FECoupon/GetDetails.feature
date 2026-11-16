Feature: Coupon Details GET request on mobile

  Scenario: Validate Coupon Details GET request
    When I make a GET request to fetch Coupon Details with id "121"
    Then I expect the response status to be OK with code 200
    And I expect to have coupons with the appropriate name
    And I expect to have a coupon name "Test" with id "121"
    And I expect the response body object to have the following values:
      | KEY | VALUE  |
      | n   | Test   |
      | t   | No Tag |
      | n   | 3 Way  |

  Scenario Outline: Validate Coupon Details returns 400 for non-numeric couponID
    When I make a GET request to fetch Coupon Details with id "<invalidId>"
    Then I expect the response status to be NOT OK with code 400
    And I expect the response error message to be "The value '<invalidId>' is not valid for couponID."

    Examples:
      | invalidId |
      | abc       |
      | !@        |
      | test123   |

  Scenario: Validate Coupon Details returns empty response for non-existent couponID
    When I make a GET request to fetch Coupon Details with id "999999999"
    Then I expect the response status to be OK with code 200
    And I expect the coupon details response to be empty

  # NOTE: Swagger marks couponID as required, but the API accepts requests without it
  # and returns an empty response instead of a 400 error.
  Scenario: Validate Coupon Details returns empty response when couponID is omitted
    When I make a GET request to fetch Coupon Details without id
    Then I expect the response status to be OK with code 200
    And I expect the coupon details response to be empty

