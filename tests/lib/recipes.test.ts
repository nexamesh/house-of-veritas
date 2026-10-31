import { describe, expect, it } from "vitest"
import { SAMPLE_RECIPES, findMissingSampleRecipes } from "@/lib/recipes"

function requiredText(value: string | undefined): string {
  expect(value?.trim().length).toBeGreaterThan(0)
  return value as string
}

describe("sample recipe catalog", () => {
  it("includes a published bilingual spaghetti bolognese for Hans and Irma", () => {
    const recipe = SAMPLE_RECIPES.find((item) =>
      item.titleEn.toLowerCase().includes("spaghetti bolognese")
    )

    expect(recipe).toBeDefined()
    expect(recipe?.status).toBe("published")
    expect(recipe?.audienceUserIds).toEqual(["hans", "irma"])
    expect(recipe?.servings).toBe(4)
    expect(requiredText(recipe?.titleAf).toLowerCase()).toContain("spaghetti bolognese")
    expect(requiredText(recipe?.summaryEn).toLowerCase()).toContain("mince")
    expect(requiredText(recipe?.summaryAf).toLowerCase()).toContain("mince")

    const ingredientNames = (recipe?.ingredients ?? []).map((ingredient) =>
      ingredient.name.toLowerCase()
    )
    expect(ingredientNames).toEqual(
      expect.arrayContaining([
        "cooking oil",
        "onions",
        "carrot",
        "beef mince",
        "ripe tomatoes",
        "spaghetti",
        "uncooked rice",
      ])
    )

    expect(recipe?.ingredients.some((ingredient) => String(ingredient.quantity) === "500")).toBe(
      true
    )
    expect(recipe?.steps.length).toBeGreaterThanOrEqual(7)
    expect(recipe?.steps.every((step) => step.instructionEn.trim() && step.instructionAf.trim())).toBe(
      true
    )
    expect(recipe?.image.source).toBe("Wikimedia Commons")
    expect(recipe?.image.license).toMatch(/^CC /)
    expect(recipe?.image.url).toContain("wikimedia.org")
    expect(requiredText(recipe?.image.attributionText)).toContain(recipe?.image.author ?? "")
  })

  it("includes bilingual bacon nachos with a separate stovetop method", () => {
    const recipe = SAMPLE_RECIPES.find((item) => item.titleEn ===
      "Crispy Bacon Bit Nachos with Avocado and Feta"
    )

    expect(recipe?.status).toBe("published")
    expect(recipe?.audienceUserIds).toEqual(["hans", "irma"])
    expect(recipe?.ingredients.map((item) => item.name)).toEqual(
      expect.arrayContaining(["Corn tortilla chips", "Bacon", "Cheddar", "Tomato", "Avocado", "Feta", "Sour cream", "Onion", "Green pepper"])
    )
    expect(recipe?.ingredients.find((item) => item.name === "Onion")?.unit).toContain("optional")
    expect(recipe?.ingredients.find((item) => item.name === "Green pepper")?.unit).toContain("optional")
    expect(recipe?.steps[0].instructionEn).toContain("4 to 5 minutes")
    expect(recipe?.steps[0].instructionAf).toContain("4 tot 5 minute")
    expect(recipe?.alternativeMethods?.[0].steps[0].instructionEn).toContain("green pepper")
    expect(recipe?.steps).toHaveLength(4)
    expect(recipe?.alternativeMethods).toHaveLength(1)
    expect(recipe?.alternativeMethods?.[0].nameEn).toBe("Covered frying pan")
    expect(recipe?.alternativeMethods?.[0].nameAf).toBe("Toegemaakte braaipan")
    expect(recipe?.alternativeMethods?.[0].steps.every(
      (step) => step.instructionEn.trim() && step.instructionAf.trim()
    )).toBe(true)
  })

  it("includes mustard-free bacon chicken rolls with optional onion and green pepper", () => {
    const recipe = SAMPLE_RECIPES.find((item) =>
      item.titleEn === "Mustard-Free Bacon and Cheese Chicken Rolls"
    )

    expect(recipe?.status).toBe("published")
    expect(recipe?.audienceUserIds).toEqual(["hans", "irma"])
    expect(recipe?.ingredients.map((item) => item.name)).toEqual(
      expect.arrayContaining(["Bacon", "Bread rolls", "Onion", "Green pepper", "Baby marrow (courgette)"])
    )
    expect(recipe?.ingredients.find((item) => item.name === "Onion")?.unit).toContain("optional")
    expect(recipe?.ingredients.find((item) => item.name === "Green pepper")?.unit).toContain("optional")
    expect(recipe?.ingredients.map((item) => item.name)).toEqual(
      expect.arrayContaining(["Cheddar", "Feta"])
    )
    expect(recipe?.summaryEn).toContain("goat's cheese")
    expect(recipe?.summaryEn?.toLowerCase()).toContain("mustard")
    expect(recipe?.summaryAf?.toLowerCase()).toContain("mosterd")
    expect(recipe?.steps.some((step) => step.instructionEn.includes("74°C"))).toBe(true)
    expect(recipe?.steps.some((step) => step.instructionEn.includes("centre of the cheese filling"))).toBe(true)
    expect(recipe?.steps.some((step) => step.instructionAf.includes("middel van die kaasvulsel"))).toBe(true)
    expect(recipe?.steps.every((step) => step.instructionEn.trim() && step.instructionAf.trim())).toBe(true)
    expect(recipe?.image.url).toBe("/images/recipes/bacon-chicken-rolls.webp")
  })

  it("finds only sample recipes whose English titles are not already stored", () => {
    const existing = [{ titleEn: SAMPLE_RECIPES[0].titleEn }]
    const missing = findMissingSampleRecipes(existing)

    expect(missing).toHaveLength(SAMPLE_RECIPES.length - 1)
    expect(missing.map((recipe) => recipe.titleEn)).not.toContain(SAMPLE_RECIPES[0].titleEn)
    expect(missing.some((recipe) => recipe.titleEn.toLowerCase().includes("spaghetti bolognese"))).toBe(
      true
    )
    expect(missing.some((recipe) => recipe.titleEn.toLowerCase().includes("sirloin skillet"))).toBe(
      true
    )
    expect(missing.some((recipe) => recipe.titleEn.toLowerCase().includes("tomato rice pot"))).toBe(
      true
    )
    expect(missing.some((recipe) => recipe.titleEn.toLowerCase().includes("potato bake"))).toBe(true)
  })

  it("includes a published bilingual one-pan skillet for Hans and Irma", () => {
    const recipe = SAMPLE_RECIPES.find((item) =>
      item.titleEn.toLowerCase().includes("sirloin skillet")
    )

    expect(recipe).toBeDefined()
    expect(recipe?.status).toBe("published")
    expect(recipe?.audienceUserIds).toEqual(["hans", "irma"])
    expect(requiredText(recipe?.titleAf).toLowerCase()).toContain("sirloin")
    expect(requiredText(recipe?.summaryEn).toLowerCase()).toContain("three tomatoes")

    const ingredientNames = (recipe?.ingredients ?? []).map((ingredient) =>
      ingredient.name.toLowerCase()
    )
    expect(ingredientNames).toEqual(
      expect.arrayContaining([
        "bacon",
        "sausage",
        "sirloin",
        "potatoes",
        "onion",
        "carrot",
        "green pepper",
        "ripe tomatoes",
      ])
    )
    expect(recipe?.ingredients.some((ingredient) => ingredient.quantity === 3)).toBe(true)
    expect(recipe?.steps).toHaveLength(4)
    expect(recipe?.steps.every((step) => step.instructionEn.trim() && step.instructionAf.trim())).toBe(
      true
    )
    expect(recipe?.image.source).toBe("Wikimedia Commons")
    expect(recipe?.image.license).toMatch(/^CC /)
    expect(requiredText(recipe?.image.attributionText)).toContain(recipe?.image.author ?? "")
  })

  it("includes the rice pot, potato bake, cheesy bacon spaghetti, and remaining cheddar alternatives", () => {
    const ricePot = SAMPLE_RECIPES.find((item) =>
      item.titleEn.toLowerCase().includes("tomato rice pot")
    )
    const potatoBake = SAMPLE_RECIPES.find((item) =>
      item.titleEn.toLowerCase().includes("potato bake")
    )
    const spaghetti = SAMPLE_RECIPES.find((item) =>
      item.titleEn.toLowerCase().includes("cheesy bacon, tomato")
    )
    const worsSkillet = SAMPLE_RECIPES.find((item) =>
      item.titleEn.toLowerCase().includes("potato and cheddar skillet")
    )
    const pastaBake = SAMPLE_RECIPES.find((item) =>
      item.titleEn.toLowerCase().includes("tomato pasta bake")
    )
    const riceBowls = SAMPLE_RECIPES.find((item) =>
      item.titleEn.toLowerCase().includes("pepper rice bowls")
    )

    expect(ricePot?.ingredients.map((item) => item.name.toLowerCase())).toEqual(
      expect.arrayContaining(["boerewors", "bacon", "uncooked rice", "green pepper"])
    )
    expect(ricePot?.steps.some((step) => step.instructionEn.toLowerCase().includes("do not cut"))).toBe(
      true
    )
    expect(potatoBake?.ingredients.map((item) => item.name.toLowerCase())).toEqual(
      expect.arrayContaining(["potatoes", "bacon", "cheddar", "ripe tomatoes"])
    )
    expect(potatoBake?.steps[0]?.instructionEn).toContain("190")
    expect(spaghetti?.ingredients.map((item) => item.name.toLowerCase())).toEqual(
      expect.arrayContaining(["spaghetti", "cheddar", "carrot"])
    )
    expect(worsSkillet?.ingredients.map((item) => item.name.toLowerCase())).toEqual(
      expect.arrayContaining(["boerewors", "potatoes", "cheddar"])
    )
    expect(pastaBake?.steps.some((step) => step.instructionEn.includes("200"))).toBe(true)
    expect(riceBowls?.steps.some((step) => step.instructionEn.toLowerCase().includes("across the grain"))).toBe(
      true
    )
    for (const recipe of [ricePot, potatoBake, spaghetti, worsSkillet, pastaBake, riceBowls]) {
      expect(recipe?.status).toBe("published")
      expect(recipe?.audienceUserIds).toEqual(["hans", "irma"])
      expect(recipe?.steps.every((step) => step.instructionEn.trim() && step.instructionAf.trim())).toBe(
        true
      )
      expect(recipe?.image.license).toMatch(/^CC /)
    }
  })
})
