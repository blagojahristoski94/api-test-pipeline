import { createDynamicObject } from '../utils/utilityFunctions';
import { MatchType, Selection } from '../offerSelection/selections';

export type PlacementType = 'single' | 'combi' | 'system';

export interface BetItem {
  SpecialBetValue: string;
  oid: any;
  it: number;
  mid: any;
  oo: any;
  b: boolean;
  sid: number;
  tid: any;
  cid: any;
  potid: number;
  otid: number;
  id: number;
}

// The Place endpoint takes BetItem plus these three fields (as sent by the web front end).
export type PlaceBetItem = BetItem & { cmid: number; otoid: number; cogid: null };

// Used by the negative scenarios to send a wrong match id or changed odds on purpose.
export type BetItemOverrides = { matchId?: number; oddsOffset?: number };

export function buildBetItems(selections: Selection[], matchType: MatchType, overrides: BetItemOverrides = {}): PlaceBetItem[] {
  return selections.map((selection) => {
    const matchId = overrides.matchId ?? selection.mid;
    const odds = overrides.oddsOffset !== undefined
      ? parseFloat((Number(selection.odds) + overrides.oddsOffset).toFixed(2))
      : selection.odds;
    return {
      SpecialBetValue: '',
      oid: selection.oid,
      it: matchType === 'live' ? 2 : 1, // item type: 1 = pre-match, 2 = live
      mid: matchId,
      oo: odds,
      b: false,
      sid: selection.sid,
      tid: selection.tid,
      cid: selection.cid,
      potid: 0,
      cmid: matchId,
      otoid: 0,
      cogid: null,
      otid: 3,
      id: 0,
    };
  });
}

// The request fields that differ per bet-slip type (bstid: 2 = single, 1 = combi, 3 = system).
function betSlipTypeFields(type: PlacementType, stake: string, betItems: PlaceBetItem[]) {
  const count = betItems.length;
  switch (type) {
    case 'single': {
      const odds = betItems[0].oo;
      // Root `am` stays 1 for singles (the booked stake comes from bs[0].am): the server checks root `am` against the
      // wallet balance before validating stake limits
      return { bstid: 2, bs: [{ am: stake, i: betItems, comb: 1, to: odds }], mao: odds, mio: odds, am: 1, aoce: 4, bc: null };
    }
    case 'combi':
      return { bstid: 1, bs: [], f: { [count]: stake }, mao: '0', mio: '0', am: stake };
    case 'system':
      return { bstid: 3, bs: [], f: createDynamicObject(count, stake), mao: '0', mio: '0', am: parseFloat(stake) * (2 ** count - 1) };
  }
}

export function buildPlaceRequest(
  type: PlacementType,
  stake: string,
  betItems: PlaceBetItem[],
  options: { acceptOddsChanges?: boolean } = {},
) {
  return {
    absi: betItems,
    ...betSlipTypeFields(type, stake, betItems),
    fbid: null,
    ti: betItems.length,
    aoc: options.acceptOddsChanges ?? true,
    tb: 0,
    sci: 0,
    scid: 0,
    p: 0,
    bm: 0,
    ios: false,
    miw: 0,
    maw: 0,
    id: 'APITesting',
    dguid: '',
    uid: null,
    refu: false,
    tfa: false,
    bbid: 0,
    bb: [],
  };
}
