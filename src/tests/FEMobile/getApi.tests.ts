import { ICustomWorld, sports } from './../../world';
import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { apiContextFor } from '../../support/utils/apiClient';
import { approximatelyEqual, externalUserID, readDataFromFile } from '../../support/utils/utilityFunctions';
import path from 'path';

When('I make a GET request to fetch All Settings on {string}', async function (this: ICustomWorld, device: 'web' | 'mobile') {
  const apiUrl = process.env.API_BASE_URL as string;
  let fullEndpoint;
  switch (device) {
    case 'web':
      fullEndpoint = `${apiUrl}rest/FEWHome/AllSettings`;
      break;
    case 'mobile':
      fullEndpoint = `${apiUrl}rest/FEMobile/GetAllSettings`;
      break;
  }

  const apiContext = await apiContextFor(this);
  const responseBody = await apiContext.get(fullEndpoint, {
    headers: {
      accept: 'text/plain',
    },
  });
  this.response = await responseBody.json();
  this.responseBody = await responseBody;
});

Then(
  'I expect the response to have the following currencies, signs and rates',
  async function (this: ICustomWorld, dataTable: DataTable) {
    const data = this.response as { RoundDec: Record<string, { c: string; s: string; e: number }> };
    const dec = data.RoundDec;

    dataTable.hashes().forEach((row) => {
      const currencies = dec[row.currencies];
      const exchangeRate = parseFloat(row.exchangeRate);
      expect(currencies).toBeTruthy();
      expect(currencies.c).toBe(row.currencies);
      expect(currencies.s).toBe(row.currencySign);
      expect(approximatelyEqual(exchangeRate, currencies.e, 0.22)).toBe(true);
    });
  },
);

When('I make a GET request to fetch Mobile Fixtures Sports', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEMobile.fixturesSports(this, 'mobile')
});

When('I make a GET request to fetch Grouped Matches on mobile', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEMobile.groupedMatches(this, 'FEMobile/GetGroupedMatches')
});

When('I make a GET request to fetch User Profile on mobile', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEMobile.userProfile(this)
});

Then('I expect the User ID to have appropiate value', async function (this: ICustomWorld) {
  const data = this.response as { UserID: number };
  expect(typeof data.UserID).toBe('number');
});

Then('I expect the Currency Code to have appropiate value', async function (this: ICustomWorld) {
  const data = this.response as { CurrencyCode: string };
  const filePath = path.join(__dirname, '../../../data/token.json');
  const registerData = readDataFromFile(filePath);
  const currency = registerData['currency']
  expect(data.CurrencyCode).toEqual(currency);
  expect(data.CurrencyCode.length).toBe(3)
});


When('I make a GET request to fetch Sports on mobile with culture {string}', async function (this: ICustomWorld, culture?: string) {
  return await this.pageObj?.getApiFEMobile.sports(this, culture)
});

When('I make a GET request to fetch Sports on mobile without culture parameter', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEMobile.sports(this)
});

When('I make a GET request to fetch Paged Matches API for {string} on mobile', async function (this: ICustomWorld, widgetType: 'today' | 'upcoming' | 'highlights') {
  return await this.pageObj?.getApiFEMobile.pagedMatches(this, widgetType)
});

Given('I make GET request to fetch upcoming Widget for following {string}', async function (this: ICustomWorld, sport: keyof typeof sports) {
  const sportsIds = parseFloat(sports[sport]);
  return await this.pageObj?.getApiFEMobile.upcomingWidget(this, sportsIds)
});


When('I make a GET request to fetch Get Match Tabs on mobile', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWMatches.getMatches(this, 'FEMobile/GetMatchTabs')
});

When('I make a GET request to fetch Live Upcoming Fixture with culture {string}', async function (this: ICustomWorld, culture: string) {
  return await this.pageObj?.getApiFEMobile.newLiveUpcomingWidget(this, culture)
});

Then('I expect the response body object to appropiate value', async function (this: ICustomWorld) {
  const data = this.response as Record<string, string | number>;
  expect(typeof data).toBe('object');

  expect(data).not.toBeNull();


  for (const [key, value] of Object.entries(data)) {
    expect(Number.isNaN(Number(key))).toBe(false);
    expect(Number.isNaN(Number(value))).toBe(false);
  }
});

When('I make a GET request to fetch Language Resources on {string} with culture {string}', async function (this: ICustomWorld, platform: 'web' | 'mobile', culture?: string) {
  return await this.pageObj?.getApiFEMobile.language(this, platform, culture)
});

When('I make a GET request to fetch Language Resources on {string} without params', async function (this: ICustomWorld, platform: 'web' | 'mobile') {
  return await this.pageObj?.getApiFEMobile.language(this, platform)
});

When('I make a GET request to fetch Search Events By Name on {string} with search term {string}', async function (this: ICustomWorld, device: 'web' | 'mobile', searchTerm: string) {
  return await this.pageObj?.getApiFEMobile.searchByName(this, device, searchTerm)
});

When('I make a GET request to fetch User Bonuses API on mobile', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEMobile.userBonuses(this, externalUserID())
});

When('I make a GET request to fetch User Bonuses API on mobile without user parameter', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEMobile.userBonuses(this)
});

When('I make a GET request to fetch User Bonuses API on mobile with user {string}', async function (this: ICustomWorld, user: string) {
  return await this.pageObj?.getApiFEMobile.userBonuses(this, user)
});

When('I make a GET request to fetch all Grouped Matches BB API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEMobile.allSwishEvents(this)
});

When('I make a GET request to fetch the Swish match details API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEMobile.swishMatchDetails(this)
});

When('I expect the Odds for All Swish Markets to have appropiate value', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEMobile.getMatchesOdds(this)
});

When('I make a GET request to fetch Fixtures Menu BB API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEMobile.fixturesMenuBB(this)
});
