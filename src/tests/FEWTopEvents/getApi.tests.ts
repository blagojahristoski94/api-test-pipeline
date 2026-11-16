import { ICustomWorld } from './../../world';
import { When } from "@cucumber/cucumber";

When('I make a GET request to fetch Top Events', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWTopEvents.topEvents(this)
});