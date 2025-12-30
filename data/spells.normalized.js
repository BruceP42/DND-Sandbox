import srdSpells from "../data/spells-srd.normalized.js";
import customSpells from "../data/spells-custom.normalized.js";
import { aggregateDomain } from "../norm/aggregate-domain.js";

export const __normalized = true;
export const __domain = "spells";

const aggregated = aggregateDomain({
  domain: "spells",
  srd: srdSpells,
  custom: customSpells,
});

export default aggregated;
