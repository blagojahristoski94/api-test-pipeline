import WebSocket from 'ws';
import * as fs from 'fs';
import path from 'path';
import {
  externalUserID,
  token,
} from '../../support/utils/utilityFunctions';

const generateCashout = async (): Promise<void> => {
  const filepath = path.resolve(__dirname, '../../../data/cashout.json');
  const TIMEOUT_MS = 1000;

  const ws = new WebSocket(`${process.env.WS_URL}signalr/cashoutHub`, {
    headers: {
      token: token(),
      externalUserID: externalUserID(),
      Origin: 'https://qa.btobet.net',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
    },
  });

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error('No my bets target found in WebSocket messages.'));
    }, TIMEOUT_MS);

    ws.on('open', () => {
      ws.send('{"protocol":"json","version":1}\x1e');

      ws.send(
        `{"arguments":[0,"${externalUserID()}",${process.env.WS_CODE},1,false],"invocationId":"0","target":"connectMyBets","type":1}\x1e`
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
          .split('\n')
          .flatMap((chunk) => chunk.split('}{').map((p, i, arr) => {
            if (arr.length === 1) return p;
            if (i === 0) return `${p}}`;
            if (i === arr.length - 1) return `{${p}`;
            return `{${p}}`;
          }));

        for (const part of parts) {
          if (!part.trim()) continue;

          const parsed = JSON.parse(part);

          if (parsed?.target === 'myBets') {
            const matches = parsed.arguments?.[0] ?? [];

            fs.writeFileSync(
              filepath,
              JSON.stringify(matches, null, 2),
              'utf-8'
            );

            clearTimeout(timeout);
            resolve();
            ws.close();
            return;
          }
        }
      } catch (error) {
        // ignore non-json keepalive / partial frames
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

export default generateCashout;