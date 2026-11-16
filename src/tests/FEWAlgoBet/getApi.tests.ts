import { Then, When } from "@cucumber/cucumber";
import { ICustomWorld } from "../../world";

When('I make a GET request to collect Algo Sports Markets for sport {string}', async function (this: ICustomWorld, sportID: string) {
  return await this.pageObj?.getApiBetBuilder.AlgoMarkets(this, sportID);
});

Then('I expect the response body to contain a list of prematch markets', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiBetBuilder.listOfAlgoMarkets(this, 'prematch')
});

Then('I expect the response body to contain a list of live markets', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiBetBuilder.listOfAlgoMarkets(this, 'live')
});