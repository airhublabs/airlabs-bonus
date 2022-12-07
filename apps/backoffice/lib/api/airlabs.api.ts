import { AirlabsApi } from '@airlabs-bonus/data-access';

export const HOST_URL = process.env.NODE_ENV === 'development' ? "http://localhost:5000" : 'https://api.newage.dev';

const api = new AirlabsApi({host: HOST_URL, version: "v1"});

export default api;
