import { ICustomWorld, isBodyKey } from './../world';
import { DataTable, Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import generateLiveMatchesCSV from '../pages/FEWBetslip/ws';

enum ResponseKey {
  streamedMatches = 'slt',
  highlights = 'm',
  matchTabs = 't',
}

Then('I expect the response status to be OK with code {int}', function (this: ICustomWorld, expectedStatus: number) {
  expect(this.responseBody?.status()).toBe(expectedStatus);
});

Then('I expect the response status to be NOT OK with code {int}', function (this: ICustomWorld, expectedStatus: number) {
  expect(this.responseBody?.status()).toBe(expectedStatus);
});


Then('I expect the response body object to have the following values:', async function (this: ICustomWorld, dataTable: DataTable) {
  return await this.pageObj?.getApiFEWMatches.responseObject(this, dataTable)
});

Then(
  'I expect response body object to return array with key {string} and to have following values',
  async function (
    this: ICustomWorld,
    key: keyof typeof ResponseKey,
    dataTable: DataTable
  ) {
    const responseKey = ResponseKey[key];
    if (responseKey) {
      return await this.pageObj?.getApiFEWHome.responseKey(this, dataTable, responseKey);
    }
  }
);

Then('I expect the response body to have no events or tournaments', function (this: ICustomWorld) {
  const response = this.response as any;
  expect(response.Events).toEqual([]);
  expect(response.Tournaments).toEqual([]);
});

Then('I expect the response error message to be {string}', async function (this: ICustomWorld, expectedMessage: string) {
  const json = this.response as any;
  if (json?.errors) {
    const allErrors = Object.values(json.errors).flat() as string[];
    expect(allErrors).toContain(expectedMessage);
  } else {
    // Non-JSON bodies are kept verbatim on the world, so the raw text is already there to read.
    const text = this.responseText ?? (typeof json === 'string' ? json : await this.responseBody!.text());
    expect(text).toContain(expectedMessage);
  }
});

Then('I expect the response body to be an empty array', async function (this: ICustomWorld) {
  expect(Array.isArray(this.response)).toBe(true);
  expect((this.response as unknown[]).length).toBe(0);
});

Given('I connect to WebSocket and write decompressed data to liveMatches', async function () {
  return await generateLiveMatchesCSV();
})

Then('I expect the Notification Message to contain {string}', async function (this: ICustomWorld, message: string) {
  if (this.response && isBodyKey(this.response, 'ResponseMessage')) {
    expect(this.response?.ResponseMessage).toContain(message);
    return
  }
  return
});
