export interface RefreshAccessTokenResponse {
  access_token: string;
  expires_in: number;
  api_domain: string;
  token_type: string;
}

export interface GenerateAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  api_domain: string;
}
