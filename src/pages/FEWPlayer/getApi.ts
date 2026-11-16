import { ICustomWorld } from './../../world';
import * as dotenv from 'dotenv';
import { apiKey, baseUrl, readDataFromFile, token, externalUserID, getRandomIndex } from '../../support/utils/utilityFunctions';
import * as path from 'path';
import { expect } from '@playwright/test';
import { apiContextFor } from '../../support/utils/apiClient';


dotenv.config();

export default class getApiFEWPlayer {
  async playerInfo(iCustomWorld: ICustomWorld) {
    // Full URL
    const fullEndpoint = `${baseUrl()}/FEWPlayer/PlayerInfo`;
    const apiContext = await apiContextFor(iCustomWorld);
    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
        Token: `${token()}`,
        ExternalUserID: `${externalUserID()}`,
      },
    });

    const response = await responseBody.json()
    iCustomWorld.responseBody = await responseBody;
    iCustomWorld.response = await response;
  }

  async getLCStream(iCustomWorld: ICustomWorld, url: string) {
    const endpoint = `${baseUrl()}/FEWPlayer/${url}`
    const filePath = path.join(__dirname, '../../../data/streamedMatches.json');
    const registerData = readDataFromFile(filePath);
    const randomEvent = getRandomIndex(registerData.slt.length)
    const streamID = registerData.slt[randomEvent].stid
    const broker = registerData.slt[randomEvent].ibid

    // Full URL
    const fullEndpoint = `${endpoint}?StreamId=${streamID}&ExternalUserId=${externalUserID()}&StreamingIntegrationBrokerId=${broker}&StreamType=1&apiKey=${apiKey()}&Culture=en`;

    const apiContext = await apiContextFor(iCustomWorld);
    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
        Token: `${token()}`,
        ExternalUserID: `${externalUserID()}`,
      },
    });

    iCustomWorld.response = await responseBody.json();
    iCustomWorld.responseBody = await responseBody;
  }

  async streamUrl(iCustomWorld: ICustomWorld) {
    const data = iCustomWorld.response as { surl: string };
    const surlValue = data.surl;
    const isExpectedValue = typeof surlValue === 'string' && surlValue.length === 21;
    expect(isExpectedValue).toBe(true);
  }
}




