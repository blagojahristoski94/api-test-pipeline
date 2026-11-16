import { When } from "@cucumber/cucumber";
import { ICustomWorld } from "../../world";

When('I make a GET request to fetch User Free Bet API', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFreeBet.userFreeBet(this)
});