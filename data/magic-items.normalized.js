import srdMagicItems from "../data/magic-items-srd.normalized.js";
import customMagicItems from "../data/magic-items-custom.normalized.js";
import { aggregateDomain } from "../norm/aggregate-domain.js";

export const __normalized = true;
export const __domain = "magic-items";

const aggregated = aggregateDomain({
  domain: "magic-items",
  srd: srdMagicItems,
  custom: customMagicItems,
});

export default aggregated;
