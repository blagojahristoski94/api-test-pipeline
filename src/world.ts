import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { PomProvider } from './pages/pomProvider';
import WebSocket from 'ws';

export interface ICustomWorld extends World {
  request?: APIRequestContext;
  pageObj?: PomProvider;
  /** Parsed response payload (JSON object/array, or raw text when the body is not JSON). */
  response?: unknown;
  /** Raw Playwright APIResponse, used for status/header assertions. */
  responseBody?: APIResponse;
  /** Raw (unparsed) response text, kept only when the body is not JSON. */
  responseText?: string;
  skippedTests?: boolean;
  stake?: number;
  odds?: number[];
  betIdentifier?: string;
  homeTeam?: string;
  awayTeam?: string;
  matchID?: string;
  liveMarkets?: number[];
  prematchMarkets?: number[];
  usedIndexes?: number[];
  algoSelection?: object[];
  ws?: WebSocket;
  connectionIdPromise?: Promise<void>;
  resolveConnectionId?: () => void;
  rejectConnectionId?: (error: Error) => void;
  notificationHandler?: () => void;
  historyFromDate?: string;
  historyToDate?: string;
  notification?: NotificationResponse;

}

export interface NotificationResponse {
  ResponseMessage: string[];
  BetSlipGroupID: number; 
  [key: string]: unknown;
}

/**
 * `ICustomWorld.response` holds a parsed body of unknown shape, so `'key' in this.response`
 * is not allowed on it. Narrow with `isBodyKey(this.response, 'key')` instead: the built-in `in`
 * narrowing cannot be reused once the check is behind a call, so this type predicate takes over
 * and leaves `this.response` narrowed to a record that is known to have the key.
 */
export function isBodyKey<K extends string>(body: unknown, key: K): body is Record<K, unknown> {
  return typeof body === 'object' && body !== null && key in body;
}

export enum ticketsIds {
  singlePrematch = 'singlePrematchId',
  combiPrematch = 'combiPrematchId',
  system = 'systemPrematchId',
  singleLive = 'singleLiveId',
  combiLive = 'combiLiveId',
  algoSingle = 'algoSingleId'
}

export enum BookingCodes {
  prematch = 'prematchBookingCode',
  live = 'liveBookingCode'
}

export enum sports {
  Football = '14',
  Soccer = '1',
  Tennis = '5',
  AmericanFootball = '14',
}

export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);