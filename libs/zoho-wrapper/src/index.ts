import { ZohoApi } from './zoho';
import * as dotenv from 'dotenv';

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

  const response = await api.PerDiems.list();
};

bootstrap();

export { ZohoApi };
