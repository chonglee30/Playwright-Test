import { test, expect } from '@playwright/test';

// Due to rate limiting, need to skip some tests
// Current limit: 2 requests per second with burst of 10.
// all tests should pass if run individually
test.describe('WebSocket Test', () => {
  test.skip('Real WebSocket Test', async ({ page }) => {
    await page.goto('https://echo.websocket.org/.ws')

    page.on('websocket', async ws => {
      const frame = await ws.waitForEvent('framereceived')
      console.log('WebSocket Frame Received: ', frame.payload)
    });

    await page.getByRole('button', { name: 'Pause Messaging' }).click();
    await page.locator('#content').fill('Seahawks Win')

    await page.getByRole('button', { name: 'Send Message' }).click();
    await expect(page.locator('#console div')).toHaveText([
      'attempting to connect',
      'connected',
      /Request served by/,
      'paused messages',
      'Seahawks Win',
      'Seahawks Win'
    ])
  })

  test.skip('Real WebSocket Test2', async ({ page }) => {
    const webSocketPromise = page.waitForEvent('websocket')
    page.goto('https://echo.websocket.org/.ws')

    const webSocket = await webSocketPromise;

    const frameReceivedPromise = webSocket.waitForEvent('framereceived')
    const frame = await frameReceivedPromise;
    console.log('WebSocket Msg Received: ', frame.payload)

    await page.getByRole('button', { name: 'Pause Messaging' }).click();
    await page.locator('#content').fill('Seahawks Win!')

    const frameSentPromise = webSocket.waitForEvent('framesent');
    await page.getByRole('button', { name: 'Send Message' }).click();
    const frameSent = await frameSentPromise;
    console.log('WebSocket Sent Msg:', frameSent.payload.toString());
  })

  test('Real WebSocket Test3', async ({ page }) => {
    const webSocketPromise = page.waitForEvent('websocket')
    page.goto('https://echo.websocket.org/.ws')

    const webSocket = await webSocketPromise;

    const frameReceivedPromise = webSocket.waitForEvent('framereceived')
    const frame = await frameReceivedPromise;
    console.log('WebSocket Msg Received: ', frame.payload)

    await page.getByRole('button', { name: 'Pause Messaging' }).click();
    await page.locator('#content').fill('Seahawks Beat 49ers!')

    const [frameSent] = await Promise.all([
      webSocket.waitForEvent('framesent'),
      page.getByRole('button', { name: 'Send Message' }).click(),
    ]);
    console.log('Confirmed Sent:', frameSent.payload.toString());

    const frameRedeived = await webSocket.waitForEvent('framereceived');
    console.log('Confirmed Received:', frameRedeived.payload.toString());

    const outputMsg = await page.locator('#console div').allInnerTexts();
    expect(outputMsg).toContain('Seahawks Beat 49ers!');
  })

  test.skip('Monitor ALl WebSockets Test', async ({ page }) => {
    page.on('websocket', ws => {
      console.log(`WebSocket opened at this URL: ${ws.url()}`);
      ws.on('framereceived', frame => console.log('Received:', frame.payload))
      ws.on('close', () => console.log('WebSocket closed'));
    });

    await page.goto('https://echo.websocket.org/.ws')
    const webSocket = await page.waitForEvent('websocket')
    await webSocket.waitForEvent('framereceived')
    await page.close();
  })

  // This is not chat app, so both users cannot see info
  test.skip('User Test Using Browser', async ({ browser }) => {
    const [user1, user2] = await Promise.all([
      browser.newPage(),
      browser.newPage()
    ]);

    await user1.goto('https://echo.websocket.org/.ws')
    await user2.goto('https://echo.websocket.org/.ws')

    await user1.getByRole('button', { name: 'Pause Messaging' }).click();
    await user1.locator('#content').fill('Seahawks beat Rams!')
    await user1.getByRole('button', { name: 'Send Message' }).click();
  })

  test.skip('WebSocket message testing', async ({ page }) => {
    await page.goto('https://echo.websocket.org/.ws')

    const [webSocket] = await Promise.all([
      page.waitForEvent('websocket'),
      page.evaluate(() => {
        const ws = new WebSocket('wss://echo.websocket.org')
      })
    ]);

    console.log(`WebSocket connected to ${webSocket.url()}`)
    
    const frame: any =  await (webSocket as any).waitForEvent('framereceived', (frame: any) => {
      return frame.payload.toString().includes('Request served by');
    });

    console.log(frame)
  })

  // Not Actually calling the WebSocket
  test('Mocked WebSocket Test', async ({ page }) => {
    await page.routeWebSocket(/echo.websocket.org/, ws => {
      ws.send('#1 Seed Game');
      ws.onMessage(msg => {
        if (msg === 'Beat 49ers!') {
          ws.send('Yes!')
          ws.send('Sack Purdy!')
          ws.send('Fumble Christian Mccaffrey!')
        }
      })
    });

    await page.goto('https://echo.websocket.org/.ws')
    await page.getByRole('button', { name: 'Pause Messaging' }).click();
    await page.locator('#content').fill('Beat 49ers!')

    await page.getByRole('button', { name: 'Send Message' }).click();
    await expect(page.locator('#console div')).toHaveText([
      'attempting to connect',
      'connected',
      '#1 Seed Game',
      'paused messages',
      'Beat 49ers!',
      'Yes!',
      'Sack Purdy!',
      'Fumble Christian Mccaffrey!'
    ])
  })

  test('Intercepted WebSocket Test', async ({ page }) => {
    await page.routeWebSocket(/echo.websocket.org/, ws => {
      const server = ws.connectToServer();

      server.onMessage(msg => {
        if (msg === 'Seahawks Victory')
          ws.send('K9, Charbonnet, & JSN Touchdown');
        else
          ws.send(msg)
      })
    })

    await page.goto('https://echo.websocket.org/.ws')
    await page.getByRole('button', { name: 'Pause Messaging' }).click();
    await page.locator('#content').fill('Seahawks Victory')
    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page.locator('#console div')).toHaveText([
      'attempting to connect',
      'connected',
      /Request served by/,
      'paused messages',
      'Seahawks Victory',
      'K9, Charbonnet, & JSN Touchdown'
    ])
  })
});