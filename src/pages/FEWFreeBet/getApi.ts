
import { ICustomWorld } from './../../world';
import { apiContextFor } from '../../support/utils/apiClient';
import { baseUrl, externalUserID, token } from '../../support/utils/utilityFunctions';

export default class getApiFEWFreeBet {
  async userFreeBet(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);

    const fullEndpoint = `${baseUrl()}/FEWFreeBet/UserFreeBets`;


    const response = await apiContext.get(fullEndpoint, {
      headers: {
        Token: `${token()}`,
        ExternalUserID: `${externalUserID()}`,
        Provider: '0',
      }
    });
    const responseBody = await response.json();

    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
    return response;
  }
}