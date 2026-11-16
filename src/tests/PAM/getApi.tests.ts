import { When } from "@cucumber/cucumber";
import { ICustomWorld } from "../../world";

When('I make a GET request to Login', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiPAM.login(this as ICustomWorld);
});
