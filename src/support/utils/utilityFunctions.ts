import * as fs from 'fs';
import * as dotenv from 'dotenv';
import path from 'path';
const crypto = require('crypto');

dotenv.config();

export function approximatelyEqual(value1: number, value2: number, tolerance: number): boolean {
  return Math.abs(value1 - value2) <= tolerance;
}

export function writeDataToFile(filePath: string, data: any): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function readDataFromFile(filePath: string): any {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}


export function baseUrl() {
  const apiUrl = process.env.API_BASE_URL as string;
  const baseUrl = `${apiUrl}rest`;
  return baseUrl;
}

export function token() {
  const filePath = path.join(__dirname, '../../../data/token.json');
  const tokenFromJson = readDataFromFile(filePath);
  const tokenEnv = process.env.TOKEN as string;
  const token = tokenEnv ? tokenEnv : tokenFromJson;
  return token;
}

export function externalUserID() {
  const filePath = path.join(__dirname, '../../../data/token.json');
  const userIDFromJson = readDataFromFile(filePath);
  const userIDEnv = process.env.EXTERNAL_USER_ID as string;
  const userID = userIDEnv ? userIDEnv : userIDFromJson;
  return userID;
}

export function apiKey() {
  const apiKey = process.env.API_KEY as string
  return apiKey;
}

export function getRandomIndex(max: number): number {
  return Math.floor(Math.random() * max);
}

export function generateCombinations(arr: string[], index: number = 0, currentCombination: number[] = []): number[] {
  const result: number[] = [];
  const numericArr = arr.map(Number);
  // Recursive call to calculate combinations with subsequent elements
  for (let i = index; i < numericArr.length; i++) {
    const nextCombination = [...currentCombination, numericArr[i]];
    const product = nextCombination.reduce((acc, value) => acc * value, 1);
    const roundedProduct = parseFloat(product.toFixed(2));
    result.push(roundedProduct);
    result.push(...generateCombinations(arr, i + 1, nextCombination));
  }

  return result;
}
export function multiplyNumbersInArray(arr: (string | number)[]): number {
  return arr
    .map((value) => (typeof value === 'string' ? parseFloat(value) : value))
    .filter((value) => typeof value === 'number' && !isNaN(value))
    .reduce((acc, currentValue) => acc * currentValue, 1);
}

// Total odds = the product of all odds, using up to 6 decimals each, then cut (not rounded) to 2 decimals.
// Odds are multiplied as whole numbers (BigInt) so JavaScript decimal errors can't change the result.
export function totalOddsAsServer(arr: (string | number)[]): number {
  const oddsAsWhole = arr.map((value) => BigInt(Math.round(Number(value) * 1e6)));
  const product = oddsAsWhole.reduce((acc, value) => acc * value, 1n);
  const totalInCents = product / 10n ** BigInt(6 * oddsAsWhole.length - 2);
  return Number(totalInCents) / 100;
}

// Winnings (total odds x stake) are kept to 2 decimal places, with extra digits dropped and never rounded up, the same as the server.
export function winningsAsServer(totalOdds: number, stake: number): number {
  return Math.floor((Math.round(totalOdds * 100) * Math.round(stake * 100)) / 100) / 100;
}

// The bonus is a percentage of the profit (payout minus stake), where payout = stake x total odds and is NOT cut to 2 decimals.
// It is rounded to 2 decimal places with .5 always rounding up, and limited to MaxBonus, the same as the server.
export function bonusAsServer(totalOdds: number, stake: number, percentage: number, maxBonus: number): number {
  const stakeInCents = Math.round(stake * 100);
  const profit = BigInt(Math.round(totalOdds * 100) * stakeInCents - stakeInCents * 100);
  const percentageScaled = BigInt(Math.round(percentage * 10000)); // the percentage as a whole number, up to 4 decimals
  const divisor = 100000000n; // brings profit * percentageScaled back to cents
  const bonusInCents = (2n * profit * percentageScaled + divisor) / (2n * divisor); // half rounds up
  return Math.min(Number(bonusInCents) / 100, maxBonus);
}

export function createDynamicObject(items: number, stake: string): { [key: number]: string } {
  const f: { [key: number]: string } = {};
  for (let i = 1; i <= items; i++) {
    f[i] = stake;
  }
  return f;
}

export function generateOdds(items: number): number[] {
  const odds: number[] = [];
  let current = 1;

  while (odds.length < items) {
    if (current !== 4) {
      odds.push(current);
    }
    current++;
  }

  return odds;
}

export function generateRandomString(length: number): string {
  const bytes = Math.ceil(length / 2)
  const result = crypto.randomBytes(bytes).toString('hex')
  return result
}