// Shared helpers for inventory-count differences across warehouse pages.
//
// A "difference" is a counted item whose physical count differs from its
// expected/reference quantity. The backend stores the reference quantity under
// "Quantity" (LoopBack field), so we match every other page's fallback:
//   expectedQuantity OR Quantity OR quantity.
//
// Remarks are persisted on the count record under `remarks` as one line per
// difference in "CommodityName: remark" format. A difference is considered
// UNREMARKED when that row's commodity has no non-empty remark entry.

import { useinventorycountstore } from "../stores/inventorycounts.store";
import { usewarehousestore } from "../stores/warehouse.store";

const parseRemarks = (remarks) => {
  const map = {};
  String(remarks || "")
    .split("\n")
    .forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > -1) {
        const name = line.slice(0, idx).trim();
        const text = line.slice(idx + 1).trim();
        if (name) map[name] = text;
      }
    });
  return map;
};

/**
 * De-duplicates a count's persisted item rows by commodityInventoryId, keeping
 * the LATEST persisted row (highest item id) for each commodity. Older duplicated
 * rows (e.g. stale rows created by a re-submission bug) must be ignored, so every
 * page (manage, differences list, differences detail) shows exactly the data that
 * was submitted most recently — one authoritative row per commodity-inventory.
 */
export function dedupeCountItems(items) {
  const latest = new Map();
  (Array.isArray(items) ? items : []).forEach((it) => {
    const key =
      it.commodityInventoryId != null
        ? String(it.commodityInventoryId)
        : `item-${it.id}`;
    const prev = latest.get(key);
    if (!prev || Number(it.id || 0) > Number(prev.id || 0)) {
      latest.set(key, it);
    }
  });
  return Array.from(latest.values());
}

/**
 * Counts the number of difference rows (counted vs expected) that do NOT yet
 * have a remark, across the provided counts. Only finalized ("Saved") counts
 * that carry persisted counted items are considered.
 *
 * `inventoryByWarehouse` maps a warehouse id -> its commodity-inventories, so
 * each difference row's commodity name is resolved the same way the differences
 * detail page resolves it (via the commodity-inventories lookup). This matters
 * because API-created count items only store `commodityInventoryId`, not an
 * embedded commodity name — so without this lookup we could never match remarks.
 */
export function countUnremarkedDifferences(counts, inventoryByWarehouse = {}) {
  let total = 0;
  (Array.isArray(counts) ? counts : []).forEach((c) => {
    const finalized =
      String(c.state || "").toLowerCase() === "saved" ||
      String(c.remarks || "").trim().length > 0;
    if (!finalized) return;

    // One authoritative row per commodity-inventory (latest persisted row).
    const items = dedupeCountItems(c.items || []);
    if (!items.length) return;

    const remarkMap = parseRemarks(c.remarks);
    const cWhId = Number(c.warehouseId || c.warehouse?.id);
    const invList = inventoryByWarehouse[cWhId] || [];
    const invById = invList.reduce((map, inv) => {
      map[String(inv.id)] = inv;
      return map;
    }, {});

    items.forEach((it) => {
      const expected = Number(it.expectedQuantity || it.Quantity || it.quantity || 0);
      const counted = Number(it.physicalCount || 0);
      if (counted - expected === 0) return;

      // Resolve the commodity name exactly like the differences detail page:
      // inventory lookup first, then any embedded commodity/name on the item.
      const inventory = invById[String(it.commodityInventoryId)];
      const name =
        inventory?.commodity?.Name ||
        it.commodityName ||
        (it.commodity && it.commodity.Name) ||
        "";

      if (!name || !String(remarkMap[name] || "").trim()) total += 1;
    });
  });
  return total;
}

/**
 * Async loader that fetches inventory counts for the current user's warehouses,
 * resolves each difference row's commodity name, and returns the number of
 * differences whose remark is still empty. Used by the header notification and
 * the Inventory Counts list badge so both stay consistent with the differences
 * detail page.
 */
export async function fetchUnremarkedDifferencesCount(userValue) {
  try {
    const u = userValue || null;
    const countsList = await useinventorycountstore().get();
    const warehouses = await usewarehousestore().get();

    const assignedWarehouse = (warehouses || []).find(
      (w) => String(w.userId) === String(u?.id)
    );

    const allowedWarehouseIds = (warehouses || [])
      .filter((w) => {
        if (assignedWarehouse) return Number(w.id) === Number(assignedWarehouse.id);
        if (!u?.district) return true;
        return w.district?.Name === u.district;
      })
      .map((w) => Number(w.id));

    const filteredCounts = (Array.isArray(countsList) ? countsList : []).filter(
      (r) => {
        if (!u?.district) return true;
        return allowedWarehouseIds.includes(
          Number(r.warehouseId || r.warehouse?.id)
        );
      }
    );

    // Fetch commodity-inventories for every warehouse that has counts, so we can
    // resolve commodity names (the differences page does per-warehouse lookups).
    const inventoryByWarehouse = {};
    const whIds = new Set(
      filteredCounts.map((c) => Number(c.warehouseId || c.warehouse?.id))
    );
    for (const whId of whIds) {
      if (!Number.isFinite(whId) || whId <= 0) continue;
      inventoryByWarehouse[whId] =
        (await usewarehousestore().getInventory(whId)) || [];
    }

    return countUnremarkedDifferences(filteredCounts, inventoryByWarehouse);
  } catch (error) {
    console.error("Error fetching unremarked differences:", error);
    return 0;
  }
}