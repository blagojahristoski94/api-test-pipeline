import { ICustomWorld } from '../../world';
import * as dotenv from 'dotenv';
import { apiContextFor } from '../../support/utils/apiClient';
import { readDataFromFile, urlFromEnv, writeDataToFile } from '../../support/utils/utilityFunctions';
import * as fs from 'fs';

dotenv.config();
interface UserIDs {
  [key: string]: string | undefined;
}

export default class postApiPAM {

  async login(iCustomWorld: ICustomWorld) {
    const apiUrl = `${urlFromEnv('PAM_URL')}Services/GamingPortalService.svc/CustomerLoginAccountV2`;
    const apiContext = await apiContextFor(iCustomWorld);

    const username = process.env.USER as string;
    const password = process.env.PASSWORD as string;
    const apiKey = process.env.PAM_API_KEY as string;

    const requestData =
    {
      "login": username,
      "password": password,
      "ipAddress": "46.217.172.59",
      "returnBalance": true,
      "returnCustomerDetails": true,
      "deviceType": "Default",
      "cloudfrontCountry": "MK",
      "apiKey": apiKey,
    }

    const responseBody = await apiContext.post(apiUrl, {
      data: requestData,
    });

    const response = await responseBody.json();
    if (response?.Customer?.Token && response?.Customer?.Account.ExternalID && response?.Customer?.Account.CurrencyISO) {
      const tokenID = response.Customer.Token;
      const externalID = response.Customer.Account.ExternalID;
      const currencyISO = response.Customer.Account.CurrencyISO;
      const filePath = './data/token.json';

      let existingData: UserIDs = {};

      // Read existing data if the file exists
      if (fs.existsSync(filePath)) {
        try {
          existingData = readDataFromFile(filePath) as UserIDs;
        } catch (error) {
          console.error('Error reading JSON file:', error);
        }
      }

      existingData['token'] = tokenID;
      existingData['externalUserId'] = externalID;
      existingData['currency'] = currencyISO;
      writeDataToFile(filePath, existingData);
    } else {
      console.error('Token or ExternalID not found in the response.');
    }

    iCustomWorld.responseBody = await responseBody;
    iCustomWorld.response = await response;
  }
}