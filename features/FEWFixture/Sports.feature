Feature: Sports GET request

  Scenario: Validate Fixture Sports GET request
    When I make a GET request to fetch Sport on 'web' with culture '<culture>'
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

  Scenario: Validate Fixture Sports GET request with unsupported culture
    When I make a GET request to fetch Sport on 'web' with culture "<culture>"
    Then I expect the response status to be NOT OK with code 400
    And I expect the response error message to be "Language not found for <culture>"
    Examples:
      | culture |
      | ''      |
      | 123     |
      | mk      |


  Scenario: Validate Fixture Sports GET API without culture parameter (returns the default language of the system)
    When I make a GET request to fetch Sport on 'web' without culture returns the default languange of the system
    Then I expect the response status to be OK with code 200
    And I expect the response body object to have the following values:
      | KEY | SPORT       |
      | n   | Soccer      |
      | n   | Basketball  |
      | n   | Ice Hockey  |
      | n   | Tennis      |
      | n   | Baseball    |
      | n   | Cricket     |
      | n   | Volleyball  |
      | n   | Handball    |
      | n   | Snooker     |
      | n   | eSoccer     |
      | n   | eBasketball |