import { describe, expect, it } from "vitest"
import { estimateRecyclingCents, RECYCLING_MATERIALS } from "@/lib/recycling-guide"

describe("recycling guide", () => {
  it("lists each resin identification code once", () => {
    expect(
      RECYCLING_MATERIALS.filter((material) => material.group === "Plastic").map(
        (material) => material.code
      )
    ).toEqual(["1", "2", "3", "4", "5", "6", "7"])
  })

  it("calculates the quoted payout in cents and rounds once", () => {
    expect(estimateRecyclingCents(300, 1.25)).toBe(375)
    expect(estimateRecyclingCents(40, 0.33)).toBe(13)
    expect(estimateRecyclingCents(300, 0)).toBe(0)
  })

  it("does not invent prices or accept invalid weights", () => {
    expect(estimateRecyclingCents(null, 5)).toBeNull()
    expect(estimateRecyclingCents(300, -1)).toBeNull()
    expect(estimateRecyclingCents(300, NaN)).toBeNull()
    expect(estimateRecyclingCents(300, Infinity)).toBeNull()
    expect(estimateRecyclingCents(300, 1e308)).toBeNull()
  })
})
