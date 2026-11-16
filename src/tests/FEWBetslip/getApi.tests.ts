import { Then, When } from "@cucumber/cucumber";
import { ICustomWorld, ticketsIds } from "../../world";
import path from "path";
import { readDataFromFile } from "../../support/utils/utilityFunctions";

When('I make a GET request to fetch Betslip History', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getHistory(this as ICustomWorld);
});

When('I make a GET request to fetch Betslip History with status {int} placed from {string} period', async function (this: ICustomWorld, status: number, period: string) {
  await this.pageObj?.getApiFEWBetslip.periodToDateRange(this, period);
  return await this.pageObj?.getApiFEWBetslip.getHistory(this as ICustomWorld, status, undefined, 'en', undefined, 1, 50, this.historyFromDate, this.historyToDate);
});

When('I make a GET request to fetch Betslip History for {string} placed from {string} period', async function (this: ICustomWorld, type: string, period: string) {
  await this.pageObj?.getApiFEWBetslip.periodToDateRange(this, period);
  return await this.pageObj?.getApiFEWBetslip.getHistory(this as ICustomWorld, -1, type, 'en', undefined, 1, 50, this.historyFromDate, this.historyToDate);
});

When('I make a GET request to fetch Betslip History placed from {string} period', async function (this: ICustomWorld, period: string) {
  await this.pageObj?.getApiFEWBetslip.periodToDateRange(this, period);
  return await this.pageObj?.getApiFEWBetslip.getHistory(this as ICustomWorld, -1, undefined, 'en', undefined, 1, 50, this.historyFromDate, this.historyToDate);
});

Then('I expect the placement date of the returned tickets for {string} to be within the filter date range', async function (this: ICustomWorld, period: string) {
  return await this.pageObj?.getApiFEWBetslip.validatePlacementDateInRange(this as ICustomWorld, period)
})

Then('I expect that the betting time of last placed tickets to not be greater than 1 minute', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getTime(this as ICustomWorld)
})

Then('I expect status of the tickets to be {string}', async function (this: ICustomWorld, status: string) {
  return await this.pageObj?.getApiFEWBetslip.getStatus(this as ICustomWorld, status)
})

Then('I expect the type of the placed ticket to be {string} bet type', async function (this: ICustomWorld, type: string) {
  return await this.pageObj?.getApiFEWBetslip.getType(this as ICustomWorld, type)
})

Then('I expect the type of the placed ticket to be {string} betslip type', async function (this: ICustomWorld, type: string) {
  return await this.pageObj?.getApiFEWBetslip.getBetslipType(this as ICustomWorld, type)
})

Then('I expect the number of combinations to be {int}', async function (this: ICustomWorld, numberOfCombinations: number) {
  return await this.pageObj?.getApiFEWBetslip.getNumberOfCombinations(this as ICustomWorld, numberOfCombinations)
})

When('I save ticketsIDs for single prematch', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getTicketsIDs(this, 'singlePrematchId');
});

When('I save ticketsIDs for algo single prematch', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getTicketsIDs(this, 'algoSingleId');
});

When('I save ticketsIDs for combi prematch', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getTicketsIDs(this, 'combiPrematchId');
});

When('I save ticketsIDs for system prematch', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getTicketsIDs(this, 'systemPrematchId');
});

When('I save ticketsIDs for single live', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getTicketsIDs(this, 'singleLiveId');
});

When('I save ticketsIDs for combi live', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getTicketsIDs(this, 'combiLiveId');
});

When('I save ticketsIDs for Algo single', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getTicketsIDs(this, 'algoSingleId');
});

Then('I expect the Bet combination to have appropriate value', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.combination(this as ICustomWorld)
})


Then('I expect the total Stake to have appropriate value', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.totalStake(this as ICustomWorld)
})


When('I make a GET request to fetch Betslip History Details for single Prematch', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getHistoryDetails(this, 'singlePrematchId');
});

When('I make a GET request to fetch Betslip History Details for algo single Prematch', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getHistoryDetails(this, 'algoSingleId');
});


When('I make a GET request to fetch Betslip History Details for combi Prematch', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getHistoryDetails(this, 'combiPrematchId');
});

When('I make a GET request to fetch Betslip History Details for system Prematch', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getHistoryDetails(this, 'systemPrematchId');
});

When('I make a GET request to fetch Betslip History Details for single live', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getHistoryDetails(this, 'singleLiveId');
});

When('I make a GET request to fetch Betslip History Details for combi live', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getHistoryDetails(this, 'combiLiveId');
});


When('I make a GET request to fetch Bet identifier for single prematch', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.betIdentifier(this as ICustomWorld, 'singlePrematchId');
});

When('I make a GET request to fetch Betslip Cashout History', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.getHistory(this as ICustomWorld, 12);
});

When('I make a GET request to fetch Accumulator Bonus Rules', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.bonusRules(this)
});

When('I make a GET request to fetch Accumulator Bonus Rules with brandId {string}', async function (this: ICustomWorld, brandId: string) {
  return await this.pageObj?.getApiFEWBetslip.bonusRules(this, brandId)
});

When('I make a GET request to fetch Check Cashout for {string} ticket', async function (this: ICustomWorld, key: keyof typeof ticketsIds,) {
  const filePath = path.join(__dirname, '../../../data/betslipIDs.json');
  const registerData = readDataFromFile(filePath);
  const responseKey = ticketsIds[key];
  if (responseKey) {
    const id = registerData[responseKey]
    await this.pageObj?.getApiFEWBetslip.checkCashout(this, id);
    return
  }
  return
});

Then('I expect the Cashout Value to have appropiate value', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.cashoutValue(this as ICustomWorld)
})

When('I make a GET request to fetch ABB History Details', async function (this: ICustomWorld) {
  return await this.pageObj?.getApiFEWBetslip.ABBHistoryDetails(this, 'algoSingleId');
});

// Will be reused
// Then('I expect total odds to have appropiate value', async function (this: ICustomWorld) {
//   return await this.pageObj?.getApiFEWBetslip.getOdds(this as ICustomWorld)
// })