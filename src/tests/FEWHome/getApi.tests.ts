import { Then, When } from '@cucumber/cucumber';
import { ICustomWorld, isBodyKey, ticketsIds } from '../../world';
import { expect } from '@playwright/test';
import path from 'path';
import { readDataFromFile } from '../../support/utils/utilityFunctions';

When('I make a GET request to fetch LC Get Streamed Matches', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWHome.getApiStreamedMatches(this as ICustomWorld);
});

When('I make a GET request to fetch Highlights for following sport {string}', async function (this: ICustomWorld, sport: "Soccer" | "American Football" | "Tennis" | "Basketball") {
  if (sport === 'Soccer') { return await this.pageObj?.getApiFEWHome.getApiHighlights(this, 1); }
  if (sport === 'American Football') { return await this.pageObj?.getApiFEWHome.getApiHighlights(this, 14); }
  if (sport === 'Tennis') { return await this.pageObj?.getApiFEWHome.getApiHighlights(this, 5); }
  if (sport === 'Basketball') { return await this.pageObj?.getApiFEWHome.getApiHighlights(this, 2); }
});


When('I make a GET request to fetch Upcoming API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWHome.getUpcoming(this as ICustomWorld);
});

When('I make a GET request to fetch Main Widget Markets with culture {string}', async function (this: ICustomWorld, culture?: string) {
  return await this.pageObj?.getApiFEWHome.getApiMainWidgetMarkets(this, culture);
});

When('I make a GET request to fetch Main Widget Markets without culture parameter', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWHome.getApiMainWidgetMarkets(this);
});

When('I make a GET request to fetch Check Betslip API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWHome.checkBetslip(this as ICustomWorld);
});

Then(
  'I make a GET request to fetch Bet identifier for {string}',
  async function (
    this: ICustomWorld,
    key: keyof typeof ticketsIds,
  ) {
    const responseKey = ticketsIds[key];
    if (responseKey) {
      return await this.pageObj?.getApiFEWBetslip.betIdentifier(this, responseKey);
    }
  }
);

Then('I expect the ticket ID to be the same as the previously placed {string}', async function (this: ICustomWorld, key: keyof typeof ticketsIds,) {
  if (this.response && isBodyKey(this.response, 'g')) {
    const response = this.response as { g: { id: string } };
    const filePath = path.join(__dirname, '../../../data/betslipIDs.json');
    const registerData = readDataFromFile(filePath);
    const responseKey = ticketsIds[key];
    if (responseKey) {
      expect(response?.g?.id).toBe(registerData[responseKey]);
    }
    return
  }
  return
});

When('I make a POST request to fetch Web Favourite Matches', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiFEMobile.favorite(this, 'web')
});

When('I make a GET request to fetch Match Odds For Market', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWHome.matchOdds(this)
});

Then('I expect the Odds for Markets on web to have appropiate value', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWHome.getMatchesOdds(this)
});

When('I make a GET request to fetch Match By Event ID API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWHome.MatchByEventID(this)
});

When('I make a GET request to fetch Top Winnings API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWHome.topWinnings(this)
});

Then('I expect the usernames to be encrypted in the middle', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWHome.encryptedUsername(this)
});

Then('I expect bet payout to have appropiate value', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWHome.betPayout(this)
});


When('I make a GET request to fetch Winnings Details API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWHome.winningsDetails(this)
});

When('I make a GET request to fetch Active Special Bet Type Combinations', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWHome.GetActiveSpecialBetTypeCombinations(this)
});
Then('I expect the response body to have the following message: Language not found for {string}', async function (this: ICustomWorld, language: string) {
  return await this.pageObj?.getApiFEWHome.nonExistingLanguage(this, language)
});