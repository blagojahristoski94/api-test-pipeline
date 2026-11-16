import { ICustomWorld } from '../../world';
import { expect } from '@playwright/test';
import { apiContextFor } from '../../support/utils/apiClient';
import { baseUrl, externalUserID, readDataFromFile, token } from '../../support/utils/utilityFunctions';
import path from 'path';

interface AlgoPriceResponse {
  TotalOdd: number;
  ResponseErrorMsg: string | null;
  Probability: number;
}

export default class postApiFEWAlgoBet {

  async algoPrice(
    iCustomWorld: ICustomWorld,
    marketId: number,
    outcomeIndex: 0 | 1,
    attempt = 0,
  ): Promise<void> {
    const filePathH = path.join(__dirname, '../../../data/highlights.json');
    const registerDataH = readDataFromFile(filePathH);
    const MAX_ATTEMPTS = registerDataH.m.length - 1; // Set the maximum number of attempts to the length of the registerDataH.m array 

    if (attempt >= MAX_ATTEMPTS) {
      throw new Error(
        `Could not get a valid AlgoPrice after ${MAX_ATTEMPTS} attempts.`
      );
    }

    const filePath = path.join(__dirname, '../../../data/MatchOdds.json');
    const registerData = readDataFromFile(filePath);



    const apiUrl = `${baseUrl()}/FEWAlgoBet/GetAlgoPrice`;

    const apiContext = await apiContextFor(iCustomWorld);
    const index = iCustomWorld.stake as number;
    const selectedOutcome = registerData.t
      .flatMap((t: any) => t.o)
      .find((o: any) => o.id === marketId);
    iCustomWorld.algoSelection = selectedOutcome ? [selectedOutcome] : [];
    if (!selectedOutcome) {
      throw new Error(`Outcome id ${marketId} not found`);
    }

    const requestData = {
      culture: 'en',
      mid: registerDataH.m[index].mid,
      sid: registerDataH.m[index].sid,
      il: false,
      tid: registerDataH.m[index].tid,
      ht: registerDataH.m[index].ht,
      at: registerDataH.m[index].at,
      tn: registerDataH.m[index].tn,
      i: '',
      outi: [
        {
          oid: registerData.t[0].o[0].id,
          otoid: registerData.t[0].o[0].m[0].id,
          odd: registerData.t[0].o[0].m[0].o,
          issbv: false,
          ipm: false,
          pn: null,
          pt: null,
          sbv: '',
          id: null,
          it: 1,
        },
        {
          oid: selectedOutcome.id,
          otoid: selectedOutcome.m[outcomeIndex].id,
          odd: selectedOutcome.m[outcomeIndex].o,
          issbv: true,
          ipm: false,
          pn: null,
          pt: null,
          sbv: selectedOutcome.m[outcomeIndex].sbv,
          id: null,
          it: 1,
        },
      ],
    };

    const responseBody = await apiContext.post(apiUrl, {
      data: requestData,
    });

    const response = await responseBody.json();

    // Retry if Probability is 0
    if (response.Probability === 0 && outcomeIndex === 0) {
      console.log(`Probability is 0. Retrying... Attempt ${attempt + 1}`);

      await iCustomWorld.pageObj?.getApiFEWMatches.getMatches(iCustomWorld, 'FEWMatches/MatchOdds')
      return await this.algoPrice(iCustomWorld, marketId, outcomeIndex, attempt + 1);
    }

    if (response.ResponseErrorMsg !== "Incompatible Algo Item" && outcomeIndex !== 0) {
      console.log(`ResponseErrorMsg is not null. Retrying... Attempt ${attempt + 1}`);

      await iCustomWorld.pageObj?.getApiFEWMatches.getMatches(iCustomWorld, 'FEWMatches/MatchOdds')
      return await this.algoPrice(iCustomWorld, marketId, outcomeIndex, attempt + 1);
    }

    iCustomWorld.responseBody = responseBody;
    iCustomWorld.response = response;
  }

  async validateAlgoPrice(iCustomWorld: ICustomWorld) {
    const response = iCustomWorld.response as unknown as AlgoPriceResponse;

    expect(response).toBeDefined();
    expect(response).not.toBeNull();

    expect(response.TotalOdd).toBeDefined();
    expect(typeof response.TotalOdd).toBe('number');
    expect(response.TotalOdd).toBeGreaterThan(0);

    expect(response.Probability).toBeDefined();
    expect(typeof response.Probability).toBe('number');
    expect(response.Probability).toBeGreaterThan(0);

    expect(response.ResponseErrorMsg).toBeNull();
  }

  async incopatibleAlgoItem(iCustomWorld: ICustomWorld, message: string) {
    const response = iCustomWorld.response as unknown as AlgoPriceResponse;

    expect(response).toBeDefined();
    expect(response).not.toBeNull();

    expect(response.ResponseErrorMsg).toBe(message);
  }

  async algoPlacement(iCustomWorld: ICustomWorld, stake: string) {
    const apiUrl = `${baseUrl()}/FEWBetslip/Place` as string
    const apiContext = await apiContextFor(iCustomWorld);
    const headers = {
      'Token': token() as string,
      'externaluserid': externalUserID() as string,
    };

    const filePath = path.join(__dirname, '../../../data/highlights.json');
    const registerData = readDataFromFile(filePath);
    const filePath1 = path.join(__dirname, '../../../data/MatchOdds.json');
    const registerDataM = readDataFromFile(filePath1);
    const Index = iCustomWorld.stake as number
    const selectedOutcome = iCustomWorld.algoSelection?.[0] as { id: number; m: { id: number; o: number; sbv: string }[] };

    if (registerData.m[Index].o[0].m[0].su === false) {
      const sportID = registerData.m[Index].sid
      const matchId = registerData.m[Index].mid
      const odds = iCustomWorld.response as unknown as AlgoPriceResponse
      const tournametID = registerData.m[Index].tid
      const categoryId = registerData.m[Index].cid
      const tournametName = registerData.m[Index].tn
      const outcomeId1 = registerDataM.t[0].o[0].m[0].id
      const odds1 = registerDataM.t[0].o[0].m[0].o
      const marketId1 = registerData.m[Index].o[0].id
      const homeTeam = registerData.m[Index].ht
      const awayTeam = registerData.m[Index].at

      const requestData = {
        "absi": [{
          "SpecialBetValue": selectedOutcome.m[0].sbv,
          "oid": outcomeId1,
          "it": 13,
          "mid": matchId,
          "oo": odds.TotalOdd,
          "b": false,
          "sid": sportID,
          "tid": tournametID,
          "cid": categoryId,
          "potid": 0,
          "cmid": matchId,
          "otoid": 0,
          "cogid": null,
          "otid": 1237,
          "id": 0
        }],
        "bs": [{
          "am": stake,
          "i": [{
            "SpecialBetValue": selectedOutcome.m[0].sbv,
            "oid": outcomeId1,
            "it": 13,
            "mid": matchId,
            "oo": odds.TotalOdd,
            "b": false,
            "sid": sportID,
            "tid": tournametID,
            "cid": categoryId,
            "potid": 0,
            "cmid": matchId,
            "otoid": 0,
            "cogid": null,
            "otid": 1237,
            "id": 0
          }],
          "comb": 1,
          "to": odds.TotalOdd,
        }],
        "fbid": null,
        "bstid": 2,
        "ti": 1,
        "tb": 0,
        "sci": 0,
        "scid": 0,
        "p": 0,
        "bm": 0,
        "ios": false,
        "mao": odds.TotalOdd,
        "mio": odds.TotalOdd,
        "miw": 0,
        "maw": 0,
        "id": "GvBYJtXi9v",
        "am": 1,
        "dguid": "",
        "aoce": 1,
        "uid": null,
        "refu": false,
        "tfa": false,
        "bbid": 0,
        "bb": [],
        "bc": null,
        "abb": [{
          "mid": matchId,
          "sid": sportID,
          "il": false,
          "pr": odds.TotalOdd,
          "tid": tournametID,
          "tn": tournametName,
          "ht": homeTeam,
          "at": awayTeam,
          "i": "66456910",
          "outi": [{
            "oid": marketId1,
            "otoid": outcomeId1,
            "odd": odds1,
            "issbv": false,
            "ipm": false,
            "pn": null,
            "pt": null,
            "sbv": "",
            "id": null,
            "it": 1
          },
          {
            "oid": selectedOutcome.id,
            "otoid": selectedOutcome.m[0].id,
            "odd": selectedOutcome.m[0].o,
            "issbv": true,
            "ipm": false,
            "pn": null,
            "pt": null,
            "sbv": selectedOutcome.m[0].sbv,
            "id": null,
            "it": 1
          }]
        }]
      }

      const response = await apiContext.post(apiUrl, {
        headers: headers,
        data: requestData,
      });

      const responseBody = await response.json()
      iCustomWorld.responseBody = response;
      iCustomWorld.response = responseBody;

    }
  }
};