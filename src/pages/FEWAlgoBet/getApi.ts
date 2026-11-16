import { ICustomWorld } from '../../world';
import { expect } from '@playwright/test';
import { apiContextFor } from '../../support/utils/apiClient';
import { baseUrl } from '../../support/utils/utilityFunctions';

interface AlgoMarketsResponse {
  p: Record<string, number[]>;
  l: Record<string, number[]>;
  t: number[];
}

export default class getApiBetBuilder {

  async AlgoMarkets(iCustomWorld: ICustomWorld, sportID: string) {
    const apiContext = await apiContextFor(iCustomWorld);
    const fullEndpoint = `${baseUrl()}/FEWAlgoBet/GetAlgoMarkets`;

    const responseBody = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });
    const response = await responseBody.json();
    iCustomWorld.responseBody = await responseBody;
    iCustomWorld.prematchMarkets = response.p[sportID];
    iCustomWorld.liveMarkets = response.l[sportID];
    iCustomWorld.response = await response;
  }

  async listOfAlgoMarkets(iCustomWorld: ICustomWorld, type: 'prematch' | 'live') {
    const response = iCustomWorld.response as AlgoMarketsResponse;
    const expectNumberArrays = (map: Record<string, number[]>) => {
      expect(Object.keys(map)).not.toHaveLength(0);

      Object.values(map).forEach((ids) => {
        expect(ids).not.toHaveLength(0);
        ids.forEach((id) => expect(typeof id).toBe('number'));
      });
    };
    expect(response).toBeDefined();
    if (type === 'prematch') {
      expectNumberArrays(response.p);
    }
    else if (type === 'live') {
      expectNumberArrays(response.l);
    }

    expect(response.t).not.toHaveLength(0);
    response.t.forEach((id) => expect(typeof id).toBe('number'));
  }
}