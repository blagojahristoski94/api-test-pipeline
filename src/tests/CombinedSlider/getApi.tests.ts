
import { Then, When } from "@cucumber/cucumber";
import { ICustomWorld } from "../../world";

When('I make a GET request to API Get Combined Slider Elements', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiCombinedSlider.CombinedSliderElements(this as ICustomWorld);
});

Then('I expect the response body to have array of elements', async function (this: ICustomWorld) {
  await this.pageObj?.getApiCombinedSlider.responseIsObjectWithArray(this);
});