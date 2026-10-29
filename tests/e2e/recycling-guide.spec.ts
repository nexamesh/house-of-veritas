import { expect, test } from "@playwright/test"
import { seedSession } from "./helpers/auth"

test("authenticated household guide filters materials and estimates a buyer quote", async ({ context, page }) => {
  await seedSession(context, { id: "hans", role: "admin", email: "hans@example.test" })
  await page.goto("/dashboard/hans/recycling")

  await expect(page.getByRole("heading", { name: /Know the material/i })).toBeVisible()
  await expect(page.getByRole("link", { name: "Recycling" }).first()).toHaveAttribute("href", "/dashboard/hans/recycling")
  await page.getByRole("button", { name: "Metal", exact: true }).click()
  await expect(page.getByRole("heading", { name: "Copper" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "HDPE" })).toHaveCount(0)

  await page.getByLabel("Material").selectOption("aluminium")
  await page.getByLabel("Weight (kg)").fill("2")
  await expect(page.getByText(/28,00/)).toBeVisible()
})
