import { apiContextFor } from "../../support/utils/apiClient";
import { baseUrl, externalUserID, readDataFromFile, token } from "../../support/utils/utilityFunctions";
import path from "path";
import { ICustomWorld } from "../../world";

export default class postApiFEMobile {
  async favorite(iCustomWorld: ICustomWorld, device: 'web' | 'mobile') {
    let fullEndpoint;
    switch (device) {
      case 'web':
        fullEndpoint = `${baseUrl()}/FEWHome/GetFavouriteMatches`;
        break;
      case 'mobile':
        fullEndpoint = `${baseUrl()}/FEMobile/GetFavouriteMatches`;
        break;
    }
    const apiContext = await apiContextFor(iCustomWorld);
    const headers = {
      'Token': token() as string,
      'externaluserid': externalUserID() as string,
    };

    const filePath = path.join(__dirname, '../../../data/highlights.json');
    const matches = readDataFromFile(filePath)
    const requestData = {
      "MatchIds": [matches.m[0].mid],
      "Culture": "en"
    }

    const response = await apiContext.post(fullEndpoint, {
      headers: headers,
      data: requestData,
    });

    const responseBody = await response.json()
    iCustomWorld.responseBody = response;
    iCustomWorld.response = responseBody;
    iCustomWorld.homeTeam = matches.m[0].ht
    iCustomWorld.awayTeam = matches.m[0].at
    iCustomWorld.matchID = matches.m[0].mid
  };


  async userWageredBonus(iCustomWorld: ICustomWorld) {
    const fullEndpoint = `${baseUrl()}/FEMobile/SetUserWageredBonus`;
    const apiContext = await apiContextFor(iCustomWorld);
    const headers = {
      'ExternalUserID': externalUserID() as string,
    };

    const requestData = {
      "externalUserID": externalUserID(),
      "bonusInstanceId": process.env.BONUS_INSTANCE_ID as string
    }

    const response = await apiContext.post(fullEndpoint, {
      headers: headers,
      data: requestData,
    });

    const responseBody = await response.json()
    iCustomWorld.responseBody = response;
    iCustomWorld.response = responseBody;
  };
}