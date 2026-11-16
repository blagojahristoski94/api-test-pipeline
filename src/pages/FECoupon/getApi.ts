import { ICustomWorld } from './../../world';
import { apiContextFor } from '../../support/utils/apiClient';
import { baseUrl } from '../../support/utils/utilityFunctions';

export default class getApiFECoupon {
  async list(iCustomWorld: ICustomWorld, sportID?: string) {
    const apiContext = await apiContextFor(iCustomWorld);

    const sportParam = sportID !== undefined ? `?sportID=${sportID}` : '';
    const fullEndpoint = `${baseUrl()}/FECoupon/List${sportParam}`;

    const response = await apiContext.get(fullEndpoint);

    iCustomWorld.responseBody = await response;

    if (response.ok()) {
      const responseBody = await response.json();
      iCustomWorld.response = await responseBody;
    }

    return response;
  }

  async details(iCustomWorld: ICustomWorld, couponeID?: string) {
    const apiContext = await apiContextFor(iCustomWorld);

    const couponParam = couponeID !== undefined ? `&couponID=${couponeID}` : '';
    const fullEndpoint = `${baseUrl()}/FECoupon/Details?culture=en&skipItems=0&takeItems=20${couponParam}`;

    const response = await apiContext.get(fullEndpoint);
    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
    return response;
  }
}