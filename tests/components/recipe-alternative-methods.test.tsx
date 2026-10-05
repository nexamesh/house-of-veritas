import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import RecipeCatalogClient from "@/components/recipes/recipe-catalog-client"
import { apiFetch } from "@/lib/api-client"
import type { RecipeRecord } from "@/lib/recipes"

vi.mock("@/lib/api-client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/api-client")>()),
  apiFetch: vi.fn(),
}))

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({ user: { id: "charl", role: "operator" } }),
}))

const baseRecipe: RecipeRecord = {
  id: "recipe-alt",
  status: "published",
  ownerUserId: "hans",
  audienceUserIds: ["hans", "charl"],
  titleEn: "Jacket potatoes",
  titleAf: "Gebakte aartappels",
  image: {
    url: "https://example.com/potato.jpg",
    source: "Example library",
    license: "CC BY 4.0",
    attributionText: "Example cook",
    retrievedAt: "2026-07-31",
  },
  ingredients: [{ id: "ing-1", name: "Potatoes" }],
  steps: [{ id: "s1", order: 1, instructionEn: "Bake it.", instructionAf: "Bak dit." }],
  alternativeMethods: [
    {
      id: "alt-1",
      nameEn: "Air fryer",
      nameAf: "Lugbraaier",
      summaryEn: "Faster.",
      summaryAf: "Vinniger.",
      steps: [
        {
          id: "alt-1-s2",
          order: 2,
          instructionEn: "Fill and serve.",
          instructionAf: "Vul en bedien.",
        },
        {
          id: "alt-1-s1",
          order: 1,
          timerMinutes: 40,
          instructionEn: "Air fry the potatoes.",
          instructionAf: "Lugbraai die aartappels.",
        },
      ],
    },
  ],
  createdAt: "2026-07-28T09:00:00.000Z",
  updatedAt: "2026-07-29T09:00:00.000Z",
}

function mockApi(recipe: RecipeRecord) {
  vi.mocked(apiFetch).mockImplementation(async (url: string) => {
    if (url.startsWith("/api/recipes?")) return { recipes: [recipe] }
    return { mealInstances: [] }
  })
}

async function renderSection(recipe: RecipeRecord = baseRecipe) {
  mockApi(recipe)
  render(<RecipeCatalogClient persona="charl" />)
  return waitFor(() => screen.getByTestId("alternative-methods")).then((el) => within(el))
}

describe("RecipeCatalogClient alternative methods", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset()
  })

  it("shows both languages by default with steps ordered and timers shown", async () => {
    const section = await renderSection()

    expect(section.getByText("Air fryer / Lugbraaier")).toBeInTheDocument()
    expect(section.getByText("Faster. / Vinniger.")).toBeInTheDocument()
    const items = section.getAllByRole("listitem")
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent("Step 1")
    expect(items[0]).toHaveTextContent("Air fry the potatoes.")
    expect(items[0]).toHaveTextContent("Lugbraai die aartappels.")
    expect(items[0]).toHaveTextContent("Timer: 40 min")
    expect(items[1]).toHaveTextContent("Step 2")
    expect(items[1]).not.toHaveTextContent("Timer:")
  })

  it("shows only English or only Afrikaans when the language toggle changes", async () => {
    const user = userEvent.setup()
    const section = await renderSection()

    await user.click(screen.getByRole("button", { name: "EN" }))
    expect(section.getByText("Air fryer")).toBeInTheDocument()
    expect(section.getByText("Faster.")).toBeInTheDocument()
    expect(section.queryByText(/Lugbraaier/)).not.toBeInTheDocument()
    expect(section.queryByText(/Lugbraai die/)).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "AF" }))
    expect(section.getByText("Lugbraaier")).toBeInTheDocument()
    expect(section.getByText("Vinniger.")).toBeInTheDocument()
    expect(section.queryByText(/Air fryer/)).not.toBeInTheDocument()
    expect(section.queryByText(/Air fry the/)).not.toBeInTheDocument()
  })

  it("does not render the section when a recipe has no alternative methods", async () => {
    mockApi({ ...baseRecipe, alternativeMethods: [] })
    render(<RecipeCatalogClient persona="charl" />)

    await screen.findAllByText(/Jacket potatoes/)
    expect(screen.queryByTestId("alternative-methods")).not.toBeInTheDocument()
  })
})
