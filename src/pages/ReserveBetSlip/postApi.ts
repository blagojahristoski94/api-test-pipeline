import { expect } from "@playwright/test";
import { apiContextFor } from '../../support/utils/apiClient';
import { baseUrl, externalUserID, readDataFromFile, writeDataToFile, generateRandomString, getRandomIndex } from "../../support/utils/utilityFunctions";
import { BookingCodes, ICustomWorld } from "../../world";
import path from "path";
import * as fs from 'fs';

interface BookingCode {
  [key: string]: string | undefined;
}

export default class postApiReserveBetSlip {

  async reserveEvent(iCustomWorld: ICustomWorld, type: "prematch" | "live") {
    const apiUrl = `${baseUrl()}/ReserveBetSlip/Reserve` as string
    const apiContext = await apiContextFor(iCustomWorld);

    let event: any, matchID: any, marketId: any, marketName: any, outcomeId: any, outcomeName: any, odds: any

    if (type === 'prematch') {
      const registerData = readDataFromFile(path.join(__dirname, '../../../data/highlights.json'));
      const randomEvent = getRandomIndex(registerData.m.length)
      const randomOutcome = getRandomIndex(registerData.m[randomEvent].o[0].m.length);
      event = registerData.m[randomEvent]
      matchID = event.mid
      marketId = event.o[0].id
      marketName = event.o[0].n
      outcomeId = event.o[0].m[randomOutcome].id
      outcomeName = event.o[0].m[randomOutcome].n
      odds = event.o[0].m[randomOutcome].o
    } else if (type === 'live') {
      const registerData = readDataFromFile(path.join(__dirname, '../../../data/liveMatches.json'));
      const randomEvent = getRandomIndex(registerData.length)
      const randomOutcome = getRandomIndex(registerData[randomEvent].odds[0].m.length);
      event = registerData[randomEvent]
      matchID = event.mid
      marketId = event.odds[0].id
      marketName = event.odds[0].n
      outcomeId = event.odds[0].m[randomOutcome].id
      outcomeName = event.odds[0].m[randomOutcome].n
      odds = event.odds[0].m[randomOutcome].o
    }

    const itemKey = `${matchID}_${marketId}_${outcomeId}`

    iCustomWorld.matchID = String(matchID)

    const betSlipObj = {
      acceptOddChange: 2,
      manualAuth: false,
      note: "",
      showBankers: true,
      items: {
        [itemKey]: {
          itemType: 1,
          matchId: matchID,
          outcomeId: outcomeId,
          outcomeName: outcomeName,
          marketId: marketId,
          marketName: marketName,
          odd: odds,

        },
      },
      matchItems: {
        [matchID]: {
          matchId: matchID,
          matchName: `${event.ht} @ ${event.at}`,
          homeTeam: event.ht,
          awayTeam: event.at,
          sportId: event.sid,
          totalBetItems: 1,
          eventCode: event.ec,
          hasBankers: false,
          invertTeams: false,
          categoryId: event.cid,
          categoryName: event.cn,
          betRadarId: event.brid,
          tournamentId: event.tid,
          tournamentName: event.tn,
        },
      },
      folds: {},
      foldLines: { 1: 1 },
      foldOdds: {},
      singles: {},
      singleBonuses: {},
      raceOdds: {},
      ewRace: {},
      bankers: {},
      bonuses: {
        maxWin: 0,
        minWin: 0,
        maxBonus: 0,
        minBonus: 0,
        sumTax: 0,
        sumStakeTax: 0,
      },
      totals: {
        stake: 0,
        maxOdds: odds,
        minOdds: odds,
      },
      freebetId: 0,
      netFreebet: false,
      selectedTab: 1,
      calculationInProgress: false,
      quickBetActive: false,
      quickBetStake: "",
      bookedBetslipDetails: {
        bookCode: null,
        matchItems: [],
      },
      placeTime: Date.now(),
    };

    const betSlipString = JSON.stringify(betSlipObj);

    const requestData = {
      betSlip: betSlipString,
      eventList: [`${matchID}`],
      externalUserID: externalUserID()
    }

    const response = await apiContext.post(apiUrl, {
      data: requestData,
    });

    const responseBody = await response.json();
    const fileBookinCode = './data/bookingCode.json';

    let existingData: BookingCode = {};

    if (fs.existsSync(fileBookinCode)) {
      try {
        existingData = readDataFromFile(fileBookinCode) as BookingCode;
      } catch (error) {
        console.error('Error reading JSON file:', error);
      }
    }
    const bookingCodeKey: Record<"prematch" | "live", string> = {
      prematch: 'prematchBookingCode',
      live: 'liveBookingCode',
    };
    existingData[bookingCodeKey[type]] = responseBody;
    writeDataToFile(fileBookinCode, existingData);
    iCustomWorld.responseBody = response;
    iCustomWorld.response = responseBody;
  }

  async reserveLiveEvent(iCustomWorld: ICustomWorld) {
    const apiUrl = `${baseUrl()}/ReserveBetSlip/Reserve` as string
    const apiContext = await apiContextFor(iCustomWorld);

    const filePath = path.join(__dirname, '../../../data/liveMatches.json');
    const registerData = readDataFromFile(filePath);

    const event = registerData[0]
    const matchID = event.mid
    const odds = registerData[0].odds[0].m[0].o

    const betSlipObj = {
      acceptOddChange: 2,
      manualAuth: false,
      note: "",
      showBankers: true,
      items: {
        [matchID]: {
          marketName: event.odds[0].n,
          marketId: event.odds[0].id,
          matchId: matchID,
          itemType: 1,
          outcomeName: "1",
          outcomeId: registerData[0].odds[0].m[0].id,
          odd: odds,
          identifier: "",
          hasCashout: true,
        },
      },
      matchItems: {
        [matchID]: {
          matchId: matchID,
          matchName: `${event.ht} @ ${event.at}`,
          sportId: event.sid,
          categoryId: event.cid,
          tournamentId: event.tid,
          categoryName: event.cn,
          tournamentName: event.tn,
          eventCode: 1765,
          betRadarId: 51271773,
          totalBetItems: 1,
        },
      },
      folds: {},
      foldLines: { 1: 1 },
      foldOdds: {},
      singles: { [matchID]: 1 },
      singleBonuses: { [matchID]: odds },
      raceOdds: {},
      bankers: {},
      bonuses: {
        maxWin: odds,
        minWin: odds,
        maxBonus: 0,
        minBonus: 0,
        sumTax: 0,
        sumStakeTax: 0,
      },
      totals: {
        stake: 1,
        maxOdds: odds,
        minOdds: odds,
      },
      freebetId: 0,
      netFreebet: false,
      selectedTab: 1,
      calculationInProgress: false,
      quickBetActive: false,
      quickBetStake: "",
      bookedBetslipDetails: {
        bookCode: null,
        matchItems: [],
      },
      placeTime: Date.now(),
    };

    const betSlipString = JSON.stringify(betSlipObj);

    const requestData = {
      betSlip: betSlipString,
      eventList: [`${matchID}`],
      externalUserID: externalUserID()
    }

    const response = await apiContext.post(apiUrl, {
      data: requestData,
    });

    const responseBody = await response.json();
    const fileBookinCode = './data/bookingCode.json';

    let existingData: BookingCode = {};

    if (fs.existsSync(fileBookinCode)) {
      try {
        existingData = readDataFromFile(fileBookinCode) as BookingCode;
      } catch (error) {
        console.error('Error reading JSON file:', error);
      }
    }
    existingData['liveBookingCode'] = responseBody;
    writeDataToFile(fileBookinCode, existingData);

    iCustomWorld.responseBody = response;
    iCustomWorld.response = responseBody;
  }

  async bookingCode(iCustomWorld: ICustomWorld, key: keyof typeof BookingCodes) {
    const response = iCustomWorld.response;
    const filePath = path.join(__dirname, '../../../data/bookingCode.json');
    const registerData = readDataFromFile(filePath);
    const responseKey = BookingCodes[key];
    if (responseKey) {
      expect(typeof response).toBe('string');
      expect(registerData[responseKey].length).toBe(Number(process.env.BOOKING_CODE_LENGTH))
    }
  }

  async retrive(iCustomWorld: ICustomWorld, key: keyof typeof BookingCodes, code: string) {
    const apiUrl = `${baseUrl()}/ReserveBetSlip/Retrieve` as string
    const apiContext = await apiContextFor(iCustomWorld);

    if (code === "valid") {
      const filePath = path.join(__dirname, '../../../data/bookingCode.json');
      const registerData = readDataFromFile(filePath);

      let bookingCode = key === 'prematch' ? registerData['prematchBookingCode'] : key === 'live' ? registerData['liveBookingCode']
        : (() => {
          throw new Error(`Invalid key: ${key}. Expected 'prematch' or 'live'.`);
        })();

      const requestData = {
        ReservationCode: bookingCode
      }

      const response = await apiContext.post(apiUrl, {
        data: requestData,
      });

      const responseBody = await response.json();
      iCustomWorld.responseBody = response;
      iCustomWorld.response = responseBody;
    } else if (code === "invalid") {
      const bookingCodeLength = Number(process.env.BOOKING_CODE_LENGTH);
      const randomInvalidCode = generateRandomString(bookingCodeLength);

      const requestData = {
        ReservationCode: randomInvalidCode
      }

      const response = await apiContext.post(apiUrl, {
        data: requestData,
      });

      const responseBody = await response.json();
      iCustomWorld.responseBody = response;
      iCustomWorld.response = responseBody;
    }
    else {
      throw new Error(`Invalid Booking code status: ${code}. Expected 'valid' or 'invalid'.`);
    }
  }

  async emptyResponse(iCustomWorld: ICustomWorld) {
    const response = iCustomWorld.response as unknown as string;
    expect(response).toBe('');
  }

  async sportID(iCustomWorld: ICustomWorld) {
    const parsedData = typeof iCustomWorld.response === "string" ? JSON.parse(iCustomWorld.response) : iCustomWorld.response;
    const matchID = Object.keys(parsedData.matchItems || {})[0]
    if (parsedData.matchItems?.[matchID]) {
      expect(parsedData.matchItems[matchID].sportId).toBe(1);
    } else {
      throw new Error("matchItems is missing in the API response.");
    }
  }

  async totalItems(iCustomWorld: ICustomWorld) {
    const parsedData = typeof iCustomWorld.response === "string" ? JSON.parse(iCustomWorld.response) : iCustomWorld.response;
    const matchID = Object.keys(parsedData.matchItems || {})[0]
    if (parsedData.matchItems?.[matchID]) {
      expect(parsedData.matchItems[matchID].totalBetItems).toBe(1);
    } else {
      throw new Error("matchItems is missing in the API response.");
    }
  }

  async totalLiveItems(iCustomWorld: ICustomWorld) {
    const parsedData = typeof iCustomWorld.response === "string" ? JSON.parse(iCustomWorld.response) : iCustomWorld.response;
    const matchID = Object.keys(parsedData.matchItems || {})[0]
    if (parsedData.matchItems?.[matchID]) {
      expect(parsedData.matchItems[matchID].totalBetItems).toBe(1);
    } else {
      throw new Error("matchItems is missing in the API response.");
    }
  }

  async matchName(iCustomWorld: ICustomWorld) {
    const parsedData = typeof iCustomWorld.response === "string" ? JSON.parse(iCustomWorld.response) : iCustomWorld.response;
    const matchID = Object.keys(parsedData.matchItems || {})[0]
    const registerData = readDataFromFile(path.join(__dirname, '../../../data/highlights.json'));
    const event = registerData.m.find((m: any) => String(m.mid) === matchID)
    if (parsedData.matchItems?.[matchID]) {
      expect(parsedData.matchItems[matchID].matchName).toContain(`${event.ht} @ ${event.at}`);
    } else {
      throw new Error("matchItems is missing in the API response.");
    }
  }

  async liveMatchName(iCustomWorld: ICustomWorld) {
    const parsedData = typeof iCustomWorld.response === "string" ? JSON.parse(iCustomWorld.response) : iCustomWorld.response;
    const matchID = Object.keys(parsedData.matchItems || {})[0]
    const registerData = readDataFromFile(path.join(__dirname, '../../../data/liveMatches.json'));
    const event = registerData.find((m: any) => String(m.mid) === matchID)
    if (parsedData.matchItems?.[matchID]) {
      expect(parsedData.matchItems[matchID].matchName).toContain(`${event.ht} @ ${event.at}`);
    } else {
      throw new Error("matchItems is missing in the API response.");
    }
  }


  async tournamentName(iCustomWorld: ICustomWorld) {
    const parsedData = typeof iCustomWorld.response === "string" ? JSON.parse(iCustomWorld.response) : iCustomWorld.response;
    const matchID = Object.keys(parsedData.matchItems || {})[0]
    const registerData = readDataFromFile(path.join(__dirname, '../../../data/highlights.json'));
    const event = registerData.m.find((m: any) => String(m.mid) === matchID)
    if (parsedData.matchItems?.[matchID]) {
      expect(parsedData.matchItems[matchID].tournamentName).toEqual(event.tn);
    } else {
      throw new Error("matchItems is missing in the API response.");
    }
  }

  async liveTournamentName(iCustomWorld: ICustomWorld) {
    const parsedData = typeof iCustomWorld.response === "string" ? JSON.parse(iCustomWorld.response) : iCustomWorld.response;
    const matchID = Object.keys(parsedData.matchItems || {})[0]
    const registerData = readDataFromFile(path.join(__dirname, '../../../data/liveMatches.json'));
    const event = registerData.find((m: any) => String(m.mid) === matchID)
    if (parsedData.matchItems?.[matchID]) {
      expect(parsedData.matchItems[matchID].tournamentName).toEqual(event.tn);
    } else {
      throw new Error("matchItems is missing in the API response.");
    }
  }


  async odds(iCustomWorld: ICustomWorld) {
    const parsedData = typeof iCustomWorld.response === "string" ? JSON.parse(iCustomWorld.response) : iCustomWorld.response;
    const matchID = Object.keys(parsedData.matchItems || {})[0]
    const registerData = readDataFromFile(path.join(__dirname, '../../../data/highlights.json'));
    const event = registerData.m.find((m: any) => String(m.mid) === matchID)
    const item = Object.values(parsedData.items || {}).find((i: any) => String(i.matchId) === matchID) as any
    if (item && event) {
      const outcome = event.o[0].m.find((m: any) => m.id === item.outcomeId)
      expect(item.odd).toEqual(outcome.o);
    } else {
      throw new Error("matchItems is missing in the API response.");
    }
  }

  async liveOdds(iCustomWorld: ICustomWorld) {
    const parsedData = typeof iCustomWorld.response === "string" ? JSON.parse(iCustomWorld.response) : iCustomWorld.response;
    const matchID = Object.keys(parsedData.matchItems || {})[0]
    const registerData = readDataFromFile(path.join(__dirname, '../../../data/liveMatches.json'));
    const event = registerData.find((m: any) => String(m.mid) === matchID)
    const item = Object.values(parsedData.items || {}).find((i: any) => String(i.matchId) === matchID) as any
    if (item && event) {
      const outcome = event.odds[0].m.find((m: any) => m.id === item.outcomeId)
      expect(item.odd).toEqual(outcome.o);
    } else {
      throw new Error("matchItems is missing in the API response.");
    }
  }


  async maxWin(iCustomWorld: ICustomWorld) {
    const parsedData = typeof iCustomWorld.response === "string" ? JSON.parse(iCustomWorld.response) : iCustomWorld.response;
    if (parsedData.bonuses) {
      expect(parsedData.bonuses.maxWin).toBe(0);
    } else {
      throw new Error("matchItems is missing in the API response.");
    }
  }

  async liveMaxWin(iCustomWorld: ICustomWorld) {
    const parsedData = typeof iCustomWorld.response === "string" ? JSON.parse(iCustomWorld.response) : iCustomWorld.response;
    if (parsedData.bonuses) {
      expect(parsedData.bonuses.maxWin).toBe(0);
    } else {
      throw new Error("matchItems is missing in the API response.");
    }
  }
}


