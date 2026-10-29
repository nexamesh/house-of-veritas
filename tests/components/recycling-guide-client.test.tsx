import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import RecyclingGuideClient from "@/components/recycling/recycling-guide-client"

describe("RecyclingGuideClient", () => {
  it("filters materials and calculates an indicative quoted value", () => {
    render(<RecyclingGuideClient />)

    fireEvent.click(screen.getByRole("button", { name: "Metal" }))
    expect(screen.getByRole("heading", { name: "Copper" })).toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "HDPE" })).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText("Material"), { target: { value: "aluminium" } })
    fireEvent.change(screen.getByLabelText("Weight (kg)"), { target: { value: "2" } })
    expect(screen.getByText(/28,00/)).toBeInTheDocument()
  })

  it("does not imply an unpublished PVC price", () => {
    render(<RecyclingGuideClient />)
    expect(screen.getByRole("img", { name: "Plastic code 1" })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText("Material"), { target: { value: "pvc" } })
    fireEvent.change(screen.getByLabelText("Weight (kg)"), { target: { value: "4" } })
    expect(
      screen.getByText("No material-specific quote in this buyer snapshot.")
    ).toBeInTheDocument()
  })
})
