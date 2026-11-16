import { ICustomWorld } from './../../world';
import { Then, When } from "@cucumber/cucumber";

When('I make a GET request to fetch Get Match Tabs First', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWMatches.getMatches(this, 'FEWMatches/MatchTabsFirst')
});

When('I make a GET request to fetch Get Match Odds on {string}', async function (this: ICustomWorld, device: 'web' | 'mobile') {
  if (device === 'web') { return await this.pageObj?.getApiFEWMatches.getMatches(this, 'FEWMatches/MatchOdds') }
  if (device === 'mobile') { return await this.pageObj?.getApiFEWMatches.getMatches(this, 'FEMobile/GetMatchOdds') }
});

When('I make a GET request to fetch Get Match Player Odds', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWMatches.getPlayerOdds(this)
});

Then('I expect the Odds for All Markets to have appropiate value', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWMatches.getMatchesOdds(this)
});

When('I make a GET request to fetch Seen Notification API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWMatches.seenNotification(this)
});
