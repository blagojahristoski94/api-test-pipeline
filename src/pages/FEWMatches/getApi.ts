import { ICustomWorld } from './../../world';
import { expect } from "@playwright/test";
import * as path from 'path';
import { baseUrl, externalUserID, getRandomIndex, readDataFromFile, token, writeDataToFile } from '../../support/utils/utilityFunctions';
import { apiContextFor } from '../../support/utils/apiClient';
import { DataTable } from '@cucumber/cucumber';

export default class getApiFEWMatches {
  async getMatches(iCustomWorld: ICustomWorld, url: string) {

    const filePath = path.join(__dirname, '../../../data/highlights.json');
    const registerData = readDataFromFile(filePath);
    let randomEvent: number;

    do {
      randomEvent = getRandomIndex(registerData.m.length);
    } while (iCustomWorld.usedIndexes?.includes(randomEvent));

    const usedIndexes = iCustomWorld.usedIndexes || [];
    usedIndexes.push(randomEvent);

    iCustomWorld.usedIndexes = usedIndexes;
    iCustomWorld.stake = randomEvent;

    const matchID = registerData.m[randomEvent].mid;
    const fullEndpoint = `${baseUrl()}/${url}?MatchID=${matchID}&Culture=en`;

    const apiContext = await apiContextFor(iCustomWorld);
    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });

    const response = await responseBody.json();
    const filePathMatch = './data/MatchOdds.json';
    writeDataToFile(filePathMatch, response);
    iCustomWorld.response = response;
    iCustomWorld.responseBody = await responseBody;
  }

  async getPlayerOdds(iCustomWorld: ICustomWorld, index = 0): Promise<void> {
    const filePath = path.join(__dirname, '../../../data/highlights.json');
    const registerData = readDataFromFile(filePath);

    if (index >= registerData.m.length) {
      iCustomWorld.skippedTests = true;
      return;
    }

    const currentMatch = registerData.m[index].mid;
    const fullEndpoint = `${baseUrl()}/FEWMatches/MatchPlayersOdd?MatchID=${currentMatch}&Culture=en`;

    const apiContext = await apiContextFor(iCustomWorld);
    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });

    const response = await responseBody.json();

    if (response.t && response.t.length > 0) {
      iCustomWorld.response = response;
      iCustomWorld.responseBody = await responseBody;
      return;
    }

    await this.getPlayerOdds(iCustomWorld, index + 1);
  }


  async getMatchesOdds(iCustomWorld: ICustomWorld) {
    const data = iCustomWorld.response as { t: { o: { m: { o: string }[] }[] }[] };

    for (let indexO = 0; indexO < data.t[0].o.length; indexO++) {
      const m = data?.t[0].o[indexO].m.length;
      for (let indexM = 0; indexM < m; indexM++) {
        const odds = data?.t[0].o[indexO].m[indexM].o;

        //  Check if odds matches this format (example: 1.11 || 23.34 || 110.23)
        const isExpectedValue = typeof odds === 'string' && /^\d{1,3}\.\d{1,2}$/.test(odds);
        expect(isExpectedValue).toBe(true);
      }
    }
  }

  async responseObject(iCustomWorld: ICustomWorld, dataTable: DataTable) {
    const rows = dataTable.rows();
    const response = iCustomWorld.response;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const expectedKey = row[0];
      const expectedValue = row[1];
      const hasExpectedValue = await iCustomWorld.pageObj?.getApiFEMobile.containsKeyValueInObject(response, expectedKey, expectedValue);
      expect(hasExpectedValue).toBe(true);
    }
  }

  async seenNotification(iCustomWorld: ICustomWorld) {
    const filePath = path.join(__dirname, '../../../data/betslipIDs.json');
    const registerData = readDataFromFile(filePath);
    const ticketID = registerData['singlePrematchId']

    const fullEndpoint = `${baseUrl()}/FEWNotification/Seen?id=${ticketID}`;

    const apiContext = await apiContextFor(iCustomWorld);
    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
        Token: `${token()}`,
        ExternalUserID: `${externalUserID()}`,
      },
    });

    iCustomWorld.responseBody = await responseBody;
  }
}
