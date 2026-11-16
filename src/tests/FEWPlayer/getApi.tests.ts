import { ICustomWorld } from './../../world';
import { Then, When } from "@cucumber/cucumber";

When('I make a GET request to fetch Player Info', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWPlayer.playerInfo(this)
});

When('I make a GET request to fetch stream {string}', async function (this: ICustomWorld, endpoint: string) {
  return await this.pageObj?.getApiFEWPlayer.getLCStream(this as ICustomWorld, endpoint);
});

Then('I expect the Stream URL ID to have appropiate value', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWPlayer.streamUrl(this as ICustomWorld);
});

