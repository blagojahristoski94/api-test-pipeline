import path from 'path';
import { getRandomIndex, readDataFromFile } from '../utils/utilityFunctions';

export type MatchType = 'prematch' | 'live'; 

export type Selection = { mid: number; sid: number; tid: number; cid: number; oid: number; odds: string };

// Picks distinct events, each with a random non suspended outcome from its first market.
export function pickSelections(matchType: MatchType, count: number): Selection[] {
  const isLive = matchType === 'live';
  const fileName = isLive ? 'liveMatches.json' : 'highlights.json';
  const data = readDataFromFile(path.join(__dirname, '../../../data', fileName)); // src/support/betslip -> project root
  // liveMatches.json is a plain array of matches, highlights.json wraps them in `m`
  const events: any[] = isLive ? data : data?.m;
  if (!Array.isArray(events) || events.length === 0) {
    throw new Error(`${fileName} holds no matches - the ${isLive ? 'live matches' : 'Highlights'} step returned an empty list`);
  }

  const maxAttempts = 20;
  const usedEvents = new Set<number>();
  const selections: Selection[] = [];

  while (selections.length < count) {
    let selection: Selection | undefined;

    for (let attempt = 0; attempt < maxAttempts && !selection; attempt++) {
      const index = getRandomIndex(events.length);
      if (usedEvents.has(index)) continue;

      const event = events[index];
      // markets sit under `odds` for live matches and under `o` for highlights
      const outcomes = (isLive ? event?.odds : event?.o)?.[0]?.m;
      if (!Array.isArray(outcomes) || outcomes.length === 0) continue;

      const outcome = outcomes[getRandomIndex(outcomes.length)];
      if (outcome?.su !== false) continue;

      usedEvents.add(index);
      selection = { mid: event.mid, sid: event.sid, tid: event.tid, cid: event.cid, oid: outcome.id, odds: outcome.o };
    }

    if (!selection) {
      throw new Error(`No bettable ${matchType} selection found in ${fileName} for item ${selections.length + 1} after ${maxAttempts} attempts`);
    }
    selections.push(selection);
  }

  return selections;
}
