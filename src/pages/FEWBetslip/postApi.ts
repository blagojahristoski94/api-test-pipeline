import { apiContextFor, requestAndStore, sendRequest } from '../../support/utils/apiClient';
import { baseUrl, bonusAsServer, externalUserID, readDataFromFile, token, totalOddsAsServer } from "../../support/utils/utilityFunctions";
import { MatchType, pickSelections } from "../../support/offerSelection/selections";
import { PlacementType, buildBetItems, buildPlaceRequest } from "../../support/betslip/placeRequest";
import path from "path";
import { ICustomWorld } from "../../world";

export type PlacementOptions = {
  type?: PlacementType;   // bet-slip type, defaults to single
  matchType?: MatchType;  // prematch picks from highlights.json, live from liveMatches.json; defaults to prematch
  items?: number;         // number of selections for combi and system slips (a single always has one)
  acceptOddsChanges?: boolean; // defaults to true; false makes the server reject a ticket whose odds moved
  // negative-scenario overrides
  token?: string;
  omitToken?: boolean;
  externalUserId?: string;
  omitExternalUserId?: boolean;
  matchId?: number;
  oddsOffset?: number;
};

export default class postApiFEWBetslip {
  // Places a single, combi or system ticket on prematch or live selections
  async placement(iCustomWorld: ICustomWorld, stake: string, options: PlacementOptions = {}) {
    const type = options.type ?? 'single';
    const matchType = options.matchType ?? 'prematch';
    const count = type === 'single' ? 1 : options.items ?? 0;
    if (type !== 'single' && count < 2) {
      throw new Error(`A ${type} placement needs at least 2 selections - pass options.items`);
    }

    const headers: Record<string, string> = {};
    if (!options.omitToken) headers['Token'] = options.token ?? token() as string;
    if (!options.omitExternalUserId) headers['externaluserid'] = options.externalUserId ?? externalUserID() as string;

    const betItems = buildBetItems(pickSelections(matchType, count), matchType, {
      matchId: options.matchId,
      oddsOffset: options.oddsOffset,
    });
    const requestData = buildPlaceRequest(type, stake, betItems, { acceptOddsChanges: options.acceptOddsChanges });

    const apiUrl = `${baseUrl()}/FEWBetslip/Place`;
    const apiContext = await apiContextFor(iCustomWorld);

    const response = await apiContext.post(apiUrl, {
      headers: headers,
      data: requestData,
    });

    iCustomWorld.responseBody = response;
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      iCustomWorld.response = await response.json();
    } else {
      const text = await response.text();
      iCustomWorld.response = { ResponseMessage: text } as any;
    }
    iCustomWorld.stake = parseFloat(stake);
    iCustomWorld.odds = betItems.map((item) => item.oo);
  }

  async calculateBonus(iCustomWorld: ICustomWorld, stake: string, items: number) {
    const headers = {
      'Token': token() as string,
      'externaluserid': externalUserID() as string,
      'Culture': 'en',
      'Provider': '0',
    };

    // CalculateBonus takes the same model as Place; a combi body with prematch selections.
    const betItems = buildBetItems(pickSelections('prematch', items), 'prematch');
    const requestData = buildPlaceRequest('combi', stake, betItems);

    await requestAndStore(iCustomWorld, `${baseUrl()}/FEWBetslip/CalculateBonus`, {
      method: 'POST',
      headers,
      data: requestData,
    });
    iCustomWorld.stake = parseFloat(stake);
    iCustomWorld.odds = betItems.map((item) => item.oo);
  }


  async bonusCalculation(iCustomWorld: ICustomWorld, percentage: string) {
    const { body: rules } = await sendRequest<{ MaxBonus: number | string }>(`${baseUrl()}/FEWBetslip/GetAccumulatorBonusRules`, { params: { brandId: '0' } });
    const totalOdds = totalOddsAsServer(iCustomWorld.odds as number[]);
    return bonusAsServer(totalOdds, iCustomWorld.stake as number, parseFloat(percentage), Number(rules.MaxBonus));
  }

  async cashout(iCustomWorld: ICustomWorld, ticketType: number) {
    const apiUrl = `${baseUrl()}/FEWBetslip/Cashout` as string
    const apiContext = await apiContextFor(iCustomWorld);
    const headers = {
      'Token': token() as string,
      'externaluserid': externalUserID() as string,
    };


    const filePath = path.join(__dirname, '../../../data/cashout.json');
    const registerData = readDataFromFile(filePath);
    const index = registerData.findIndex((obj: { BetSlipGroupID: number; }) => obj.BetSlipGroupID === ticketType);

    const requestData =
    {
      "Amount": registerData[index].CashoutValue,
      "betSlipGroupID": registerData[index].BetSlipGroupID,
      "Culture": "en"
    }



    const response = await apiContext.post(apiUrl, {
      headers: headers,
      data: requestData,
    });

    return response
  }

  async incompatibility(iCustomWorld: ICustomWorld) {
    const apiUrl = `${baseUrl()}/Betslip/CheckItemForIncompatibility` as string;
    const apiContext = await apiContextFor(iCustomWorld);

    const filePath = path.join(__dirname, '../../../data/highlights.json');
    const registerData = readDataFromFile(filePath);
    const requestData = {
      ItemType: 1,
      MatchID: registerData.m[0].mid,
      MatchItems: [
        {
          CompetitorID: null,
          ItemType: 1,
          MatchID: registerData.m[0].mid,
          PlayerID: null
        },
        {
          CompetitorID: null,
          ItemType: 1,
          MatchID: registerData.m[1].mid,
          PlayerID: null
        }
      ],
      OddFormat: "0"
    }

    const responseBody = await apiContext.post(apiUrl, {
      data: requestData,
    });

    const response = await responseBody.json();
    iCustomWorld.responseBody = responseBody;
    iCustomWorld.response = response;
  }

  async wageredBonus(iCustomWorld: ICustomWorld) {
    const fullEndpoint = `${baseUrl()}/FEWBetslip/SetUserWageredBonus`;
    const apiContext = await apiContextFor(iCustomWorld);
    const headers = {
      'token': token() as string,
      'ExternalUserID': `${externalUserID()}`
    };

    const requestData = {
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

  async placementWithEmptyBody(iCustomWorld: ICustomWorld) {
    const apiUrl = `${baseUrl()}/FEWBetslip/Place` as string
    const apiContext = await apiContextFor(iCustomWorld);
    const headers = {
      'Token': token() as string,
      'externaluserid': externalUserID() as string,
    };

    const response = await apiContext.post(apiUrl, {
      headers: headers,
    });

    iCustomWorld.responseBody = response;
  }

  async placementViaGet(iCustomWorld: ICustomWorld) {
    const apiUrl = `${baseUrl()}/FEWBetslip/Place` as string
    const apiContext = await apiContextFor(iCustomWorld);
    const headers = {
      'Token': token() as string,
      'externaluserid': externalUserID() as string,
    };

    const response = await apiContext.get(apiUrl, {
      headers: headers,
    });

    iCustomWorld.responseBody = response;
  }
}