import { ICustomWorld } from '../../world';
import { apiContextFor } from '../../support/utils/apiClient';
import { baseUrl, readDataFromFile } from '../../support/utils/utilityFunctions';
import path from 'path';

export default class postApiFEABetslip {

  async cancelGroup(iCustomWorld: ICustomWorld, user: string, token: string) {
    const apiUrl = `${baseUrl()}/FEABetSlip/CancelGroup`;
    const apiContext = await apiContextFor(iCustomWorld);
    const filePath = path.join(__dirname, '../../../data/BetslipIDs.json');
    const data = readDataFromFile(filePath);
    const ticket = data['singlePrematchId']

    const requestData =
    {
      "culture": "en",
      "BetSlipGroupID": ticket,
    }
    const responseBody = await apiContext.post(apiUrl, {
      headers: {
        'token': token,
        'externalUserId': user,
        'Provider': `0`
      },
      data: requestData,
    });

    const response = await responseBody.json();
    iCustomWorld.responseBody = await responseBody;
    iCustomWorld.response = await response;
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  async searchUser(iCustomWorld: ICustomWorld, username: string) {
    const apiContext = await apiContextFor(iCustomWorld);
    const fullEndpoint = `${baseUrl()}/FEABetSlip/SearchUser?searchUserName=${username}`;

    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
        token: process.env.AGENT_TOKEN as string,
        externalUserID: process.env.AGENT_EXTERNAL_USER_ID as string,
      },
    });
    const response = await responseBody.json();
    iCustomWorld.responseBody = await responseBody;
    iCustomWorld.response = await response;
  }
}