import { After, Before, ITestCaseHookParameter, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { ICustomWorld } from '../../world';
import { PomProvider } from '../../pages/pomProvider';
import config from '../setup/config';
import { closeNotificationHub } from '../../pages/FEWBetslip/notificationHub';
import { disposeApiContext, getApiContext } from '../utils/apiClient';

setDefaultTimeout(process.env.PWDEBUG ? -1 : config.defaultTimeout);

Before(async function (this: ICustomWorld) {
  this.pageObj = new PomProvider();
  // One context per scenario; disposal resets the shared factory for the next scenario.
  this.request = await getApiContext();
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  await disposeApiContext();
  await closeNotificationHub(this);
  // Handle Skipped test
  if (this.skippedTests) {
    if (result) {
      result.status = Status.SKIPPED; // Set the scenario status to 'skipped'
      await this.attach('Skipped: Due to unavailable data', 'text/plain');
      return;
    }
  }

  if (result) {
    await this.attach(`Status: ${result?.status}. Duration: ${result?.duration.seconds}s`);
  }
}
)
