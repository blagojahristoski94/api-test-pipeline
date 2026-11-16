import { Then, When } from "@cucumber/cucumber";
import { ICustomWorld, isBodyKey, ticketsIds } from "../../world";
import { expect } from "@playwright/test";
import { readDataFromFile, totalOddsAsServer, winningsAsServer } from "../../support/utils/utilityFunctions";
import generateCashout from "../../pages/FEWBetslip/cashoutHub";
import { openNotificationHub, waitForNotification } from "../../pages/FEWBetslip/notificationHub";
import path from "path";

When('I make a POST request for placement with stake {string}', async function (this: ICustomWorld, stake: string) {
  return await this.pageObj?.postApiFEWBetslip.placement(this, stake)
});

Then('I expect the Response Message to be {string}', async function (this: ICustomWorld, message: string) {
  if (this.response && isBodyKey(this.response, 'ResponseMessage')) {
    expect(this.response?.ResponseMessage).toBe(message);
    // await new Promise(resolve => setTimeout(resolve, 5000));
    return
  }
  return
});

When('I make a POST request for combi placement with {string} events and stake {string}', async function (this: ICustomWorld, events: string, stake: string) {
  return await this.pageObj?.postApiFEWBetslip.placement(this, stake, { type: 'combi', items: Number(events) })
});

When('I make a POST request place a single live ticket with stake {string}', async function (this: ICustomWorld, stake: string) {
  return await this.pageObj?.postApiFEWBetslip.placement(this, stake, { matchType: 'live' });
});

When('I make a POST request place a Combi live ticket with {string} events and stake {string}', async function (this: ICustomWorld, events: string, stake: string) {
  return await this.pageObj?.postApiFEWBetslip.placement(this, stake, { type: 'combi', matchType: 'live', items: Number(events) });
});

When('I get Cashout offer from Cashout Hub', async function () {
  return await generateCashout();
})

When('I make a Cashout POST request for {string} ticket', async function (this: ICustomWorld, key: keyof typeof ticketsIds,) {
  const filePath = path.join(__dirname, '../../../data/betslipIDs.json');
  const registerData = readDataFromFile(filePath);
  const responseKey = ticketsIds[key];
  if (responseKey) {
    const id = parseFloat(registerData[responseKey])
    await this.pageObj?.postApiFEWBetslip.cashout(this, id);
    await new Promise(resolve => setTimeout(resolve, 5000));
    return
  }
  return
}
);

When('I make a POST request for system placement with {string} events and stake {string}', async function (this: ICustomWorld, items: string, stake: string) {
  return await this.pageObj?.postApiFEWBetslip.placement(this, stake, { type: 'system', items: Number(items) })
});



When('I make a POST request for Calculate Bonus API with {string} events and stake {string}', async function (this: ICustomWorld, item: string, stake: string) {
  const items = parseFloat(item)
  return await this.pageObj?.postApiFEWBetslip.calculateBonus(this, stake, items)
});

Then('I expect the bonus amount to be calculated appropriately', async function (this: ICustomWorld) {
  const body = this.response as any;
  expect(body).toHaveProperty('MaxBonusAmount');
  const expected = await this.pageObj?.postApiFEWBetslip.bonusCalculation(this, process.env.BONUS_AMOUNT as string) as number;
  expect(Number(body.MaxBonusAmount)).toBeCloseTo(expected, 2);
});

Then('I expect Max Winnings to be calculated appropriately', async function (this: ICustomWorld) {
  const body = this.response as any;
  expect(body).toHaveProperty('MaxWinnings');
  expect(body).toHaveProperty('MaxBonusAmount');
  const expected = winningsAsServer(totalOddsAsServer(this.odds as number[]), this.stake as number) + Number(body.MaxBonusAmount);
  expect(Number(body.MaxWinnings)).toBeCloseTo(expected, 2);
});

Then('I expect Min Winnings to be equal on Max Winnings calculation', async function (this: ICustomWorld) {
  const body = this.response as any;
  expect(body).toHaveProperty('MaxWinnings');
  expect(body.MinWinnings).toEqual(body.MaxWinnings);
});

Then('I expect Min Bonus to be equal on Max Bonus calculation', async function (this: ICustomWorld) {
  const body = this.response as any;
  expect(body).toHaveProperty('MaxBonusAmount');
  expect(body.MinBonusAmount).toEqual(body.MaxBonusAmount);
});

When('I make a POST request for Check Item For Incompatibility API', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiFEWBetslip.incompatibility(this)
})

When('I make a POST request for Set User Wagered Bonus on web', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiFEWBetslip.wageredBonus(this)
})

When('I make a POST request for placement without token and without externaluserid with stake {string}', async function (this: ICustomWorld, stake: string) {
  return await this.pageObj?.postApiFEWBetslip.placement(this, stake, { omitToken: true, omitExternalUserId: true })
});

When('I make a POST request for placement with token but without externaluserid with stake {string}', async function (this: ICustomWorld, stake: string) {
  return await this.pageObj?.postApiFEWBetslip.placement(this, stake, { omitExternalUserId: true })
});

When('I make a POST request for placement without token but with externaluserid with stake {string}', async function (this: ICustomWorld, stake: string) {
  return await this.pageObj?.postApiFEWBetslip.placement(this, stake, { omitToken: true })
});

When('I make a POST request for placement with invalid token and stake {string}', async function (this: ICustomWorld, stake: string) {
  return await this.pageObj?.postApiFEWBetslip.placement(this, stake, { token: 'invalid-token-af92e1' })
});

When('I make a POST request for placement with empty body', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiFEWBetslip.placementWithEmptyBody(this)
});

When('I make a GET request to the Place endpoint', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiFEWBetslip.placementViaGet(this)
});

When('I make a POST request for placement with invalid match id {string} and stake {string}', async function (this: ICustomWorld, invalidMatchId: string, stake: string) {
  return await this.pageObj?.postApiFEWBetslip.placement(this, stake, { matchId: Number(invalidMatchId) })
});

When('I make a POST request for placement with changed odds and stake {string}', async function (this: ICustomWorld, stake: string) {
  return await this.pageObj?.postApiFEWBetslip.placement(this, stake, { oddsOffset: 50, acceptOddsChanges: false })
});

When('I open Notification Hub', async function (this: ICustomWorld) {
  await openNotificationHub(this);
});

// Then('I close Notification Hub', async function (this: ICustomWorld) {
//   await waitForNotification(this);
// });
Then(
  'I wait for Notification Message containing {string}',
  async function (this: ICustomWorld, message: string) {
    await waitForNotification(this, message);
  }
);

Then('I expect the BetSlipGroupID to match the BetSlip number in the waiting for authorization and has been accepted Notification Messages',
  async function (this: ICustomWorld) {
    await waitForNotification(this, 'has been accepted');
    const betSlipGroupID = String(this.notification?.BetSlipGroupID);
    const waiting = this.notification?.ResponseMessage.find(message => message.includes('is waiting for authorization'));
    const waitingNumber = waiting?.match(/\d+/)?.[0];
    const accepted = this.notification?.ResponseMessage.find(message => message.includes('has been accepted'));
    const acceptedNumber = accepted?.match(/\d+/)?.[0];
    expect(waiting).toContain(betSlipGroupID);
    expect(accepted).toContain(betSlipGroupID);
    expect(waitingNumber).toEqual(acceptedNumber);
  }
);
