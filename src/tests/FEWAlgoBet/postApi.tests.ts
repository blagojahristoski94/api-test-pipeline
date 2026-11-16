import { Then, When } from "@cucumber/cucumber";
import { ICustomWorld } from "../../world";

When('I make a POST request to API Get Algo Price for markets Winner and {string}', async function (this: ICustomWorld, marketID: "Over Under" | "Odd Even" | "Asian Total") {
  if (marketID === "Over Under") return await this.pageObj?.postApiFEWAlgoBet.algoPrice(this, 29, 0)
  if (marketID === "Odd Even") return await this.pageObj?.postApiFEWAlgoBet.algoPrice(this, 16, 0)
  if (marketID === "Asian Total") return await this.pageObj?.postApiFEWAlgoBet.algoPrice(this, 24, 0)
  if (marketID === "First set Total") return await this.pageObj?.postApiFEWAlgoBet.algoPrice(this, 33, 0)
  if (marketID === "Home & Away") return await this.pageObj?.postApiFEWAlgoBet.algoPrice(this, 3, 1)
  if (marketID === "Home Away") return await this.pageObj?.postApiFEWAlgoBet.algoPrice(this, 4, 1)
  if (marketID === "First Player and Second Player") return await this.pageObj?.postApiFEWAlgoBet.algoPrice(this, 4, 1)
});

Then('I expect response body to have TotalOdds and probability values greater than 0', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiFEWAlgoBet.validateAlgoPrice(this)
});

When('I make a POST request for Algo Placement with stake {string}', async function (this: ICustomWorld, stake: string) {
  return await this.pageObj?.postApiFEWAlgoBet.algoPlacement(this, stake)
});

Then('I expect the response to be {string}', async function (this: ICustomWorld, message: string) {
  return await this.pageObj?.postApiFEWAlgoBet.incopatibleAlgoItem(this, message)
});


