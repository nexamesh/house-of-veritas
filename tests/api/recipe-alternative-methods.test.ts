import { beforeEach, describe, expect, it, vi } from "vitest"
import { POST as createRecipeRoute } from "@/app/api/recipes/route"
import { PATCH as updateRecipeRoute } from "@/app/api/recipes/[id]/route"
import { createRecipe, getRecipeById, replaceRecipe } from "@/lib/repositories/recipe-repository"
import type { RecipeAlternativeMethod, RecipeRecord } from "@/lib/recipes"

vi.mock("@/lib/repositories/recipe-repository", () => ({
  createRecipe: vi.fn(),
  getRecipeById: vi.fn(),
  replaceRecipe: vi.fn(),
  listRecipes: vi.fn(),
  getRecipeRatingSummaries: vi.fn(),
}))

const image = {
  url: "https://images.example/recipe.jpg",
  source: "Example library",
  license: "CC BY 4.0",
  attributionText: "Example Author, CC BY 4.0",
  retrievedAt: "2026-07-28",
}

const existingMethods: RecipeAlternativeMethod[] = [
  {
    id: "alt-existing",
    nameEn: "Air fryer",
    nameAf: "Lugbraaier",
    steps: [{ id: "alt-existing-s1", order: 1, instructionEn: "Fry.", instructionAf: "Braai." }],
  },
]

const existingRecipe: RecipeRecord = {
  id: "recipe-1",
  status: "published",
  ownerUserId: "hans",
  audienceUserIds: ["hans", "irma"],
  titleEn: "Household supper",
  titleAf: "Huishoudelike aandete",
  image,
  ingredients: [{ id: "ingredient-1", name: "Rice" }],
  steps: [{ id: "step-1", order: 1, instructionEn: "Cook.", instructionAf: "Kook." }],
  alternativeMethods: existingMethods,
  createdAt: "2026-07-28T09:00:00.000Z",
  updatedAt: "2026-07-29T09:00:00.000Z",
}

const baseCreateBody = {
  titleEn: "New supper",
  titleAf: "Nuwe aandete",
  image,
  ingredients: [{ name: "Rice" }],
  steps: [{ instructionEn: "Cook.", instructionAf: "Kook." }],
}

function jsonRequest(method: string, body: unknown, path = "/api/recipes") {
  return new Request(`http://localhost${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      "x-user-id": "hans",
      "x-user-role": "admin",
      "x-user-email": "hans@example.com",
    },
    body: JSON.stringify(body),
  })
}

const patchContext = { params: Promise.resolve({ id: "recipe-1" }) }

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(createRecipe).mockImplementation(async (recipe) => recipe)
  vi.mocked(replaceRecipe).mockImplementation(async (recipe) => recipe)
  vi.mocked(getRecipeById).mockResolvedValue(existingRecipe)
})

describe("POST /api/recipes alternativeMethods", () => {
  it("normalizes and stores alternative methods", async () => {
    const response = await createRecipeRoute(
      jsonRequest("POST", {
        ...baseCreateBody,
        alternativeMethods: [
          {
            nameEn: "  Air fryer ",
            nameAf: "Lugbraaier",
            steps: [{ instructionEn: "Fry.", instructionAf: "Braai.", timerMinutes: 12 }],
          },
        ],
      }),
      { params: Promise.resolve({}) }
    )

    expect(response.status).toBe(200)
    const { recipe } = (await response.json()) as { recipe: RecipeRecord }
    expect(recipe.alternativeMethods).toHaveLength(1)
    expect(recipe.alternativeMethods?.[0]).toMatchObject({
      id: `alt-${recipe.id}-1`,
      nameEn: "Air fryer",
      nameAf: "Lugbraaier",
    })
    expect(recipe.alternativeMethods?.[0].steps[0]).toMatchObject({
      id: `alt-${recipe.id}-1-step-1`,
      order: 1,
      timerMinutes: 12,
    })
    expect(vi.mocked(createRecipe).mock.calls[0][0].alternativeMethods).toHaveLength(1)
  })

  it("omits the field entirely when none are supplied", async () => {
    const response = await createRecipeRoute(jsonRequest("POST", baseCreateBody), {
      params: Promise.resolve({}),
    })
    expect(response.status).toBe(200)
    const { recipe } = (await response.json()) as { recipe: RecipeRecord }
    expect("alternativeMethods" in recipe).toBe(false)
  })

  it.each([
    [
      "missing Afrikaans name",
      { nameEn: "Air fryer", steps: [{ instructionEn: "a", instructionAf: "b" }] },
      "Alternative methods must include English and Afrikaans names",
    ],
    [
      "no steps",
      { nameEn: "Air fryer", nameAf: "Lugbraaier", steps: [] },
      "Alternative methods must include at least one step",
    ],
    [
      "step missing Afrikaans",
      { nameEn: "A", nameAf: "B", steps: [{ instructionEn: "a" }] },
      "All alternative method steps must include English and Afrikaans instructions",
    ],
  ])("rejects an invalid method (%s) with 400 and does not persist", async (_name, method, message) => {
    const response = await createRecipeRoute(
      jsonRequest("POST", { ...baseCreateBody, alternativeMethods: [method] }),
      { params: Promise.resolve({}) }
    )
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: message })
    expect(createRecipe).not.toHaveBeenCalled()
  })
})

describe("PATCH /api/recipes/[id] alternativeMethods", () => {
  it("keeps existing methods when the field is omitted", async () => {
    const response = await updateRecipeRoute(
      jsonRequest("PATCH", { titleEn: "Renamed" }, "/api/recipes/recipe-1"),
      patchContext
    )
    expect(response.status).toBe(200)
    const { recipe } = (await response.json()) as { recipe: RecipeRecord }
    expect(recipe.titleEn).toBe("Renamed")
    expect(recipe.alternativeMethods).toEqual(existingMethods)
  })

  it("clears methods when an explicit empty array is sent", async () => {
    const response = await updateRecipeRoute(
      jsonRequest("PATCH", { alternativeMethods: [] }, "/api/recipes/recipe-1"),
      patchContext
    )
    expect(response.status).toBe(200)
    const { recipe } = (await response.json()) as { recipe: RecipeRecord }
    expect(recipe.alternativeMethods).toEqual([])
    expect(vi.mocked(replaceRecipe).mock.calls[0][0].alternativeMethods).toEqual([])
  })

  it("replaces methods with the normalized new list", async () => {
    const response = await updateRecipeRoute(
      jsonRequest(
        "PATCH",
        {
          alternativeMethods: [
            {
              nameEn: "Oven",
              nameAf: "Oond",
              steps: [{ instructionEn: "Bake.", instructionAf: "Bak." }],
            },
          ],
        },
        "/api/recipes/recipe-1"
      ),
      patchContext
    )
    expect(response.status).toBe(200)
    const { recipe } = (await response.json()) as { recipe: RecipeRecord }
    expect(recipe.alternativeMethods).toHaveLength(1)
    expect(recipe.alternativeMethods?.[0]).toMatchObject({ id: "alt-recipe-1-1", nameEn: "Oven" })
  })

  it("rejects an invalid method with 400 and does not write", async () => {
    const response = await updateRecipeRoute(
      jsonRequest(
        "PATCH",
        { alternativeMethods: [{ nameEn: "Oven", nameAf: "Oond", steps: [] }] },
        "/api/recipes/recipe-1"
      ),
      patchContext
    )
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: "Alternative methods must include at least one step",
    })
    expect(replaceRecipe).not.toHaveBeenCalled()
  })

  it("ignores a non-array alternativeMethods value instead of clearing", async () => {
    const response = await updateRecipeRoute(
      jsonRequest("PATCH", { alternativeMethods: "oven" }, "/api/recipes/recipe-1"),
      patchContext
    )
    expect(response.status).toBe(200)
    const { recipe } = (await response.json()) as { recipe: RecipeRecord }
    expect(recipe.alternativeMethods).toEqual(existingMethods)
  })
})
