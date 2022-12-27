import axios, { AxiosResponse } from 'axios';
import { DateTime } from "luxon";

import {
  ZohoAuthCodeResponse,
  ZohoAuthCode,
  ZohoAuthTokenResponse,
  ZohoAuthToken,
} from './zoho-oauth.types';

const BASE_URL = "https://accounts.zoho.com";

export interface IOAuth {
  generateAuth(): Promise<void>;
}

export interface OAuthParams {
  version?: 'v2';
  apiHost?: string;
  accountsHost?: string;
  accountOwnerName: string;
  appLinkName: string;
}

export class OAuthRequestParams {
  clientId = process.env['ZOHO_CLIENT_ID'] || 'unset';
  clientSecret = process.env['ZOHO_CLIENT_SECRET'] || 'unset';
  redirectUri = process.env['ZOHO_REDIRECT_URI'] || 'unset';
  accountOwnerName = process.env['ZOHO_ACCOUNT_OWNER_NAME'] || 'unset';
  appName = process.env['ZOHO_APP_NAME'] || 'unset';

  constructor(params: OAuthParams) {
    this.accountOwnerName = params.accountOwnerName ?? this.accountOwnerName;
    this.appName = params.appLinkName ?? this.appName;
  }
}

export class OAuthCodeRequest {
  baseURL = `${BASE_URL}}/oauth/v2/auth`;

  async generateAuthCode(params: OAuthRequestParams) {
    const urlParams = new URLSearchParams();

    urlParams.set('client_id', params.clientId);
    urlParams.set('response_type', 'code');
    urlParams.set('access_type', 'offline');
    urlParams.set('redirect_uri', params.redirectUri);

    urlParams.set('scope', 'ZohoCreator.fullaccess.all');

    const authURL = `${this.baseURL}?${urlParams.toString()}`;
    const response = await axios.get<unknown, AxiosResponse<ZohoAuthCodeResponse>>(authURL);

    return {
      code: response.data.code,
      location: response.data.location,
      accountsServer: response.data['accounts-server'],
    };
  }
}

export class OAuthTokenRequest {
  baseURL = `${BASE_URL}}/oauth/v2/token`;

  async generateAuthToken(accessCode: ZohoAuthCode, params: OAuthRequestParams) {
    const urlParams = new URLSearchParams();
    urlParams.set('grant_type', 'authorization_code');
    urlParams.set('client_id', params.clientId);
    urlParams.set('client_secret', params.clientSecret);
    urlParams.set('redirect_uri', params.redirectUri);
    urlParams.set('code', accessCode.code);

    const authURL = `${this.baseURL}?${urlParams.toString()}`;

    return await this.requestToken(authURL);
  }

  async refreshToken(refreshToken: string, params: OAuthRequestParams) {
    const urlParams = new URLSearchParams();
    urlParams.set('refresh_token', refreshToken);
    urlParams.set('client_id', params.clientId);
    urlParams.set('client_secret', params.clientSecret);

    const authURL = `${this.baseURL}?${urlParams.toString()}`;

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
}
export class OAuth implements IOAuth {
  codeRequest: OAuthCodeRequest;
  tokenRequest: OAuthTokenRequest;
  accessCode: ZohoAuthCode | undefined;
  accessToken: ZohoAuthToken | undefined;
  requestParams: OAuthRequestParams;

  constructor(request: OAuthParams) {
    this.requestParams = new OAuthRequestParams(request);
    this.tokenRequest = new OAuthTokenRequest();
    this.codeRequest = new OAuthCodeRequest();
  }

  async getAuth() {
    if (!this.accessToken) {
      await this.generateAuth();
      return this.accessToken;
    }

    if (this.accessToken.expiresIn < DateTime.local().toSeconds()) {
      await this.refreshAuth();
      return this.accessToken;
    }

    return this.accessToken;
  }

  async generateAuth() {
    this.accessCode = await this.codeRequest.generateAuthCode(this.requestParams);
    this.accessToken = await this.tokenRequest.generateAuthToken(this.accessCode, this.requestParams);
  }

  async refreshAuth() {
    if (this.accessToken) {
      this.accessToken = await this.tokenRequest.refreshToken(
        this.accessToken.refreshToken,
        this.requestParams
      );
    }
  }
};
