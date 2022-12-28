import { ZohoApi } from './zoho';
import * as dotenv from 'dotenv';
import { Config, JsonDB } from 'node-json-db';
import { zohoConfig } from './lib/mdb/zoho-config.service';
import { mdb } from './lib/mdb/mdb';

dotenv.config();

const ZOHO_ENV = {
  accountOwnerName: process.env['ZOHO_ACCOUNT_OWNER'],
  appLinkName: process.env['ZOHO_APP_LINK_NAME'],
  clientId: process.env['ZOHO_CLIENT_ID'],
  clientSecret: process.env['ZOHO_CLIENT_SECRET'],
};

const bootstrap = async () => {
  if (
    !ZOHO_ENV.accountOwnerName ||
    !ZOHO_ENV.appLinkName ||
    !ZOHO_ENV.clientId ||
    !ZOHO_ENV.clientSecret
  )
    throw new Error('Credientials not found, please specify valid zoho ENV creds.');

  const api = new ZohoApi({
    accountOwnerName: ZOHO_ENV.accountOwnerName,
    appLinkName: ZOHO_ENV.appLinkName,
    clientId: ZOHO_ENV.clientId,
    clientSecret: ZOHO_ENV.clientSecret,
  });

  try {
    const response = await api.PerDiems.list();
    console.log(response);
  } catch (error) {
    console.log('Error', error);
  }
};

// bootstrap();

const test = async () => {
  const data = await zohoConfig.retrive('access_token_expiration');
  // const dataw = await zohoConfig.upsert('access_token', 'adwad');
  // await zohoConfig.upsert('refresh_token', 'adwad');

  console.log(data);
  return data;
};

test();

export { ZohoApi };
