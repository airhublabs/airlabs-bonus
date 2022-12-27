import { OAuth, OAuthParams } from "./lib/auth";

export class Zoho {
  public OAuth: OAuth;

  constructor(params: OAuthParams) {
    this.OAuth = new OAuth(params);
    // const request = new ZohoRequest(params);

    // this.PerDiems = new PerDiems(request);
  }
}