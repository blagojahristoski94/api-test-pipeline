import { When } from "@cucumber/cucumber";
import { ICustomWorld } from "../../world";

When('I make a GET request to fetch Highlights version 2 for following sport {string}', async function (this: ICustomWorld, sport: "Soccer" | "American Football") {
  if (sport === 'Soccer') { return await this.pageObj?.getApiFEHome.getApiHighlights(this, 1); }
  if (sport === 'American Football') { return await this.pageObj?.getApiFEHome.getApiHighlights(this, 14); }
  if (sport === 'Tennis') { return await this.pageObj?.getApiFEHome.getApiHighlights(this, 5); }
  if (sport === 'Basketball') { return await this.pageObj?.getApiFEHome.getApiHighlights(this, 2); }
});