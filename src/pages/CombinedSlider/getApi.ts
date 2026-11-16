import { expect } from "@playwright/test";
import { baseUrl } from "../../support/utils/utilityFunctions";
import { apiContextFor } from "../../support/utils/apiClient";
import { ICustomWorld } from "../../world";

export default class getApiCombinedSlider {
  async CombinedSliderElements(iCustomWorld: ICustomWorld) {
    const apiContext = await apiContextFor(iCustomWorld);

    const fullEndpoint = `${baseUrl()}/CombinedSlider/GetCombinedSliderElements?platformId=1&culture=en&localCurrency=EUR&externalUserID&timeOffset=-120`;

    const response = await apiContext.get(fullEndpoint, {
      headers: {
        accept: 'text/plain',
      },
    });
    const responseBody = await response.json();
    iCustomWorld.responseBody = await response;
    iCustomWorld.response = await responseBody;
  }

  async responseIsObjectWithArray(iCustomWorld: ICustomWorld): Promise<void> {
    const response = iCustomWorld.response;
    expect(response).toBeTruthy();

    const body = response as unknown as Record<string, unknown>;

    const keys = ['bo', 'te', 'be'] as const;

    // Check that all keys exist and are arrays
    for (const key of keys) {
      expect(body[key]).toBeDefined();
      expect(Array.isArray(body[key])).toBe(true);
    }

    // At least one array must contain a value
    const hasValue = keys.some(key => (body[key] as unknown[]).length > 0);

    expect(hasValue).toBe(true);
  }
}