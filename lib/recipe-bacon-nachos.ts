import type { RecipeCreatePayload } from "@/lib/recipes"

// Method adapted from https://eatmexican.com.au/recipes/loaded-nachos/
// and https://www.missionfoods.com/recipes/loaded-nachos/
export const BACON_NACHOS_RECIPE: RecipeCreatePayload = {
  status: "published",
  audienceUserIds: ["hans", "irma"],
  titleEn: "Crispy Bacon Bit Nachos with Avocado and Feta",
  titleAf: "Bros Spek-nacho's met Avokado en Feta",
  summaryEn:
    "Corn chips layered with melted cheddar and crisp bacon, finished with tomato, avocado, feta and sour cream. Stovetop method included; without bacon, use drained beans, and without feta or sour cream, use extra cheddar or mashed avocado.",
  summaryAf:
    "Mielieskyfies in lae met gesmelte cheddar en bros spek, afgerond met tamatie, avokado, feta en suurroom. Stoofmetode ingesluit; gebruik gedreineerde bone sonder spek, meer cheddar sonder feta, of fyngedrukte avokado sonder suurroom.",
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 15,
  cuisine: "Tex-Mex inspired",
  category: "Snack",
  image: {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/87/Nachos-cheese.jpg",
    source: "Wikimedia Commons",
    author: "chee.hong",
    license: "CC BY 2.0",
    attributionText:
      "chee.hong, CC BY 2.0, via Wikimedia Commons (illustrative cheese nachos photo)",
    retrievedAt: "2026-10-28",
  },
  ingredients: [
    { name: "Corn tortilla chips", quantity: "150-200", unit: "g" },
    { name: "Bacon", quantity: "4-6", unit: "rashers" },
    { name: "Cheddar", quantity: 1, unit: "cup, grated" },
    { name: "Tomato", quantity: 1, unit: "medium, diced and drained" },
    { name: "Avocado", quantity: 1, unit: "diced" },
    { name: "Feta", quantity: "2-3", unit: "tablespoons, crumbled" },
    { name: "Sour cream", quantity: "3-4", unit: "tablespoons" },
    { name: "Lime juice or hot sauce", quantity: "optional" },
  ],
  steps: [
    {
      order: 1,
      timerMinutes: 8,
      instructionEn:
        "Heat the oven to 200°C (180°C fan). Fry the bacon over medium heat until crisp, about 5 to 8 minutes. Drain and chop into small bits.",
      instructionAf:
        "Verhit die oond tot 200°C (180°C met waaier). Braai die spek oor medium hitte tot bros, ongeveer 5 tot 8 minute. Dreineer en kap in klein stukkies.",
    },
    {
      order: 2,
      instructionEn:
        "Spread half the chips on a baking tray. Add half the cheddar and bacon. Repeat with the remaining chips, cheddar and bacon.",
      instructionAf:
        "Sprei die helfte van die skyfies op 'n bakplaat uit. Strooi die helfte van die cheddar en spek oor. Herhaal met die res van die skyfies, cheddar en spek.",
    },
    {
      order: 3,
      timerMinutes: 10,
      instructionEn:
        "Bake for 8 to 10 minutes, just until the cheddar melts. Watch the chips near the end so they do not burn.",
      instructionAf:
        "Bak 8 tot 10 minute, net totdat die cheddar smelt. Hou die skyfies teen die einde dop sodat hulle nie brand nie.",
    },
    {
      order: 4,
      instructionEn:
        "Scatter the drained tomato and avocado over the hot nachos. Add crumbled feta and dollops of sour cream. Finish with lime juice or hot sauce if available. Serve immediately; the bacon and feta are salty enough without extra salt.",
      instructionAf:
        "Strooi die gedreineerde tamatie en avokado oor die warm nacho's. Voeg gekrummelde feta en lepelsvol suurroom by. Rond af met lemmetjiesap of brandrissiesous indien beskikbaar. Bedien dadelik; die spek en feta is sout genoeg sonder ekstra sout.",
    },
  ],
  alternativeMethods: [
    {
      nameEn: "Covered frying pan",
      nameAf: "Toegemaakte braaipan",
      summaryEn: "Use the stovetop when no oven is available; keep the heat low to protect the chips.",
      summaryAf: "Gebruik die stoof as daar geen oond is nie; hou die hitte laag sodat die skyfies nie brand nie.",
      steps: [
        {
          order: 1,
          timerMinutes: 8,
          instructionEn: "Fry the bacon over medium heat until crisp, about 5 to 8 minutes. Drain and chop into bits.",
          instructionAf: "Braai die spek oor medium hitte tot bros, ongeveer 5 tot 8 minute. Dreineer en kap in stukkies.",
        },
        {
          order: 2,
          timerMinutes: 5,
          instructionEn: "Layer the chips, cheddar and cooked bacon in a large dry frying pan. Cover and warm over low heat for 3 to 5 minutes, until the cheese melts.",
          instructionAf: "Plaas die skyfies, cheddar en gaar spek in lae in 'n groot droë braaipan. Bedek en verhit 3 tot 5 minute oor lae hitte totdat die kaas smelt.",
        },
        {
          order: 3,
          instructionEn: "Take the pan off the heat. Add drained tomato, avocado, feta and sour cream; finish with lime juice or hot sauce if available. Serve immediately.",
          instructionAf: "Haal die pan van die hitte af. Voeg gedreineerde tamatie, avokado, feta en suurroom by; rond af met lemmetjiesap of brandrissiesous indien beskikbaar. Bedien dadelik.",
        },
      ],
    },
  ],
}
