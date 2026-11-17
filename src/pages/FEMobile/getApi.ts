import { ICustomWorld } from './../../world';
import { baseUrl, token, externalUserID } from '../../support/utils/utilityFunctions';
import { apiContextFor, requestAndStore } from '../../support/utils/apiClient';
import { APIResponse, expect } from '@playwright/test';

export default class getApiFEMobile {

  async containsKeyValueInObject(obj: any, targetKey: string, targetValue: any): Promise<boolean> {
    if (typeof obj !== 'object' || obj === null) return false;

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (String(value) === targetValue) {
          return true;
        }

        // If value is an object, check recursively
        if (typeof value === 'object') {
          const foundInNestedObject = await this.containsKeyValueInObject(value, targetKey, targetValue);
          if (foundInNestedObject) return true;
        }
      }
    }
    return false;
  }


  async containsKeyValue(response: { [key: string]: any }, key: string, expectedKey: string, expectedValue: any): Promise<boolean> {
    const items = response[key];

    if (!Array.isArray(items)) {
      return false;
    }

    return items.some((item: { [key: string]: any }) => {
      if (expectedKey === 'sid' || expectedKey === 'id') {
        const trimmedExpectedValue = expectedValue.trim();
        const expectedNumber = Number(trimmedExpectedValue);
        return item[expectedKey] === expectedNumber;
      }
      if (expectedValue === 'true' || expectedValue === 'false') {
        const expectedBoolean = expectedValue === 'true'; // true if 'true', false if 'false'
        return item[expectedKey] === expectedBoolean;
      }
      return item[expectedKey] === expectedValue;
    });
  }

  async fixturesSports(
    iCustomWorld: ICustomWorld,
    device: 'web' | 'mobile',
    culture?: string,
    loadPeriod?: string,
    timeOffset?: string
  ) {
    let fullEndpoint;
    let params

    switch (device) {
      case 'web':
        fullEndpoint = `${baseUrl()}/FEWFixture/Sports`;
        params = {
          ...(culture !== undefined && { culture }),
        };
        break;
      case 'mobile':
        fullEndpoint = `${baseUrl()}/FEMobile/GetFixturesSports`;
        params = {
          ...(loadPeriod && { loadPeriod }),
          ...(culture && { culture }),
          ...(timeOffset && { timeOffset }),
        };
    }

    await requestAndStore(iCustomWorld, fullEndpoint, { params });
  }

  async getApiMainWidgetMarkets(iCustomWorld: ICustomWorld, culture?: string) {
    const fullEndpoint = `${baseUrl()}/FEWHome/MainWidgetMarkets`;

    await requestAndStore(
      iCustomWorld,
      fullEndpoint,
      culture ? { params: { culture } } : undefined
    );
  }

  async pagedMatches(iCustomWorld: ICustomWorld, widgetType: 'today' | 'upcoming' | 'highlights') {
    let widgetTypeId

    switch (widgetType) {
      case 'today':
        widgetTypeId = 1;
        break;
      case 'upcoming':
        widgetTypeId = 2;
        break;
      case 'highlights':
        widgetTypeId = 3;
        break;
    }
    const fullEndpoint = `${baseUrl()}/FEMobile/GetPagedMatches?DateFilterType=0&Culture=en&StartRecord=0&EndRecord=5&WidgetType=${widgetTypeId}&TimeOffset=-60&NumberOfOddTypes=3&isMultiMarket=true`;
    const apiContext = await apiContextFor(iCustomWorld);
    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });

    iCustomWorld.response = await responseBody.json();
    iCustomWorld.responseBody = await responseBody;
  }

  async sports(
    iCustomWorld: ICustomWorld,
    culture?: string,
  ) {
    const fullEndpoint = `${baseUrl()}/FEMobile/GetSports`;

    await requestAndStore(
      iCustomWorld,
      fullEndpoint,
      culture ? { params: { culture } } : undefined
    );
  }

  async groupedMatches(iCustomWorld: ICustomWorld, url: string) {
    const tournamet = iCustomWorld.betIdentifier

    const fullEndpoint = `${baseUrl()}/${url}?SportData[]=1&CategoryData[]=&CategoryGroupData[]=&TournamentData[]=${tournamet}&TournamentGroupData[]=&TimeFilter=0&Limit=220&culture=en`;
    const apiContext = await apiContextFor(iCustomWorld);
    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });
    const response = await responseBody.json()

    iCustomWorld.response = await response;
    iCustomWorld.responseBody = await responseBody;
  }

  async upcomingWidget(iCustomWorld: ICustomWorld, sport: number) {

    const fullEndpoint = `${baseUrl()}/FEMobile/GetPagedMatches?DateFilterType=0&Culture=en&StartRecord=0&EndRecord=20&WidgetType=1&SportID=${sport}&TimeOffset=-60&NumberOfOddTypes=3&isMultiMarket=true`;
    const apiContext = await apiContextFor(iCustomWorld);
    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });

    const body = await responseBody.json();
    if (body?.d?.m?.[0]?.tid) {
      const identifier = body.d.m[0].tid;
      iCustomWorld.betIdentifier = identifier;
    } else {
      console.error('Not found tournament');
    }
  }

  async userProfile(iCustomWorld: ICustomWorld) {
    const fullEndpoint = `${baseUrl()}/FEMobile/GetUserProfile?ExternalUserID=${externalUserID()}&Token=${token()}&Culture=en`;
    const apiContext = await apiContextFor(iCustomWorld);
    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });
    const response = await responseBody.json();
    iCustomWorld.response = response;
    iCustomWorld.responseBody = await responseBody;
  }

  async liveUpcomingWidget(iCustomWorld: ICustomWorld) {

    const fullEndpoint = `${baseUrl()}/FEMobile/LiveUpcomingFixture?Culture=en`;
    const apiContext = await apiContextFor(iCustomWorld);
    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });
    const response = await responseBody.json();
    iCustomWorld.response = await response;
    iCustomWorld.responseBody = await responseBody;
  }

  async newLiveUpcomingWidget(iCustomWorld: ICustomWorld, culture: string) {

    await requestAndStore(
      iCustomWorld,
      `${baseUrl()}/FEMobile/LiveUpcomingFixture?culture=${culture}`,
      { headers: { accept: 'text/plain' } }
    );
  }

  async searchByName(iCustomWorld: ICustomWorld, device: 'web' | 'mobile', search: string) {
    let fullEndpoint;
    switch (device) {
      case 'web':
        fullEndpoint = `${baseUrl()}/FEWHome/SearchEventsByName?Culture=en&searchTerm=${search}`;
        break;
      case 'mobile':
        fullEndpoint = `${baseUrl()}/FEMobile/SearchEventsByName?languageId=1&searchTerm=${search}`;
        break;
    }

    const apiContext = await apiContextFor(iCustomWorld);
    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });
    const response = await responseBody.json()
    iCustomWorld.response = await response;
    iCustomWorld.responseBody = await responseBody;
  }

  async userBonuses(iCustomWorld: ICustomWorld, user?: string) {
    await requestAndStore(
      iCustomWorld,
      `${baseUrl()}/FEMobile/GetUserBonuses`,
      user !== undefined ? { params: { user } } : undefined
    );
  }

  async language(iCustomWorld: ICustomWorld, platform: 'web' | 'mobile', culture?: string) {

    let fullEndpoint;
    switch (platform) {
      case 'web':
        fullEndpoint = `${baseUrl()}/FEWHome/LanguageResources`;
        break;
      case 'mobile':
        fullEndpoint = `${baseUrl()}/FEMobile/GetLanguageResources`;
        break;
    }

    await requestAndStore(
      iCustomWorld,
      fullEndpoint,
      culture ? { params: { culture } } : undefined
    );
  }

  async fixturesMenuBB(iCustomWorld: ICustomWorld) {
    const fullEndpoint = `${baseUrl()}/FEMobile/GetFixturesMenuBB?culture=en&loadPeriod=0`;
    const { response, body } = await requestAndStore<{ s: { i: { i: { id: number }[] }[] }[] }>(iCustomWorld, fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });

    if (response.status() === 204) {
      iCustomWorld.skippedTests = true;
      return 'skipped' as const;
    }

    iCustomWorld.betIdentifier = String(body.s[0].i[0].i[0].id);
    return;
  }

  async allSwishEvents(iCustomWorld: ICustomWorld) {
    const tid = iCustomWorld.betIdentifier
    const fullEndpoint = `${baseUrl()}/FEMobile/GetGroupedMatchesBB?tournamentGroupData%5B%5D=${tid}&limit=220&culture=en&timeFilter=0`;
    const { body } = await requestAndStore<{ t: { m: { mid: number }[] }[] }[]>(iCustomWorld, fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });

    iCustomWorld.betIdentifier = String(body[0].t[0].m[0].mid);
  }

  async swishMatchDetails(iCustomWorld: ICustomWorld) {
    const matchID = iCustomWorld.betIdentifier;
    const fullEndpoint = `${baseUrl()}/FEMobile/GetSFMatchDetails?matchId=${matchID}&culture=en`;
    await requestAndStore(iCustomWorld, fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });
  }

  async getMatchesOdds(iCustomWorld: ICustomWorld) {
    const body = await iCustomWorld.responseBody as APIResponse;
    const data = await body.json();

    for (let indexO = 0; indexO < data.MatchPreMatchMarkets.length; indexO++) {
      const m = data?.MatchPreMatchMarkets[indexO].oo.length;
      for (let indexM = 0; indexM < m; indexM++) {
        const odds = data?.MatchPreMatchMarkets[indexO].oo[indexM];
        //  Check if odds matches this format (example: 1.11 || 23.34 || 110.23)
        const isExpectedValue = typeof odds === 'string' && /^\d{1,3}\.\d{1,2}$/.test(odds);

        expect(isExpectedValue).toBe(true);
      }
    }
  }
}

