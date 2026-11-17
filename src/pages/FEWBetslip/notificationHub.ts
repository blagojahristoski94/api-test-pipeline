import { ICustomWorld } from './../../world';
import WebSocket from 'ws';
import {
  externalUserID,
  token,
  urlFromEnv,
} from '../../support/utils/utilityFunctions';

export const openNotificationHub = async (
  iCustomWorld: ICustomWorld
): Promise<void> => {

  if (iCustomWorld.ws) {
    await closeNotificationHub(iCustomWorld);
  }

  iCustomWorld.notification = undefined;

  iCustomWorld.connectionIdPromise = new Promise<void>((resolve, reject) => {
    iCustomWorld.resolveConnectionId = resolve;
    iCustomWorld.rejectConnectionId = reject;
  });

  const socket = new WebSocket(
    `${urlFromEnv('WS_URL')}signalr/notificationHub`,
    {
      headers: {
        token: token(),
        externalUserID: externalUserID(),
        Origin: process.env.FE_URL,
      }
    }
  );

  iCustomWorld.ws = socket;

  socket.on('open', () => {
    socket.send('{"protocol":"json","version":1}\x1e');
    socket.send(
      `{"arguments":["${externalUserID()}",0,${process.env.WS_CODE},1,0],"target":"connect","invocationId":"0","type":1}\x1e`
    );
  });
  socket.on('message', (message: WebSocket.RawData) => {
    try {
      const messageString = String(message);

      if (messageString.includes('"target":"betSlipPlacement"')) {
        const parsed = JSON.parse(messageString.replace(/\x1e/g, ''));
        const notification = parsed.arguments?.[0];
        const messages = notification?.ResponseMessage;
        iCustomWorld.notification = {
          ...notification,
          ResponseMessage: [
            ...(iCustomWorld.notification?.ResponseMessage ?? []),
            ...(Array.isArray(messages)
              ? messages
              : typeof messages === 'string' ? [messages] : []),
          ],
        };
        iCustomWorld.response = notification;
        // Wake up anyone waiting for a notification
        iCustomWorld.notificationHandler?.();
        iCustomWorld.resolveConnectionId?.();
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('error', (err) => {
    iCustomWorld.rejectConnectionId?.(err);
  });

  await new Promise<void>((resolve, reject) => {
    socket.once('open', resolve);
    socket.once('error', reject);
  });
};

export const closeNotificationHub = async (
  iCustomWorld: ICustomWorld
): Promise<void> => {
  const socket = iCustomWorld.ws;
  if (!socket) {
    return;
  }

  try {
    if (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CLOSING
    ) {
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          socket.terminate();
          resolve();
        }, 10000);

        socket.once('close', () => {
          clearTimeout(timeout);
          resolve();
        });
        socket.close();
      });
    } else {
      socket.terminate();
    }

  } finally {
    socket.removeAllListeners();
    iCustomWorld.ws = undefined;
  }
};

export const waitForNotification = async (
  iCustomWorld: ICustomWorld,
  expectedMessage: string,
  timeout = 10000
): Promise<void> => {

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      iCustomWorld.notificationHandler = undefined;
      reject(
        new Error(
          `Timed out waiting for notification containing "${expectedMessage}". ` +
          `Received messages: ${JSON.stringify(iCustomWorld.notification?.ResponseMessage ?? [])}`
        )
      );
    }, timeout);

    iCustomWorld.notificationHandler = () => {
      if (
        iCustomWorld.notification?.ResponseMessage?.some(message =>
          message.includes(expectedMessage)
        )
      ) {
        clearTimeout(timer);
        iCustomWorld.notificationHandler = undefined;
        resolve();
      }
    };

    iCustomWorld.notificationHandler();
  });
};