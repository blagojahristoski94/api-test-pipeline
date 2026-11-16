import { ICustomWorld } from '../../world';
import { expect } from '@playwright/test';
import { apiContextFor } from '../../support/utils/apiClient';
import { baseUrl, readDataFromFile } from '../../support/utils/utilityFunctions';
import path from 'path';

export default class postApiFEWFixture {

  async categoryPrint(iCustomWorld: ICustomWorld) {
    const apiUrl = `${baseUrl()}/FEWFixture/CategoryPrint`;
    const apiContext = await apiContextFor(iCustomWorld);
    const filePath = path.join(__dirname, '../../../data/highlights.json');
    const data = readDataFromFile(filePath);
    const tournament = data.m[0].tid
    const oddId = data.m[0].o[0].id

    const requestData =
    {
      "culture": "en",
      "oddTypeIDs": [oddId],
      "TournamentData": [tournament],
      "TournamentGroupData": [],
      "TimeFilter": 0
    }
    const responseBody = await apiContext.post(apiUrl, {
      data: requestData,
    });

    const response = await responseBody.json();
    iCustomWorld.responseBody = await responseBody;
    iCustomWorld.response = await response;
  }

  async getOdds(iCustomWorld: ICustomWorld) {
    const data = iCustomWorld.response as { o: Record<string, Record<string, Record<string, unknown>>> };

    for (const keyO in data.o) {
      for (const keyFirst in data.o[keyO]) {
        for (const keySecond in data.o[keyO][keyFirst]) {
          const odds = data.o[keyO][keyFirst][keySecond];
          const isExpectedValue = typeof odds === "number" && /^\d{1,3}(\.\d{1,2})?$/.test(odds.toString());
          expect(isExpectedValue).toBe(true);
        }
      }
    }
  }
}