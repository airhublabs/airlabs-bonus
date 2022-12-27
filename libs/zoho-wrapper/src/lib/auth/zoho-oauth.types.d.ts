export interface RefreshAccessTokenResponse {
  access_token: string;
  expires_in: number;
  api_domain: string;
  token_type: string;
}

export interface ZohoAuthCodeResponse {
  "code": string;
  "location": string;
  "accounts-server": string;
}

export interface ZohoAuthCode {
  code: string;
  location: string;
  accountsServer: string;
}
export interface ZohoAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  api_domain: string;
  token_type: "Bearer";
}

export interface ZohoAuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  apiDomain: string;
  tokenType: "Bearer";
};