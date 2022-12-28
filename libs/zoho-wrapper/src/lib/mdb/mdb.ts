import { Config, JsonDB } from "node-json-db";

export const mdb = new JsonDB(new Config('config', true, true, '.'));
