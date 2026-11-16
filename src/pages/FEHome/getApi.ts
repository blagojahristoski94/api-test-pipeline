import { ICustomWorld } from "../../world";
import { apiContextFor } from "../../support/utils/apiClient";
import { writeDataToFile } from "../../support/utils/utilityFunctions";
export default class getApiFEHome {
  async getApiHighlights(iCustomWorld: ICustomWorld, sport: 1 | 14 | 2 | 5) {
    const apiContext = await apiContextFor(iCustomWorld);
    const fullEndpoint = `rest/FEHome/Highlights?Culture=en&StartRecord=0&EndRecord=20&TimeOffset=-60&NumberOfOddTypes=3&IncludeAllSports=false&sportID=${sport}`;

    const response = await apiContext.get(fullEndpoint);
    const responseBody = await response.json();
    const filePath = './data/highlights.json';

    writeDataToFile(filePath, responseBody);
    iCustomWorld.responseBody = response;
    iCustomWorld.response = responseBody;
  }
}