import { Then, When } from "@cucumber/cucumber"
import { ICustomWorld } from "../../world"

When('I make a GET request to fetch Category Print API', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiFEWFixture.categoryPrint(this)
});

Then('I expect all odds to have appropiate format', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiFEWFixture.getOdds(this)
});