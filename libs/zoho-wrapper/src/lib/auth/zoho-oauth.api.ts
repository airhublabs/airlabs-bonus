import axios, { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';

import { ZohoRequest } from '../requests';
import { ZohoAuthToken, ZohoAuthTokenResponse } from './zoho-oauth.types';

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

export interface RefreshTokenParams {
  refreshToken: string;
}

export class OAuth {
  private refreshToken: string | undefined;
  private accessToken: string | undefined;
  private accessTokenExpiration: string | undefined;

  constructor(private readonly request: ZohoRequest) {}

  async generateAuthToken(params: GenerateTokenParams) {
    const urlParams = new URLSearchParams();
    urlParams.set('grant_type', 'authorization_code');
    urlParams.set('client_id', this.request.params.clientId);
    urlParams.set('client_secret', this.request.params.clientId);
    urlParams.set('redirect_uri', params.redirectUri);
    urlParams.set('code', params.code);

    const authURL = `${this.request.params.accountsHost}/oauth/v2/token?${urlParams.toString()}`;

    return await this.requestToken(authURL);
  }

  async getRefreshToken(params: RefreshTokenParams) {
    const urlParams = new URLSearchParams();
    urlParams.set('refresh_token', params.refreshToken);
    urlParams.set('client_id', this.request.params.clientId);
    urlParams.set('client_secret', this.request.params.clientSecret);

    const authURL = `${this.request.params.accountsHost}?${urlParams.toString()}`;

    return await this.requestToken(authURL);
  }

  async requestToken(authURL: string) {
    const response = await axios.post<unknown, AxiosResponse<ZohoAuthTokenResponse>>(authURL);
    const token: ZohoAuthToken = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      apiDomain: response.data.api_domain,
      tokenType: response.data.token_type,
    };

    // convert seconds to unix timestamp
    token.expiresIn = DateTime.local().plus({ seconds: token.expiresIn }).toSeconds();

    return token;
  }

  // async getAuth() {
  //   if (!this.accessToken) {
  //     await this.generateAuthToken({ code: '', redirectUri: '' });
  //     return this.accessToken;
  //   }

  //   if (this.accessToken.expiresIn < DateTime.local().toSeconds()) {
  //     await this.refreshAuth();
  //     return this.accessToken;
  //   }

  //   return this.accessToken;
  // }

  async getAccessToken() {
    if (!this.accessToken) {
      const auth = await this.generateAuthToken({
        code: '1000.64cf0fe02e385970bf3605b48ef5e9eb.d37859c38c7dbceb45a71a46bad9e15b',
        redirectUri: 'https://newage.dev',
      });

      this.accessToken = auth.accessToken;
    }

    // if (this. < DateTime.local().toSeconds()) {
    //   await this.refreshAuth();
    //   return this.accessToken;
    // }

    if (this.refreshToken) {
      const token = this.getRefreshToken({ refreshToken: this.refreshToken });
    }

    // this.refreshToken({});
    return this.accessToken;
  }
}
