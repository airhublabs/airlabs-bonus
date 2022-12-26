import axios, { AxiosResponse } from 'axios';
import { ZohoRequest } from '../zoho-request';
import { GenerateAuthTokenResponse } from './zoho-oauth.types';

/* TODO: Temp create lib */
const ENV_VALUES = {
  zohoClientId: process.env['ZOHO_CLIENT_ID'] || 'Unset',
  zohoClientSecret: process.env['ZOHO_CLIENT_SECRET'] || 'Unset',
};

export class OAuth {
  private accessToken!: string | undefined;

  constructor(private readonly request: ZohoRequest) {}

  async generateAuthToken() {
    const urlParams = new URLSearchParams();
    urlParams.set('grant_type', 'authorization_code');
    urlParams.set('client_id', ENV_VALUES.zohoClientId);
    urlParams.set('client_secret', ENV_VALUES.zohoClientSecret);
    urlParams.set('redirect_uri', 'https://newage.dev/zoho/redirect');
    urlParams.set('code', '1000.022bc26578a1eeb49dadfdd00d27599c.06a46e24d9854854f8432ff00e4812eb');

    const authURL = `${this.request.params.accountsHost}/oauth/v2/token?${urlParams.toString()}`;
    const response = await axios.post<unknown, AxiosResponse<GenerateAuthTokenResponse>>(authURL);

    return response;
  }

  async refreshAccessToken() {
    const urlParams = new URLSearchParams();
    urlParams.set('client_id', ENV_VALUES.zohoClientId);
    urlParams.set('client_secret', ENV_VALUES.zohoClientSecret);
    urlParams.set(
      'refresh_token',
      '1000.1fd2ece777b767c93370390f4eac47cf.ba4015c5c57400b3419b9f0dd6d2c70b'
    );
    urlParams.set('grant_type', 'arefresh_token');

    const authURL = `${this.request.params.apiHost}/oauth/v2/token?${urlParams.toString()}`;
    const response = await axios.post<unknown, AxiosResponse<GenerateAuthTokenResponse>>(authURL);

    return response;
  }
}
