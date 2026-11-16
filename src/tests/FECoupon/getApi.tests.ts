import { Then, When } from "@cucumber/cucumber";
import { ICustomWorld } from "../../world";
import { expect } from "@playwright/test";

When('I make a GET request to fetch Coupon List with sportID {string}', async function (this: ICustomWorld, sportID: string) {
  return await this.pageObj?.getApiFECoupon.list(this as ICustomWorld, sportID);
});

When('I make a GET request to fetch Coupon List without sportID', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFECoupon.list(this as ICustomWorld);
});

Then('I expect to have coupons with the appropriate name', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWFixture.sameName(this)
});

When('I make a GET request to fetch Coupon Details with id {string}', async function (this: ICustomWorld, couponeID: string) {
  return await this.pageObj?.getApiFECoupon.details(this as ICustomWorld, couponeID);
});

When('I make a GET request to fetch Coupon Details without id', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFECoupon.details(this as ICustomWorld);
});

Then('I expect the coupon details response to be empty', async function (this: ICustomWorld) {
  const response = this.response as unknown as { id: number; n: null; t: null; co: unknown[]; ct: unknown[] };
  expect(response.id).toBe(0);
  expect(response.n).toBeNull();
  expect(response.t).toBeNull();
  expect(response.co).toEqual([]);
  expect(response.ct).toEqual([]);
});

Then('I expect to have a coupon name {string} with id {string}', async function (this: ICustomWorld, couponeName: string, couponeId: string) {
  const data = this.response as { n: string; id: number };

  const name = data.n
  const id = data.id
  expect(name).toContain(couponeName);
  expect(Number(couponeId)).toEqual(id);
});

