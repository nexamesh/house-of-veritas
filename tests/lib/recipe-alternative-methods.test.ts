import { describe, expect, it } from "vitest"
import {
  SAMPLE_RECIPES,
  normalizeAlternativeMethods,
  validateAlternativeMethods,
  type RecipeAlternativeMethod,
} from "@/lib/recipes"

describe("normalizeAlternativeMethods", () => {
  it("returns an empty list for non-array input", () => {
    for (const input of [undefined, null, "oven", 42, { steps: [] }]) {
      expect(normalizeAlternativeMethods(input, "r1")).toEqual([])
    }
  })

  it("skips non-object entries, including arrays and null", () => {
    const result = normalizeAlternativeMethods(
      [null, "x", 3, [], { nameEn: "Air fryer", nameAf: "Lugbraaier", steps: [] }],
      "r1"
    )
    expect(result).toHaveLength(1)
    expect(result[0].nameEn).toBe("Air fryer")
  })

  it("generates deterministic method and step ids from the recipe id", () => {
    const [method] = normalizeAlternativeMethods(
      [{ nameEn: "A", nameAf: "B", steps: [{ instructionEn: "x", instructionAf: "y" }] }],
      "recipe-9"
    )
    expect(method.id).toBe("alt-recipe-9-1")
    expect(method.steps[0].id).toBe("alt-recipe-9-1-step-1")
  })

  it("keeps supplied ids and trims text fields", () => {
    const [method] = normalizeAlternativeMethods(
      [
        {
          id: "  my-id ",
          nameEn: "  Air fryer ",
          nameAf: " Lugbraaier  ",
          summaryEn: "  quick ",
          summaryAf: "   ",
          steps: [
            {
              id: " s1 ",
              instructionEn: " Cook ",
              instructionAf: " Kook ",
              section: " Main ",
              timerMinutes: 5,
            },
          ],
        },
      ],
      "r1"
    )
    expect(method).toEqual({
      id: "my-id",
      nameEn: "Air fryer",
      nameAf: "Lugbraaier",
      summaryEn: "quick",
      summaryAf: undefined,
      steps: [
        {
          id: "s1",
          order: 1,
          instructionEn: "Cook",
          instructionAf: "Kook",
          timerMinutes: 5,
          section: "Main",
        },
      ],
    })
  })

  it("falls back to positional order when order is missing, zero, negative or fractional", () => {
    const [method] = normalizeAlternativeMethods(
      [
        {
          nameEn: "A",
          nameAf: "B",
          steps: [
            { order: 7, instructionEn: "a", instructionAf: "a" },
            { order: 0, instructionEn: "b", instructionAf: "b" },
            { order: -2, instructionEn: "c", instructionAf: "c" },
            { order: 1.5, instructionEn: "d", instructionAf: "d" },
            { instructionEn: "e", instructionAf: "e" },
          ],
        },
      ],
      "r1"
    )
    expect(method.steps.map((step) => step.order)).toEqual([7, 2, 3, 4, 5])
  })

  it("drops invalid timers but keeps zero", () => {
    const [method] = normalizeAlternativeMethods(
      [
        {
          nameEn: "A",
          nameAf: "B",
          steps: [
            { instructionEn: "a", instructionAf: "a", timerMinutes: 0 },
            { instructionEn: "b", instructionAf: "b", timerMinutes: -1 },
            { instructionEn: "c", instructionAf: "c", timerMinutes: "5" },
          ],
        },
      ],
      "r1"
    )
    expect(method.steps.map((step) => step.timerMinutes)).toEqual([0, undefined, undefined])
  })

  it("keeps malformed methods and steps with empty fields so validation can report them", () => {
    const result = normalizeAlternativeMethods(
      [
        { nameEn: 5, steps: "nope" },
        { nameEn: "A", nameAf: "B", steps: [null, { instructionEn: 1 }] },
      ],
      "r1"
    )
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ nameEn: "", nameAf: "", steps: [] })
    expect(result[1].steps).toHaveLength(1)
    expect(result[1].steps[0]).toMatchObject({ instructionEn: "", instructionAf: "" })
  })
})

describe("validateAlternativeMethods", () => {
  const valid: RecipeAlternativeMethod = {
    id: "alt-1",
    nameEn: "Air fryer",
    nameAf: "Lugbraaier",
    steps: [{ id: "s1", order: 1, instructionEn: "Cook", instructionAf: "Kook" }],
  }

  it("accepts an empty list and valid methods", () => {
    expect(validateAlternativeMethods([])).toBeNull()
    expect(validateAlternativeMethods([valid])).toBeNull()
  })

  it("rejects a missing English or Afrikaans name", () => {
    const message = "Alternative methods must include English and Afrikaans names"
    expect(validateAlternativeMethods([{ ...valid, nameEn: "" }])).toBe(message)
    expect(validateAlternativeMethods([{ ...valid, nameAf: "" }])).toBe(message)
  })

  it("rejects a method with no steps", () => {
    expect(validateAlternativeMethods([{ ...valid, steps: [] }])).toBe(
      "Alternative methods must include at least one step"
    )
  })

  it("rejects a step missing English or Afrikaans instructions", () => {
    const message = "All alternative method steps must include English and Afrikaans instructions"
    const step = valid.steps[0]
    expect(
      validateAlternativeMethods([{ ...valid, steps: [{ ...step, instructionEn: "" }] }])
    ).toBe(message)
    expect(
      validateAlternativeMethods([{ ...valid, steps: [{ ...step, instructionAf: "" }] }])
    ).toBe(message)
  })

  it("reports the first invalid method even when earlier ones are valid", () => {
    expect(validateAlternativeMethods([valid, { ...valid, steps: [] }])).toBe(
      "Alternative methods must include at least one step"
    )
  })

  it("flags malformed raw input once normalized", () => {
    const normalized = normalizeAlternativeMethods([{ nameEn: "A", steps: [] }], "r1")
    expect(validateAlternativeMethods(normalized)).toBe(
      "Alternative methods must include English and Afrikaans names"
    )
  })
})

describe("seeded alternative methods", () => {
  function find(title: string) {
    const recipe = SAMPLE_RECIPES.find((item) => item.titleEn === title)
    if (!recipe) throw new Error(`Missing sample recipe ${title}`)
    return recipe
  }

  it("gives Loaded Baked Jacket Potatoes an air fryer and a microwave-then-oven method", () => {
    const methods = find("Loaded Baked Jacket Potatoes").alternativeMethods ?? []
    expect(methods.map((method) => method.nameEn)).toEqual(["Air fryer", "Microwave then oven"])
  })

  it("gives Mince-Stuffed Cabbage Rolls an oven-baked method", () => {
    const methods = find("Mince-Stuffed Cabbage Rolls").alternativeMethods ?? []
    expect(methods.map((method) => method.nameEn)).toEqual(["Oven-baked"])
  })

  it("keeps every seeded method valid with non-empty EN and AF text", () => {
    const withMethods = SAMPLE_RECIPES.filter((item) => item.alternativeMethods?.length)
    expect(withMethods).toHaveLength(2)
    for (const recipe of withMethods) {
      for (const method of recipe.alternativeMethods ?? []) {
        expect(method.nameEn.trim()).not.toBe("")
        expect(method.nameAf.trim()).not.toBe("")
        expect(method.steps.length).toBeGreaterThan(0)
        for (const step of method.steps) {
          expect(step.instructionEn.trim()).not.toBe("")
          expect(step.instructionAf.trim()).not.toBe("")
        }
      }
      const normalized = normalizeAlternativeMethods(recipe.alternativeMethods, "seed")
      expect(validateAlternativeMethods(normalized)).toBeNull()
    }
  })
})
