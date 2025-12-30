import srdMonsters from "../data/monsters-srd.normalized.js";
import customMonsters from "../data/monsters-custom.normalized.js";
import { aggregateDomain } from "../norm/aggregate-domain.js";

export const __normalized = true;
export const __domain = "monsters";

const aggregated = aggregateDomain({
  domain: "monsters",
  srd: srdMonsters,
  custom: customMonsters,
});

export default aggregated;
