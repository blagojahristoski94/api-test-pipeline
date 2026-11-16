import { ICustomWorld } from './../../world';
import { expect } from "@playwright/test";
import { baseUrl, readDataFromFile } from '../../support/utils/utilityFunctions';
import { apiContextFor, requestAndStore } from '../../support/utils/apiClient';
import path from 'path';

export default class getApiFEWFixture {

  async fixtureMenu(
    iCustomWorld: ICustomWorld,
    platform: string,
    loadPeriod?: string,
    culture?: string,
    timeOffset?: string
  ) {

    let fullEndpoint = '';
    switch (platform) {
      case 'web':
        fullEndpoint = `${baseUrl()}/FEWFixture/FixturesMenu`;
        break;
      case 'mobile':
        fullEndpoint = `${baseUrl()}/FEMobile/GetFixturesMenu`;
        break;
    }

    const params = {
      ...(loadPeriod && { loadPeriod }),
      ...(culture && { culture }),
      ...(timeOffset && { timeOffset }),
    };

    await requestAndStore(
      iCustomWorld,
      fullEndpoint,
      { params }
    );
  }

  async ticketLogo(iCustomWorld: ICustomWorld, type: 'Ticket' | 'Fixture') {
    const apiContext = await apiContextFor(iCustomWorld);
    let fullEndpoint;
    switch (type) {
      case 'Ticket':
        fullEndpoint = `${baseUrl()}/FEWFixture/PrintTicketLogo`;
        break;
      case 'Fixture':
        fullEndpoint = `${baseUrl()}/FEWFixture/PrintFixtureLogo`;
        break;
    }

    const response = await apiContext.get(fullEndpoint);
    iCustomWorld.responseBody = await response;
    return response
  }

  async sportsTabs(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);
    const fullEndpoint = `${baseUrl()}/FEWFixture/SportTabs?culture=en&sportID=1 `
    const response = await apiContext.get(fullEndpoint);

    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
    return response
  }


  async tournamentOurights(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);

    const filePath = path.join(__dirname, '../../../data/highlights.json');
    const data = readDataFromFile(filePath);
    const tournament = data.m[0].tids
    const fullEndpoint = `${baseUrl()}/FEWFixture/TournamentOutrights?TimeFilter=0&Culture=en&tournamentData[]=${tournament}`;

    const response = await apiContext.get(fullEndpoint);
    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }

  async tournamentOdds(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);
    const filePath = path.join(__dirname, '../../../data/highlights.json');
    const registerData = readDataFromFile(filePath);

    const event = registerData.m[0]
    const tournamet = event.tid
    const fullEndpoint = `${baseUrl()}/FEWFixture/TournamentMatchOdds?culture=en&oddTypeIDs[]=3&TournamentData[]=${tournamet}&TimeFilter=0`
    const response = await apiContext.get(fullEndpoint);

    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
    return response
  }

  async getTournamentOdds(iCustomWorld: ICustomWorld) {
    const data = iCustomWorld.response as Record<string, Record<string, { m?: { o?: unknown }[] }[]>>;
    const filePath = path.join(__dirname, '../../../data/highlights.json');
    const registerData = readDataFromFile(filePath);
    const event = registerData.m[0];
    const tournament = event.tid;

    for (const key of Object.keys(data[tournament])) {
      const marketArray = data[tournament][key];
      for (const market of marketArray) {
        if (!market.m) continue;

        for (const oddItem of market.m) {
          if ('o' in oddItem) {
            const odds = oddItem.o;
            const isExpectedValue = typeof odds === 'string' && /^\d{1,3}\.\d{1,2}$/.test(odds);
            expect(isExpectedValue).toBe(true);
          }
        }
      }
    }
  }

  async upcomingFixture(iCustomWorld: ICustomWorld, culture?: string) {

    const fullEndpoint = `${baseUrl()}/FEWFixture/UpcomingFixture`;

    await requestAndStore(
      iCustomWorld,
      fullEndpoint,
      culture ? { params: { culture } } : undefined
    );
  }

  async sportOutrights(iCustomWorld: ICustomWorld, sport: string) {
    const apiContext = await apiContextFor(iCustomWorld);
    const fullEndpoint = `${baseUrl()}/FEWFixture/SportOutrights?sportID=${sport}&culture=en`;

    const responseBody = await apiContext.get(fullEndpoint);
    const response = await responseBody.json();
    const identifier = response[0].outid
    iCustomWorld.betIdentifier = await identifier;
    iCustomWorld.responseBody = await responseBody;
    iCustomWorld.response = await response;
  }

  async outrightsDetails(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);
    const outrightsID = iCustomWorld.betIdentifier
    const fullEndpoint = `${baseUrl()}/FEWFixture/OutrightDetails?outrightID=${outrightsID}&culture=en`;

    const responseBody = await apiContext.get(fullEndpoint);
    const response = await responseBody.json();
    iCustomWorld.responseBody = await responseBody;
    iCustomWorld.response = await response;
  }

  async getOutrightsOdds(iCustomWorld: ICustomWorld) {
    const data = iCustomWorld.response as { o: string }[];

    for (let i = 0; i < data.length; i++) {
      const odds = data[i].o
      const isExpectedValue = typeof odds === 'string' && /^\d{1,4}\.\d{1,2}$/.test(odds);
      expect(isExpectedValue).toBe(true);
    }
  }

  async sameName(iCustomWorld: ICustomWorld) {
    const data = iCustomWorld.response as { n: string }[];

    for (let indexO = 0; indexO < data.length; indexO++) {
      const name = data[indexO].n
      const isExpectedValue = typeof name === 'string'
      const notEmpty = name !== '';
      expect(isExpectedValue).toBe(true);
      expect(notEmpty).toBe(true);
    }
  }

  async nextRaces(iCustomWorld: ICustomWorld, sportID: '31' | '34') {
    const apiContext = await apiContextFor(iCustomWorld);

    const fullEndpoint = `${baseUrl()}/FEWFixture/GetNextRaces2?culture=en&timeFilter=0&timeOffset=-120&sportData%5B%5D=${sportID}`;

    const responseBody = await apiContext.get(fullEndpoint);
    const response = await responseBody.json();
    iCustomWorld.responseBody = await responseBody;
    iCustomWorld.response = await response;
    iCustomWorld.betIdentifier = await response[0].hrco[0].odds[0].outid
  }
  async hrCategoriesMenu(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);

    const fullEndpoint = `${baseUrl()}/FEWFixture/GetHRCategoriesMenu2?culture=en&timeFilter=0&timeOffset=-120&sportData%5B%5D=31`;

    const responseBody = await apiContext.get(fullEndpoint);
    const response = await responseBody.json();

    iCustomWorld.responseBody = await responseBody;
    iCustomWorld.response = await response;
  }

  async outrightRace2(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);
    const ID = iCustomWorld.betIdentifier
    const fullEndpoint = `${baseUrl()}/FEWFixture/GetOutrightRace2?outrightID=${ID}&culture=en`;

    const responseBody = await apiContext.get(fullEndpoint);
    const response = await responseBody.json();

    iCustomWorld.responseBody = await responseBody;
    iCustomWorld.response = await response;
  }

  async getRaceOutrightsOdds(iCustomWorld: ICustomWorld) {
    const data = iCustomWorld.response as { hrco: { odds: { o: string }[] }[] }[];

    for (let i = 0; i < data.length; i++) {
      const odds = data[i].hrco[i].odds[0].o
      const isExpectedValue = typeof odds === 'string' && /^\d{1,4}\.\d{1,2}$/.test(odds);
      expect(isExpectedValue).toBe(true);
    }
  }
}