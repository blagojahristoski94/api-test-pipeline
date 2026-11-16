import { ICustomWorld } from './../../world';
import * as dotenv from 'dotenv';
import { expect } from "@playwright/test";
import { baseUrl, token, externalUserID, writeDataToFile, readDataFromFile, getRandomIndex } from '../../support/utils/utilityFunctions';
import { apiContextFor, requestAndStore } from '../../support/utils/apiClient';
import { DataTable } from '@cucumber/cucumber';
import path from 'path';

dotenv.config();

export default class getApiFEWHome {
  async getApiStreamedMatches(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);

    const endpoint = '/FEWHome/LCGetStreamedMatches?'
    const liveOnly = 'LiveOnly=true'
    const broker = 'StreamingIntegrationBrokerId=4'
    const brandID = 'BrandID=1'
    const fullEndpoint = `${baseUrl()}${endpoint}${liveOnly}&${broker}&${token()}&ExternalUserID=${externalUserID()}&Culture=en&${brandID}`;

    const response = await apiContext.get(fullEndpoint);
    const responseBody = await response.json();

    const filePath = './data/streamedMatches.json';
    writeDataToFile(filePath, responseBody);
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }

  async getApiHighlights(iCustomWorld: ICustomWorld, sport: 1 | 14 | 5 | 2) {
    const apiContext = await apiContextFor(iCustomWorld);

    const fullEndpoint = `rest/FEWHome/Highlights?SportID=${sport}&StartRecord=1&EndRecord=10&Token=${token()}&isMultiMarket=true&Culture=en`;
    const response = await apiContext.get(fullEndpoint);
    const responseBody = await response.json();

    const filePath = './data/highlights.json';
    writeDataToFile(filePath, responseBody);
    iCustomWorld.responseBody = response;
    iCustomWorld.response = responseBody;
  }

  async responseKey(iCustomWorld: ICustomWorld, dataTable: DataTable, key: string) {
    const rows = dataTable.rows();
    const response = iCustomWorld.response as { [key: string]: any };

    expect(response).toHaveProperty(key);
    expect(Array.isArray(response[key])).toBe(true);

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const expectedKey = row[0];
      const expectedValue = row[1];

      const hasExpectedValue = await iCustomWorld.pageObj?.getApiFEMobile.containsKeyValue(response, key, expectedKey, expectedValue);
      expect(hasExpectedValue).toBe(true);
    }
  }

  async getApiMainWidgetMarkets(iCustomWorld: ICustomWorld, culture?: string,) {

    await requestAndStore(
      iCustomWorld,
      `${baseUrl()}/FEWHome/MainWidgetMarkets`,
      culture ? { params: { culture } } : undefined
    );
  }

  async getApiMainWidgetMarketWithoutCulture(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);

    const fullEndpoint = `${baseUrl()}/FEWHome/MainWidgetMarkets`;

    const response = await apiContext.get(fullEndpoint);
    iCustomWorld.responseBody = response;
    iCustomWorld.response = await response.json();
  }


  async getUpcoming(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);

    const endpoint = '/FEWHome/Upcoming?'
    const fullEndpoint = `${baseUrl()}${endpoint}Culture=en&StartRecord=0&EndRecord=20&SportID=1&TimeOffset=-60&NumberOfOddTypes=3&Minutes=480`;

    const response = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
        Token: `${token()}`,
        ExternalUserID: `${externalUserID()}`,
      }
    },);
    const responseBody = await response.json();

    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }


  async checkBetslip(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);

    const endpoint = '/FEWHome/CheckBetslip?'
    const code = await iCustomWorld.betIdentifier;
    const fullEndpoint = `${baseUrl()}${endpoint}Code=${code}&Culture=en`;

    const response = await apiContext.get(fullEndpoint);
    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }

  async matchOdds(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);

    const filePath = path.join(__dirname, '../../../data/highlights.json');
    const data = readDataFromFile(filePath);
    const match = data.m[0].mid
    const outcome = data.m[0].o[0].m[0].id
    const type = data.m[0].o[0].id
    const fullEndpoint = `${baseUrl()}/FEWHome/MatchOddsForMarket?MatchData[]=${match}&Outcomes[]=${outcome}&IsMostBalanced=false&Culture=en&OddType=${type}`;

    const response = await apiContext.get(fullEndpoint);
    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }

  async getMatchesOdds(iCustomWorld: ICustomWorld) {
    const data = iCustomWorld.response as Record<string, { m: { o: string }[] }[]>;
    const dynamicKey = Object.keys(data)[0];
    const odds = data[dynamicKey][0].m[0].o
    const isExpectedValue = typeof odds === 'string' && /^\d{1,3}\.\d{1,2}$/.test(odds);
    expect(isExpectedValue).toBe(true);
  }

  async MatchByEventID(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);

    const filePath = path.join(__dirname, '../../../data/highlights.json');
    const data = readDataFromFile(filePath);
    const randomEvent = getRandomIndex(data.m.length)
    const event = data.m[randomEvent].ec
    const fullEndpoint = `${baseUrl()}/FEWHome/MatchByEventID?culture=en&eventID=${event}`;

    const response = await apiContext.get(fullEndpoint);
    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
    iCustomWorld.homeTeam = data.m[randomEvent].ht
    iCustomWorld.awayTeam = data.m[randomEvent].at
  }

  async topWinnings(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);
    const fullEndpoint = `${baseUrl()}/FEWHome/TopWinnings?numItems=10&winLoadPeriod=3&timeOffset=-120`;

    const response = await apiContext.get(fullEndpoint);
    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }

  async encryptedUsername(iCustomWorld: ICustomWorld) {
    const data = iCustomWorld.response as { u: string }[];
    for (let i = 0; i < data.length; i++) {
      const user = data[i].u
      const isExpectedValue = typeof user === 'string' && /\*{4,}/.test(user);
      expect(isExpectedValue).toBe(true);
    }
  }

  async betPayout(iCustomWorld: ICustomWorld) {
    const data = iCustomWorld.response as { p: string }[];
    for (let i = 0; i < data.length; i++) {
      const payout = data[i].p
      const isExpectedValue = typeof payout === 'string' && /^\d{1,7}\.\d{1,7}$/.test(payout);
      expect(isExpectedValue).toBe(true);
    }
  }

  async winningsDetails(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);
    const filePath = path.join(__dirname, '../../../data/betslipIDs.json');
    const data = readDataFromFile(filePath);
    const id = data['singlePrematchId']
    const fullEndpoint = `${baseUrl()}/FEWHome/WinningsDetails?BetSlipGroupID=${id}&Culture=en`;

    const response = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });
    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }

  async GetActiveSpecialBetTypeCombinations(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);

    const fullEndpoint = `${baseUrl()}/FEWHome/GetActiveSpecialBetTypeCombinations`;

    const response = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });
    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }
  async nonExistingLanguage(iCustomWorld: ICustomWorld, language: string) {
    const message = iCustomWorld.responseText ?? '';
    expect(message).toContain("Language not found for " + language);
  }
}