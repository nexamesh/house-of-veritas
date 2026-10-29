export const RECYCLING_SOURCES = {
  codes: "https://www.plasticsinfo.co.za/2021/01/26/what-do-the-numbers-on-plastic-products-mean/",
  acceptance: "https://petco.co.za/faqs/",
  prices: "https://wastegogreen.co.za/what-we-buy",
  centres: "https://petco.co.za/buy-back-centres/",
} as const

export const PRICE_CHECKED_AT = "29 October 2026"

export type RecyclingGroup = "Plastic" | "Metal" | "Glass"

export interface RecyclingMaterial {
  id: string
  name: string
  code?: string
  fullName: string
  group: RecyclingGroup
  examples: string
  sorting: string
  acceptance: string
  priceCentsPerKg: number | null
}

// The published quotes are from one Milnerton buy-back centre, not a national tariff.
export const RECYCLING_MATERIALS: RecyclingMaterial[] = [
  {
    id: "pet",
    name: "PET",
    code: "1",
    fullName: "Polyethylene terephthalate",
    group: "Plastic",
    examples: "Water and cool-drink bottles; some clear jars",
    sorting: "Empty and rinse. Check the bottle body code; caps can be a different polymer.",
    acceptance: "Widely collected as bottles and jars; check trays and unusual colours locally.",
    priceCentsPerKg: 300,
  },
  {
    id: "hdpe",
    name: "HDPE",
    code: "2",
    fullName: "High-density polyethylene",
    group: "Plastic",
    examples: "Milk, shampoo and detergent bottles",
    sorting: "Rinse and keep apart from PET. Look for 2 or PE-HD on the container.",
    acceptance: "Commonly collected; buyer requirements for colours and shapes differ.",
    priceCentsPerKg: 200,
  },
  {
    id: "pvc",
    name: "PVC",
    code: "3",
    fullName: "Polyvinyl chloride",
    group: "Plastic",
    examples: "Pipes, conduit and some shrink sleeves",
    sorting: "Keep separate from PET, even when both look clear.",
    acceptance: "Specialist processing is often needed; ask a buyer first.",
    priceCentsPerKg: null,
  },
  {
    id: "ldpe",
    name: "LDPE",
    code: "4",
    fullName: "Low-density polyethylene",
    group: "Plastic",
    examples: "Shopping bags and flexible packaging film",
    sorting: "Keep film clean and dry; separate from rigid containers.",
    acceptance: "Film collection depends on the local buyer and cleanliness.",
    priceCentsPerKg: 150,
  },
  {
    id: "pp",
    name: "PP",
    code: "5",
    fullName: "Polypropylene",
    group: "Plastic",
    examples: "Margarine tubs, some caps and takeaway tubs",
    sorting: "Rinse tubs. Sort caps separately if your buyer asks.",
    acceptance: "Commonly recycled, subject to local collection.",
    priceCentsPerKg: 250,
  },
  {
    id: "ps",
    name: "PS",
    code: "6",
    fullName: "Polystyrene",
    group: "Plastic",
    examples: "Foam trays, cups and some rigid yoghurt cups",
    sorting: "Keep clean foam and rigid PS separate when requested.",
    acceptance: "Some buyers take clean PS; confirm the form they accept.",
    priceCentsPerKg: 100,
  },
  {
    id: "other",
    name: "Other",
    code: "7",
    fullName: "Other or mixed polymers",
    group: "Plastic",
    examples: "PETG, multilayer packs and various engineering plastics",
    sorting: "Read the acronym under 7; do not mix with PET bottles.",
    acceptance: "No single recycling route or price covers every code 7 plastic.",
    priceCentsPerKg: null,
  },
  {
    id: "copper",
    name: "Copper",
    fullName: "Clean copper wire or pipe",
    group: "Metal",
    examples: "Uninsulated wire and clean plumbing offcuts",
    sorting: "Separate clean metal from insulated cable, brass and attached fittings.",
    acceptance: "Grades depend on purity and attachments; yards inspect before paying.",
    priceCentsPerKg: 9000,
  },
  {
    id: "aluminium",
    name: "Aluminium cans",
    fullName: "Used beverage cans",
    group: "Metal",
    examples: "Empty beverage cans",
    sorting: "Rinse and keep apart from steel food cans and cast/extruded aluminium.",
    acceptance: "Can, cast and extrusion grades have different prices.",
    priceCentsPerKg: 1400,
  },
  {
    id: "steel",
    name: "Steel cans",
    fullName: "Ferrous food cans",
    group: "Metal",
    examples: "Empty food and tin-plated steel cans",
    sorting: "Rinse and sort from aluminium cans; ordinary steel is usually magnetic.",
    acceptance: "Heavy scrap steel is a separate grade from cans.",
    priceCentsPerKg: 100,
  },
  {
    id: "glass",
    name: "Glass bottles",
    fullName: "Bottles and jars",
    group: "Glass",
    examples: "Clear, amber and green bottles and food jars",
    sorting: "Empty and rinse. Sort by colour when the buyer asks; keep ceramics out.",
    acceptance: "Ask whether the point accepts whole bottles, cullet, or both.",
    priceCentsPerKg: 40,
  },
]

export function estimateRecyclingCents(priceCentsPerKg: number | null, kg: number): number | null {
  if (priceCentsPerKg === null || !Number.isFinite(kg) || kg < 0) return null
  const cents = Math.round(priceCentsPerKg * kg)
  return Number.isSafeInteger(cents) ? cents : null
}
