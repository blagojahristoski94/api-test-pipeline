import { Then, When } from "@cucumber/cucumber";
import { ICustomWorld, isBodyKey } from "../../world";
import { expect } from "@playwright/test";

When('I make a POST request to fetch Mobile Favourite Matches', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiFEMobile.favorite(this, 'mobile')
});


Then('I expect the match ID to be the same', async function (this: ICustomWorld) {
  if (this.response && isBodyKey(this.response, 'mid')) {
    const response = parseFloat(this.response?.mid as string)
    expect(response).toEqual(this.matchID);
    return
  }
  return
});

Then('I expect the Away team to be the same', async function (this: ICustomWorld) {
  if (this.response && Object.prototype.hasOwnProperty.call(this.response, 'at')) {
    const response = this.response as unknown as { at: string };
    const responseAt = response['at'];
    const matchAt = this.awayTeam;
    expect(responseAt).toEqual(matchAt);
    return;
  }

  return
});

Then('I expect the Home team to be the same', async function (this: ICustomWorld) {
  if (this.response && isBodyKey(this.response, 'ht')) {
    const response = this.response as unknown as { ht: string };
    const responseAt = response['ht'];
    const matchHt = this.homeTeam;
    expect(responseAt).toEqual(matchHt);
    return
  }
  return
});

When('I make a POST request for Set User Wagered Bonus on mobile', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiFEMobile.userWageredBonus(this)
});


Then('I expect the response to be with value true', async function (this: ICustomWorld) {
  const response = this.response
  return expect(response).toBe(true)
});
