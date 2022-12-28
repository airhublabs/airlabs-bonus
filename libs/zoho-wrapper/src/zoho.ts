import { OAuth, OAuthParams } from './lib/auth';
import { ZohoRequest } from './lib/requests';
import { PerDiems } from './lib/requests/per-diems.api';

export interface RequestParams {
  version?: 'v2';
  apiHost?: string;
  accountsHost?: string;
  accountOwnerName: string;
  appLinkName: string;
  clientId: string;
  clientSecret: string;
}

export class ZohoApi {
  public OAuth!: OAuth;
  public PerDiems: PerDiems;

  constructor(private readonly params: RequestParams) {
    const request = new ZohoRequest(params);

    this.PerDiems = new PerDiems(request);
  }
}
