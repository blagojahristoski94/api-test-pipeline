import WebSocket from 'ws';
import pako from 'pako';
import * as fs from 'fs';
import path from 'path';
import { urlFromEnv } from '../../support/utils/utilityFunctions';

const generateLiveMatchesCSV = async (): Promise<void> => {
  const filepath = path.resolve(__dirname, '../../../data/liveMatches.json');
  const TIMEOUT_MS = 5000;

  const getMatchIds = (matches: any[]) => matches.map((match) => match);

  const ws = new WebSocket(
    `${urlFromEnv('WS_URL')}signalr/liveHubCompressed`,
    {
      headers: {
        Origin: process.env.FE_URL,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
      },
    }
  );

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      ws.close();
      reject(
        new Error(
          'No availableLiveMatches target found in WebSocket messages.'
        )
      );
    }, TIMEOUT_MS);

    ws.on('open', () => {
      ws.send('{"protocol":"json","version":1}\x1e');

      ws.send(
        `{"arguments":[${process.env.WS_CODE},"en",false],"invocationId":"0","target":"Connect","type":1}\x1e`
      );
    });

    ws.on('message', (message: WebSocket.RawData) => {
      try {
        const messageString = Buffer.isBuffer(message)
          ? message.toString('utf-8')
          : String(message);

        const cleaned = messageString.replace(/\x1e/g, '');
        if (!cleaned.trim()) return;

        const parts = cleaned
          .split('}{')
          .map((part, index, arr) => {
            if (arr.length === 1) return part;
            if (index === 0) return `${part}}`;
            if (index === arr.length - 1) return `{${part}`;
            return `{${part}}`;
          });

        for (const part of parts) {
          if (!part.trim()) continue;

          const parsed = JSON.parse(part);

          if (parsed?.target === 'availableLiveMatches') {
            const base64Decoded = Buffer.from(
              parsed.arguments?.[0],
              'base64'
            );

            const decompressed = pako.ungzip(base64Decoded, {
              to: 'string',
            });

            const cleanedData = JSON.parse(
              decompressed.replace(/\0/g, '')
            );

            const matches = getMatchIds(cleanedData);

            if (matches.length > 0) {
              const limitedMatches = matches.slice(0, 20);

              fs.writeFileSync(
                filepath,
                JSON.stringify(limitedMatches, null, 2),
                'utf-8'
              );

              clearTimeout(timeout);
              resolve();
              ws.close();
              return;
            }
          }
        }
      } catch (error) {
        // ignore keepalive / partial messages
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    ws.on('close', () => {
      clearTimeout(timeout);
    });
  });
};

export default generateLiveMatchesCSV;