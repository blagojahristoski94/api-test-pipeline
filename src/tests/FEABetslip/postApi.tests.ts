import { When } from "@cucumber/cucumber";
import { ICustomWorld } from "../../world";
import { externalUserID, token } from "../../support/utils/utilityFunctions";

When('I make a POST request to Cancel Group API', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiFEABetslip.cancelGroup(this, `${process.env.AGENT_EXTERNAL_USER_ID as string}`, `${process.env.AGENT_TOKEN as string}`)
});

When('I make a POST request to Cancel Group API with user without permission', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiFEABetslip.cancelGroup(this, `${externalUserID()}`, `${token()}`)
});

When('I make a GET request to API Search User {string}', async function (this: ICustomWorld, username: string) {
  return await this.pageObj?.postApiFEABetslip.searchUser(this, username)
});
