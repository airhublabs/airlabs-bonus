import axios, { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';

import { ZohoRequest } from '../requests';
import { ZohoAuthToken, ZohoAuthTokenResponse } from './zoho-oauth.types';
import { zohoConfig } from '../mdb/zoho-config.service';

export interface OAuthParams {
  version?: 'v2';
  apiHost?: string;
  accountsHost?: string;
  accountOwnerName: string;
  appLinkName: string;
}

export interface GenerateTokenParams {
  redirectUri: string;
  code: string;
}

export interface GenerateAccessTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  api_domain: string;
  token_type: string;
}

export interface RefreshTokenParams {
  refreshToken: string;
}

export class OAuth {
  private refreshToken: string | undefined;
  private accessToken: string | undefined;
  private accessTokenExpiration: string | undefined;

  constructor(private readonly request: ZohoRequest) {}

  async generateAccessToken(params: GenerateTokenParams) {
    const urlParams = new URLSearchParams();
    urlParams.set('grant_type', 'authorization_code');
    urlParams.set('client_id', this.request.params.clientId);
    urlParams.set('client_secret', this.request.params.clientSecret);
    urlParams.set('redirect_uri', params.redirectUri);
    urlParams.set('code', params.code);

    const authURL = `${this.request.params.accountsHost}/oauth/v2/token?${urlParams.toString()}`;

    return axios.post<GenerateAccessTokenResponse>(authURL);
  }

  async getRefreshToken(params: RefreshTokenParams) {
    const urlParams = new URLSearchParams();
    urlParams.set('refresh_token', params.refreshToken);
    urlParams.set('client_id', this.request.params.clientId);
    urlParams.set('client_secret', this.request.params.clientSecret);

    const authURL = `${this.request.params.accountsHost}?${urlParams.toString()}`;

    return axios.post<GenerateAccessTokenResponse>(authURL);
  }

  /*
Zoho Request Wrapper

Scopes:
- ZohoCreator.report.READ,ZohoCreator.report.create,ZohoCreator.report.UPDATE,ZohoCreator.form.ALL,ZohoCreator.form.CREATE,ZohoCreator.form.READ
*/
  async getAccessToken() {
    const configAccessToken = await zohoConfig.retrive('access_token');


    if (!this.accessToken) {
      console.log('Generating access token');

      if (configAccessToken) return configAccessToken;

      const auth = await this.generateAccessToken({
        code: '1000.bc8905411476aa3dba5fc8553f56c87d.37710cf70fb0e2efb01e5fdbe485bb8a',
        redirectUri: 'https://newage.dev',
      });

      zohoConfig.upsert('access_token', auth.data.access_token);
      zohoConfig.upsert(
        'access_token_expiration',
        DateTime.now().plus({ second: auth.data.expires_in }).toISO()
      );
      zohoConfig.upsert('refresh_token', auth.data.refresh_token);

      this.accessToken = auth.data.access_token;
      this.refreshToken = auth.data.refresh_token;
      this.accessTokenExpiration = DateTime.now().plus({ second: auth.data.expires_in }).toISO();

      return auth.data.access_token;
    }
    /*
    const refreshTokenExpiration = DateTime.fromISO(
      this.accessTokenExpiration || (await zohoConfig.retrive('access_token_expiration'))
    );

    if (refreshTokenExpiration.diffNow('milliseconds').milliseconds < 0) {
      const refreshToken = this.refreshToken || (await zohoConfig.retrive('refresh_token'));
      const response = await this.getRefreshToken({ refreshToken: refreshToken });

      zohoConfig.upsert('access_token', response.data.access_token);
      zohoConfig.upsert(
        'access_token_expiration',
        DateTime.now().plus({ second: response.data.expires_in }).toISO()
      );
      zohoConfig.upsert('refresh_token', response.data.refresh_token);

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.accessTokenExpiration = DateTime.now()
        .plus({ second: response.data.expires_in })
        .toISO();

      console.log('Token refreshed');

      return response.data.access_token;
    }
 */
    return this.accessToken;
  }
}
