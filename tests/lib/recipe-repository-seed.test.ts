import { mkdtemp, rm } from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"
import { SAMPLE_RECIPES } from "@/lib/recipes"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

type RecipeRepository = typeof import("@/lib/repositories/recipe-repository")

describe("seedSampleRecipes field fidelity", () => {
  let tempDir = ""
  let repository: RecipeRepository

  beforeEach(async () => {
    // The repository resolves its data file from process.cwd() at import time.
    // An isolated temp dir keeps this file from racing other suites on data/recipes.json.
    tempDir = await mkdtemp(join(tmpdir(), "hov-recipes-"))
    vi.spyOn(process, "cwd").mockReturnValue(tempDir)
    vi.resetModules()
    vi.unstubAllEnvs()
    vi.stubEnv("NODE_ENV", "test")
    vi.stubEnv("CI", "")
    vi.stubEnv("E2E_TEST", "1")
    vi.stubEnv("MONGODB_URI", "")
    vi.stubEnv("MONGO_URL", "")
    repository = await import("@/lib/repositories/recipe-repository")
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    await rm(tempDir, { recursive: true, force: true })
  })

  function sample(title: string) {
    const found = SAMPLE_RECIPES.find((item) => item.titleEn === title)
    if (!found) throw new Error(`Missing sample recipe ${title}`)
    return found
  }

  async function seededByTitle(title: string) {
    await repository.seedSampleRecipes("hans")
    const stored = (await repository.listRecipes()).find((item) => item.titleEn === title)
    if (!stored) throw new Error(`Seed did not store ${title}`)
    return stored
  }

  it("preserves alternativeMethods with generated ids", async () => {
    const stored = await seededByTitle("Loaded Baked Jacket Potatoes")
    const source = sample("Loaded Baked Jacket Potatoes")

    expect(stored.alternativeMethods).toHaveLength(2)
    expect(stored.alternativeMethods?.map((method) => method.nameEn)).toEqual(
      source.alternativeMethods?.map((method) => method.nameEn)
    )
    expect(stored.alternativeMethods?.[0].id).toBe(`alt-${stored.id}-1`)
    expect(stored.alternativeMethods?.[0].steps[0]).toMatchObject({
      order: 1,
      timerMinutes: 40,
      instructionAf: source.alternativeMethods?.[0].steps[0].instructionAf,
    })
  })

  it("omits alternativeMethods for recipes that have none", async () => {
    const stored = await seededByTitle("Mince & Veg Skillet")
    expect(stored.alternativeMethods).toBeUndefined()
  })

  it("preserves ingredient unit, preparationNote and section (regression)", async () => {
    const stored = await seededByTitle("Loaded Baked Jacket Potatoes")
    const source = sample("Loaded Baked Jacket Potatoes")

    expect(stored.ingredients.some((ingredient) => ingredient.section === "Topping")).toBe(true)
    expect(source.ingredients.some((ingredient) => ingredient.unit)).toBe(true)
    stored.ingredients.forEach((ingredient, index) => {
      const expected = source.ingredients[index]
      expect(ingredient.unit).toBe(expected.unit?.trim() || undefined)
      expect(ingredient.preparationNote).toBe(expected.preparationNote?.trim() || undefined)
      expect(ingredient.section).toBe(expected.section?.trim() || undefined)
    })
  })

  it("preserves step timerMinutes and section (regression)", async () => {
    const stored = await seededByTitle("Loaded Baked Jacket Potatoes")
    const source = sample("Loaded Baked Jacket Potatoes")

    expect(stored.steps[0].timerMinutes).toBe(60)
    stored.steps.forEach((step, index) => {
      expect(step.timerMinutes).toBe(source.steps[index].timerMinutes)
      expect(step.section).toBe(source.steps[index].section?.trim() || undefined)
    })
  })
})
