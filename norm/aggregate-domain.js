/**
 * Aggregates normalized SRD + custom datasets for a domain.
 * Custom entries override SRD entries by `id`.
 *
 * Inputs MUST already be normalized and schema-valid.
 */
export function aggregateDomain({
  domain,
  srd,
  custom,
}) {
  if (!domain) {
    throw new Error("aggregateDomain: domain is required");
  }

  if (!Array.isArray(srd) || !Array.isArray(custom)) {
    throw new Error(`aggregateDomain(${domain}): inputs must be arrays`);
  }

  const map = new Map();

  // 1. Load SRD first
  for (const entry of srd) {
    if (!entry.id) {
      throw new Error(`aggregateDomain(${domain}): SRD entry missing id`);
    }
    map.set(entry.id, entry);
  }

  // 2. Custom overrides SRD
  for (const entry of custom) {
    if (!entry.id) {
      throw new Error(`aggregateDomain(${domain}): custom entry missing id`);
    }
    map.set(entry.id, entry);
  }

  return Array.from(map.values());
}
