import { expect } from "@playwright/test";
import { approximatelyEqual, baseUrl, externalUserID, generateCombinations, multiplyNumbersInArray, readDataFromFile, token, writeDataToFile } from "../../support/utils/utilityFunctions";
import { ICustomWorld } from "../../world";
import { apiContextFor, requestAndStore } from '../../support/utils/apiClient';
import path from "path";
import fs from 'fs'

interface BetslipIDs {
  [key: string]: number | undefined;
}

export default class getApiFEWBetslip {
  async getHistory(iCustomWorld: ICustomWorld, betslipStatus: number = 0, type?: string, culture?: string, timeOffset?: number, page?: number, items?: number, fromDate?: string, toDate?: string) {

    const fullEndpoint = `${baseUrl()}/FEWBetSlip/History`;

    const params = {
      'status[]': String(betslipStatus),
      ...(type !== undefined && { type }),
      ...(culture !== undefined && { culture }),
      ...(timeOffset !== undefined && { timeOffset: String(timeOffset) }),
      ...(page !== undefined && { page: String(page) }),
      ...(items !== undefined && { items: String(items) }),
      ...(fromDate !== undefined && { fromDate }),
      ...(toDate !== undefined && { toDate }),
    };

    const headers = {
      ...(token && { Token: `${token()}` }),
      ...(externalUserID && { ExternalUserID: `${externalUserID()}` })
    }

    await requestAndStore(iCustomWorld, fullEndpoint, { params, headers });
  }

  async periodToDateRange(iCustomWorld: ICustomWorld, period: string) {
    const toDate = new Date();
    toDate.setUTCHours(23, 59, 59, 999);
    const fromDate = new Date();
    fromDate.setUTCHours(0, 0, 0, 0);

    switch (period) {
      case 'today':
        fromDate.setUTCDate(fromDate.getUTCDate());
        break;
      case 'last week':
        fromDate.setUTCDate(fromDate.getUTCDate() - 7);
        break;
      case 'last month':
        const day = fromDate.getUTCDate();
        fromDate.setUTCDate(1);
        fromDate.setUTCMonth(fromDate.getUTCMonth() - 1);
        const daysInMonth = new Date(Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth() + 1, 0)).getUTCDate();
        fromDate.setUTCDate(Math.min(day, daysInMonth));
        break;
      case 'last year':
        fromDate.setUTCFullYear(fromDate.getUTCFullYear() - 1);
        break;
    }

    iCustomWorld.historyFromDate = fromDate.toISOString();
    iCustomWorld.historyToDate = toDate.toISOString();
  }

  async validatePlacementDateInRange(iCustomWorld: ICustomWorld, period?: string) {
    const responseBody: unknown = iCustomWorld.response;
    expect(Array.isArray(responseBody), 'History response is not a list of tickets').toBe(true);

    const responseArray = responseBody as { c: string }[];
    if (responseArray.length === 0) {
      console.log(`There are no tickets found for the placement date filter: ${period}`);
      return;
    }

    const rangeStart = new Date(iCustomWorld.historyFromDate as string);
    const rangeEnd = new Date(iCustomWorld.historyToDate as string);

    responseArray.forEach((ticket) => {
      const placementDate = new Date(ticket.c); // c is UTC, e.g. 2026-10-21T13:45:11Z
      expect(placementDate.getTime(), `Placement date ${ticket.c} is before fromDate ${iCustomWorld.historyFromDate} (${period})`).toBeGreaterThanOrEqual(rangeStart.getTime());
      expect(placementDate.getTime(), `Placement date ${ticket.c} is after toDate ${iCustomWorld.historyToDate} (${period})`).toBeLessThanOrEqual(rangeEnd.getTime());
    })
  }

  async getTime(iCustomWorld: ICustomWorld) {
    const responseBody: unknown = iCustomWorld.response;

    if (!responseBody || !Array.isArray(responseBody)) {
      return
    }

    const responseArray = responseBody as { c: string }[];
    expect(responseArray.length, 'History returned no tickets, the placed ticket is missing').toBeGreaterThan(0);

    // History is sorted newest first, so the first ticket is the last placed one.
    // Older tickets (e.g. from a previous scenario or run) are not part of this check.
    const lastPlacedTicket = responseArray[0];
    const currentDate = new Date();
    const responseDate = new Date(lastPlacedTicket.c);

    const timeDifference = Math.abs(currentDate.getTime() - responseDate.getTime());
    const timeDifferenceInMinutes = timeDifference / (1000 * 60);
    expect(timeDifferenceInMinutes).toBeLessThanOrEqual(1);
  }

  async getStatus(iCustomWorld: ICustomWorld, status: string) {
    const responseBody: unknown = iCustomWorld.response;
    // History returns a list of tickets (st: BetSlipStatusType.Placed), History Details returns one ticket in "g" (st: Placed)
    const responseArray = (Array.isArray(responseBody) ? responseBody : [(responseBody as { g?: object })?.g]) as { st?: string }[];
    if (responseArray.length === 0) {
      console.log(`There are no tickets found for the status filter: ${status}`);
      return;
    }

    responseArray.forEach((response) => {
      const statusResponse = response?.st?.replace('BetSlipStatusType.', '');
      expect(statusResponse).toBe(status);
    })
  }

  async getType(iCustomWorld: ICustomWorld, type: string) {
    const responseBody: unknown = iCustomWorld.response;
    // History returns a list of tickets (bty), History Details returns one ticket in "g" (t)
    const responseArray = (Array.isArray(responseBody) ? responseBody : [(responseBody as { g?: object })?.g]) as { bty?: string; t?: string }[];
    if (responseArray.length === 0) {
      console.log(`There are no tickets found for the bet type filter: ${type}`);
      return;
    }

    responseArray.forEach((response) => {
      const betType = response?.bty ?? response?.t;
      expect(betType).toBe(type);
    })
  }

  async getBetslipType(iCustomWorld: ICustomWorld, type: string) {
    const responseBody: unknown = iCustomWorld.response;
    // History returns a list of tickets (ty), History Details returns one ticket in "g" (mt)
    const responseArray = (Array.isArray(responseBody) ? responseBody : [(responseBody as { g?: object })?.g]) as { ty?: string; mt?: string }[];
    if (responseArray.length === 0) {
      console.log(`There are no tickets found for the betslip type filter: ${type}`);
      return;
    }

    responseArray.forEach((response) => {
      const betslipType = response?.ty ?? response?.mt;
      expect(betslipType).toBe(`BetSlipMatchType.${type}`);
    })
  }

  async getNumberOfCombinations(iCustomWorld: ICustomWorld, numberOfCombinations: number) {
    const responseBody: unknown = iCustomWorld.response;
    // History Details returns the combinations in the "c" list, each one with its own "c" property (Combinations.2)
    const responseArray = ((responseBody as { c?: object[] })?.c ?? []) as { c?: string }[];
    if (responseArray.length === 0) {
      console.log(`There are no combinations found for the number of combinations filter: ${numberOfCombinations}`);
      return;
    }

    responseArray.forEach((response) => {
      const combinations = response?.c;
      expect(combinations).toBe(`Combinations.${numberOfCombinations}`);
    })
  }

  async getTicketsIDs(iCustomWorld: ICustomWorld, propertyName: string) {
    const responseBody: unknown = iCustomWorld.response;
    if (!responseBody) {
      return;
    }

    const body = Array.isArray(responseBody) ? responseBody[0] : responseBody;
    const ticketId = body?.BetSlipGroupID ?? body?.id;

    const filePath = path.resolve('./data/betslipIDs.json');
    let existingData: BetslipIDs = {};

    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContents) as BetslipIDs;
    }
    existingData[propertyName] = ticketId;

    writeDataToFile(filePath, existingData);
  }

  async getOdds(iCustomWorld: ICustomWorld) {
    const responseBody: unknown = iCustomWorld.response;
    if (!responseBody || !Array.isArray(responseBody)) {
      return
    }

    const responseArray = responseBody as { o: string }[];
    responseArray.forEach((response) => {
      const odds = parseFloat(response.o);
      const calculatedOdds = multiplyNumbersInArray(iCustomWorld.odds as number[])
      expect(approximatelyEqual(odds, calculatedOdds, 0.03)).toBe(true);
    })
  }

  async combination(iCustomWorld: ICustomWorld) {
    const responseBody: unknown = iCustomWorld.response;
    if (!responseBody || !Array.isArray(responseBody)) {
      return
    }

    const responseArray = responseBody as { lc: string }[];
    responseArray.forEach((response) => {
      const combi = response.lc;
      const odds = iCustomWorld.odds as number[];
      const oddsAsStrings = odds.map(String);
      const total = generateCombinations(oddsAsStrings);
      const numberCount = total.filter((item) => typeof item === 'number' && !isNaN(item)).length;
      expect(combi).toBe(numberCount);
    })
  }

  async totalStake(iCustomWorld: ICustomWorld) {
    const responseBody: unknown = iCustomWorld.response;
    if (!responseBody || !Array.isArray(responseBody)) {
      return
    }

    const responseArray = responseBody as { s: string }[];
    responseArray.forEach((response) => {
      const stake = response.s;
      const odds = iCustomWorld.odds as number[];
      const oddsAsStrings = odds.map(String);
      const total = generateCombinations(oddsAsStrings);
      const numberCount = total.filter((item) => typeof item === 'number' && !isNaN(item)).length;
      const calculatedStake = iCustomWorld.stake as number * numberCount
      expect(stake).toBe(calculatedStake);
    })
  }

  async getHistoryDetails(iCustomWorld: ICustomWorld, idTicket: string, attempt: number = 0): Promise<void> {
    const apiContext = await apiContextFor(iCustomWorld);

    const filePath = path.join(__dirname, '../../../data/betslipIDs.json');
    const registerData = readDataFromFile(filePath);
    const ticketID = registerData[idTicket]
    const fullEndpoint = `${baseUrl()}/FEWBetSlip/HistoryDetails?BetSlipGroupID=${ticketID}&Culture=en`;
    const response = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
        Token: `${token()}`,
        ExternalUserID: `${externalUserID()}`,
      },
    });
    // Right after placement the ticket may not be readable yet and the endpoint answers 200 with an empty body
    if ((await response.body()).length === 0 && attempt < 5) {
      console.log(`History Details body is empty. Retrying... Attempt ${attempt + 1}`);

      await new Promise(resolve => setTimeout(resolve, 1000));
      return await this.getHistoryDetails(iCustomWorld, idTicket, attempt + 1);
    }

    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }

  async betIdentifier(iCustomWorld: ICustomWorld, idTicket: string) {
    // await new Promise(resolve => setTimeout(resolve, 5000));
    const apiContext = await apiContextFor(iCustomWorld);

    const filePath = path.join(__dirname, '../../../data/betslipIDs.json');
    const registerData = readDataFromFile(filePath);
    const ticketID = registerData[idTicket]
    const fullEndpoint = `${baseUrl()}/FEWBetSlip/HistoryDetails?BetSlipGroupID=${ticketID}&Culture=en`;

    const response = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
        Token: `${token()}`,
        ExternalUserID: `${externalUserID()}`,
      },
    });
    const body = await response.json();
    const identifier = body.g.i
    iCustomWorld.betIdentifier = await identifier;
  }

  async bonusRules(iCustomWorld: ICustomWorld, brandId?: string) {
    const brandParam = brandId === undefined ? '0' : brandId;

    await requestAndStore(
      iCustomWorld,
      `${baseUrl()}/FEWBetslip/GetAccumulatorBonusRules`,
      { params: { brandId: brandParam } }
    );
  }

  async checkCashout(iCustomWorld: ICustomWorld, idTicket: string) {
    const apiContext = await apiContextFor(iCustomWorld);
    const fullEndpoint = `${baseUrl()}/FEWBetSlip/CheckCashout?betSlipGroupID=${idTicket}`;

    const response = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
        Token: `${token()}`,
        ExternalUserID: `${externalUserID()}`,
        Provider: '10',
      },
    });
    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }

  async cashoutValue(iCustomWorld: ICustomWorld) {
    const responseBody: unknown = iCustomWorld.response;
    if (!responseBody || !Array.isArray(responseBody)) {
      return
    }

    const responseArray = responseBody as { CashoutValue: string }[];
    responseArray.forEach((response) => {
      const value = response.CashoutValue;
      expect(typeof value).toBe('number');
    })
  }

  async ABBHistoryDetails(iCustomWorld: ICustomWorld, idTicket: string) {
    const apiContext = await apiContextFor(iCustomWorld);

    const filePath = path.join(__dirname, '../../../data/betslipIDs.json');
    const registerData = readDataFromFile(filePath);
    const ticketID = registerData[idTicket]
    const fullEndpoint = `${baseUrl()}/FEWBetSlip/HistoryABBDetails?Culture=en&BetSlipGroupID=${ticketID}`;
    const response = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
        Token: `${token()}`,
        ExternalUserID: `${externalUserID()}`,
      },
    });
    const responseBody = await response.json();

    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }
}