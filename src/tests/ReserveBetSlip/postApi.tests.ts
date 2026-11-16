import { Then, When } from "@cucumber/cucumber";
import { ICustomWorld } from "../../world";

When('I make a POST request to Reserve a Betslip with {string} events', async function (this: ICustomWorld, type: "prematch" | "live") {
  return await this.pageObj?.postApiReserveBetSlip.reserveEvent(this, type);
});

Then('I expect the booking code to be generated for {string}', async function (this: ICustomWorld, key: "prematch" | "live") {
  return await this.pageObj?.postApiReserveBetSlip.bookingCode(this, key)
});

When('I make a POST request to Retrive a Betslip for {string} Event with {string} code', async function (this: ICustomWorld, key: "prematch" | "live", code: "valid" | "invalid") {
  return await this.pageObj?.postApiReserveBetSlip.retrive(this, key, code);
});

Then('I expect to have only one item for reserved ticket', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiReserveBetSlip.totalItems(this)
});

Then('I expect to have only one item for reserved Live ticket', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiReserveBetSlip.totalLiveItems(this)
});

Then('I expect the match name to be the same as the reserved one', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiReserveBetSlip.matchName(this)
});

Then('I expect the Live match name to be the same as the reserved one', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiReserveBetSlip.liveMatchName(this)
});

Then('I expect the sport for reserved ticket to be Soccer', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiReserveBetSlip.sportID(this)
});

Then('I expect the tournament name to be the same as the reserved one', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiReserveBetSlip.tournamentName(this)
});

Then('I expect the Live tournament name to be the same as the reserved one', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiReserveBetSlip.liveTournamentName(this)
});

Then('I expect the Odds to be the same as the reserved one', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiReserveBetSlip.odds(this)
});

Then('I expect the Live Odds to be the same as the reserved one', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiReserveBetSlip.liveOdds(this)
});

Then('I expect the Max Win to be the same as the reserved one', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiReserveBetSlip.maxWin(this)
});

Then('I expect the Live Max Win to be the same as the reserved one', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiReserveBetSlip.liveMaxWin(this)
});

Then('I expect empty response body for invalid booking code', async function (this: ICustomWorld) {
  return await this.pageObj?.postApiReserveBetSlip.emptyResponse(this)
});




