import { apiContextFor } from "../../support/utils/apiClient";
import { baseUrl } from "../../support/utils/utilityFunctions";
import { ICustomWorld } from "../../world";

export default class getApiFEWTopEvents {
  async topEvents(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);

    const fullEndpoint = `${baseUrl()}/FEWTopEvents/GetTopEvents?platform=2&culture=en`;

    const response = await apiContext.get(fullEndpoint);
    const responseBody = await response.json();

    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }
}