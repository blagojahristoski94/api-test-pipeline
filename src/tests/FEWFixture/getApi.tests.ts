import { expect } from '@playwright/test';
import { ICustomWorld, isBodyKey } from './../../world';
import { Then, When } from "@cucumber/cucumber";
import path from 'path';
import { readDataFromFile } from '../../support/utils/utilityFunctions';

When('I make a GET request to fetch Fixture Menu on {string}',
  async function (
    this: ICustomWorld,
    platform: 'web' | 'mobile'
  ) {
    return await this.pageObj?.getApiFEWFixture.fixtureMenu(this, platform)
  });

When('I make a GET request to fetch Fixture Menu on {string} with load period {string} and culture {string} and timeOffset {string}',
  async function (
    this: ICustomWorld,
    platform: 'web' | 'mobile',
    loadPeriod?: string,
    culture?: string,
    timeOffset?: string
  ) {
    return await this.pageObj?.getApiFEWFixture.fixtureMenu(this, platform, loadPeriod, culture, timeOffset)
  });

When('I make a GET request to fetch Print {string} Logo', async function (this: ICustomWorld, type: 'Ticket' | 'Fixture') {
  return await this.pageObj?.getApiFEWFixture.ticketLogo(this, type)
});

Then('I expect the response Content-Type to be image', function (this: ICustomWorld) {
  const contentType = this.responseBody?.headers()['content-type'];
  expect(contentType).toBe('image/png');
});

When('I make a GET request to fetch Sport on {string} with culture {string}', async function (this: ICustomWorld, platform: 'web' | 'mobile', culture?: string) {
  return await this.pageObj?.getApiFEMobile.fixturesSports(this, platform, culture)
});

When('I make a GET request to fetch Sport on {string} without culture returns the default languange of the system', async function (this: ICustomWorld, platform: 'web' | 'mobile') {
  return await this.pageObj?.getApiFEMobile.fixturesSports(this, platform)
});

When('I make a GET request to fetch Sports Tabs on web', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFixture.sportsTabs(this)
});

When('I make a GET request to fetch Tournament Outrights on web', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFixture.tournamentOurights(this)
});

Then('I expect tournament name to have appropiate value', async function (this: ICustomWorld) {
  if (this.response && isBodyKey(this.response, 'nt')) {
    const response = this.response as unknown as { nt: string };
    const responseAt = response['nt'];
    const filePath = path.join(__dirname, '../../../data/highlights.json');
    const data = readDataFromFile(filePath);
    const tournamentName = data.m[0].tn
    expect(responseAt).toEqual(tournamentName);
    return
  }
  return
});

When('I make a GET request to fetch Tournament Match Odds on web', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFixture.tournamentOdds(this)
});

Then('I expect the Odds for Tournament to have appropiate value', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFixture.getTournamentOdds(this)
});

When('I make a GET request to fetch Grouped Matches on web', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEMobile.groupedMatches(this, 'FEWFixture/GroupedMatches')
});

When('I make a GET request to fetch Upcoming Fixture API without params', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFixture.upcomingFixture(this)
});

When('I make a GET request to fetch Upcoming Fixture API with culture {string}', async function (this: ICustomWorld, culture?: string) {
  return await this.pageObj?.getApiFEWFixture.upcomingFixture(this, culture)
});

When('I make a GET request to fetch SPort Outrights on web for following sport {string}', async function (this: ICustomWorld, sport: "Soccer" | "Ice Hockey") {
  if (sport === 'Soccer') { return await this.pageObj?.getApiFEWFixture.sportOutrights(this, '1'); }
  if (sport === 'Ice Hockey') { return await this.pageObj?.getApiFEWFixture.sportOutrights(this, '4'); }
});

When('I make a GET request to fetch Outright Details API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFixture.outrightsDetails(this)
});

Then('I expect the Odds for Outrights to have appropiate value', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFixture.getOutrightsOdds(this)
});

Then('I expect to have Outrights with the appropriate name', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFixture.sameName(this)
});


When('I make a GET request to fetch Next Races API for {string}', async function (this: ICustomWorld, sportID: 'Horse Racing' | 'Grayhound') {
  if (sportID === 'Horse Racing') { return await this.pageObj?.getApiFEWFixture.nextRaces(this, '31'); }
  if (sportID === 'Grayhound') { return await this.pageObj?.getApiFEWFixture.nextRaces(this, '34'); }
});

When('I make a GET request to fetch HR Categories Menu API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFixture.hrCategoriesMenu(this)
});

When('I make a GET request to fetch Race Outright API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFixture.outrightRace2(this)
});

Then('I expect the Odds for Race Outrights to have appropriate value', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFixture.getRaceOutrightsOdds(this)
});