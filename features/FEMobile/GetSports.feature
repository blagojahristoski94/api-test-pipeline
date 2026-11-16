Feature: Get Sports request on mobile

  Scenario Outline: Fetch data from Sports for Mobile API with valid culture
    When I make a GET request to fetch Sports on mobile with culture "<culture>"
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | VALUE              |
      | n   | <Soccer>           |
      | n   | <Basketball>       |
      | n   | <IceHockey>        |
      | n   | <Tennis>           |
      | n   | <Baseball>         |
      | n   | <AmericanFootball> |
      | n   | <Volleyball>       |
      | n   | <TableTennis>      |

    Examples:
      | culture | Soccer   | Basketball | IceHockey          | Tennis | Baseball | AmericanFootball   | Volleyball | TableTennis     |
      | en      | Soccer   | Basketball | Ice Hockey         | Tennis | Baseball | American Football  | Volleyball | Table Tennis    |
      | fr      | Football | Basketball | Hockey sur glace   | Tennis | Baseball | Football américain | Volleyball | Tennis de table |
      | es      | Fútbol   | Básquetbol | Hockey sobre hielo | Tenis  | Béisbol  | Fútbol americano   | Vóleibol   | Tenis de mesa   |

  Scenario: Fetch data from Sports for Mobile API with unsupported culture
    When I make a GET request to fetch Sports on mobile with culture "<culture>"
    Then I expect the response status to be NOT OK with code 400
    And I expect the response error message to be "Language not found for <culture>"
    Examples:
      | culture |
      | ''      |
      | 123     |
      | mk      |

  Scenario: Fetch data from Sports for Mobile API without culture parameter
    When I make a GET request to fetch Sports on mobile without culture parameter
    Then I expect the response status to be NOT OK with code 400
    And I expect the response body object to have the following values:
      | property | expectedValue                           |
      | Culture  | The Culture field is required.          |
      | title    | One or more validation errors occurred. |