"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { ArrowUpRight, CircleHelp, Recycle, Scale } from "lucide-react"
import {
  estimateRecyclingCents,
  PRICE_CHECKED_AT,
  RECYCLING_MATERIALS,
  RECYCLING_SOURCES,
  type RecyclingGroup,
} from "@/lib/recycling-guide"

const GROUPS: ("All" | RecyclingGroup)[] = ["All", "Plastic", "Metal", "Glass"]
const rand = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" })

export default function RecyclingGuideClient() {
  const [group, setGroup] = useState<(typeof GROUPS)[number]>("All")
  const [materialId, setMaterialId] = useState("pet")
  const [weight, setWeight] = useState("")
  const materials = useMemo(
    () => RECYCLING_MATERIALS.filter((material) => group === "All" || material.group === group),
    [group]
  )
  const selected = RECYCLING_MATERIALS.find((material) => material.id === materialId)!
  const kg = weight.trim() === "" ? NaN : Number(weight)
  const estimate = estimateRecyclingCents(selected.priceCentsPerKg, kg)
  const estimateLabel =
    selected.priceCentsPerKg === null
      ? "Ask the buyer"
      : estimate === null
        ? "—"
        : rand.format(estimate / 100)

  return (
    <div className="relative z-10 space-y-8 pb-12 text-white">
      <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[#162822] shadow-2xl">
        <Image
          src="/images/recycling/hero.webp"
          alt="Illustration of sorted plastic, metal and glass recyclable items"
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10221e] via-[#10221ee8] to-[#10221e22]" />
        <div className="relative max-w-2xl px-6 py-10 sm:px-10 sm:py-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-emerald-200 uppercase">
            <Recycle size={14} /> Household guide
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Know the material.
            <br />
            <span className="text-emerald-300">Sort for value.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
            Learn what PET, HDPE and the other plastic codes mean, compare metals and glass, and
            estimate an indicative South African buyback value.
          </p>
          <p className="mt-5 text-xs text-white/65">
            Illustrative images · Buyer prices checked {PRICE_CHECKED_AT}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Sorting basics">
        {[
          [
            "01",
            "Find the code",
            "Read the number and polymer abbreviation on the item. Shape and colour alone can mislead.",
          ],
          [
            "02",
            "Clean & separate",
            "Empty and rinse containers, dry film, and keep different materials in their own bags.",
          ],
          [
            "03",
            "Check your buyer",
            "Acceptance, grades and payout depend on your local collector and the condition at weigh-in.",
          ],
        ].map(([number, title, body]) => (
          <div key={number} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <span className="text-sm font-bold text-emerald-300">{number}</span>
            <h2 className="mt-2 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">{body}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="materials-heading" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-emerald-300 uppercase">
              Material library
            </p>
            <h2 id="materials-heading" className="mt-1 text-2xl font-bold sm:text-3xl">
              Compare grades and types
            </h2>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filter materials">
            {GROUPS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={group === option}
                onClick={() => setGroup(option)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 ${group === option ? "border-emerald-300 bg-emerald-300 text-[#10221e]" : "border-white/20 bg-white/5 text-white/75 hover:bg-white/10"}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        {(group === "All" || group === "Plastic") && (
          <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:flex">
            <div className="relative h-52 md:h-auto md:w-1/3">
              <Image
                src="/images/recycling/plastics.webp"
                alt="Illustration of a PET bottle, HDPE jug, PP tub and LDPE film bag"
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover"
              />
            </div>
            <figcaption className="p-5 md:flex-1 md:p-7">
              <h3 className="font-semibold">PET and HDPE are different plastics</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Code 1 PET commonly forms drink bottles. Code 2 HDPE often forms opaque milk or
                detergent bottles. Code 4 LDPE is frequently flexible film; code 5 PP is common in
                tubs and caps. The pictures are examples: always read the item’s marking.
              </p>
              <a
                className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-300 hover:underline"
                href={RECYCLING_SOURCES.codes}
                target="_blank"
                rel="noopener noreferrer"
              >
                Plastics SA code guide <ArrowUpRight size={14} />
              </a>
            </figcaption>
          </figure>
        )}
        {(group === "Metal" || group === "Glass") && (
          <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:flex">
            <div className="relative h-52 md:h-auto md:w-1/3">
              <Image
                src="/images/recycling/metals-glass.webp"
                alt="Illustration of copper wire, aluminium cans, steel offcuts and glass bottles"
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover"
              />
            </div>
            <figcaption className="p-5 md:flex-1 md:p-7">
              <h3 className="font-semibold">Separate metal and glass streams</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Clean copper, aluminium cans and steel cans are distinct grades with very different
                values. A magnet can help identify ordinary ferrous steel; a yard confirms the final
                grade. Glass bottles may need sorting by colour.
              </p>
            </figcaption>
          </figure>
        )}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {materials.map((material) => (
            <article
              key={material.id}
              className="rounded-2xl border border-white/10 bg-[#1c2626] p-5 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {material.code ? (
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/40 bg-emerald-300/10 text-xl font-bold text-emerald-200"
                      role="img"
                      aria-label={`Plastic code ${material.code}`}
                    >
                      {material.code}
                    </span>
                  ) : (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200">
                      <Recycle size={22} />
                    </span>
                  )}
                  <div>
                    <p className="text-xs tracking-widest text-white/50 uppercase">
                      {material.group}
                    </p>
                    <h3 className="text-lg font-semibold">{material.name}</h3>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70">
                  {material.priceCentsPerKg === null
                    ? "Ask buyer"
                    : `${rand.format(material.priceCentsPerKg / 100)}/kg`}
                </span>
              </div>
              <p className="mt-3 text-sm text-emerald-200/80">{material.fullName}</p>
              <dl className="mt-4 space-y-3 text-sm leading-5">
                <div>
                  <dt className="font-semibold text-white/85">Typical items</dt>
                  <dd className="mt-1 text-white/65">{material.examples}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white/85">Sort it</dt>
                  <dd className="mt-1 text-white/65">{material.sorting}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white/85">Local acceptance</dt>
                  <dd className="mt-1 text-white/65">{material.acceptance}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        <p className="flex items-start gap-2 text-sm text-white/60">
          <CircleHelp className="mt-0.5 shrink-0" size={16} />
          The code identifies the main polymer. It does not promise that every item or every code is
          accepted nearby.
        </p>
      </section>

      <section
        className="grid gap-6 rounded-3xl border border-emerald-300/20 bg-[#142d27] p-6 lg:grid-cols-[1fr_1fr] lg:p-8"
        aria-labelledby="estimate-heading"
      >
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-emerald-300 uppercase">
            Buyer snapshot
          </p>
          <h2 id="estimate-heading" className="mt-2 flex items-center gap-2 text-2xl font-bold">
            <Scale className="text-emerald-300" /> Estimate a payout
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-white/70">
            These rates are published by WasteGo Green’s Milnerton buyback centre and were checked
            on {PRICE_CHECKED_AT}. They are one buyer’s indicative rates, not live prices or a
            national tariff. Confirm the current rate and accepted grade before travelling.
          </p>
          <a
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-300 hover:underline"
            href={RECYCLING_SOURCES.prices}
            target="_blank"
            rel="noopener noreferrer"
          >
            View the buyer’s prices <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Material
              <select
                value={materialId}
                onChange={(event) => setMaterialId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/20 bg-[#203a33] px-3 py-2.5 text-white focus-visible:outline-2 focus-visible:outline-emerald-300"
              >
                {RECYCLING_MATERIALS.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Weight (kg)
              <input
                type="number"
                min="0"
                step="0.1"
                inputMode="decimal"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                placeholder="e.g. 5"
                className="mt-2 w-full rounded-lg border border-white/20 bg-[#203a33] px-3 py-2.5 text-white placeholder:text-white/35 focus-visible:outline-2 focus-visible:outline-emerald-300"
              />
            </label>
          </div>
          <div aria-live="polite" className="mt-5 border-t border-white/15 pt-5">
            <p className="text-sm text-white/65">Indicative payout</p>
            <p className="mt-1 text-3xl font-bold text-emerald-300">{estimateLabel}</p>
            <p className="mt-2 text-xs text-white/55">
              {selected.priceCentsPerKg === null
                ? "No material-specific quote in this buyer snapshot."
                : weight.trim() === ""
                  ? "Enter a weight to calculate."
                  : !Number.isFinite(kg) || kg < 0
                    ? "Enter a valid weight of 0 kg or more."
                    : "Actual payout depends on inspection, contamination and the day’s rate."}
            </p>
          </div>
        </div>
      </section>

      <footer className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/65">
        <h2 className="font-semibold text-white">Sources and next step</h2>
        <p className="mt-2">
          Material codes:{" "}
          <a
            className="text-emerald-300 underline"
            href={RECYCLING_SOURCES.codes}
            target="_blank"
            rel="noopener noreferrer"
          >
            Plastics SA
          </a>
          . Local acceptance:{" "}
          <a
            className="text-emerald-300 underline"
            href={RECYCLING_SOURCES.acceptance}
            target="_blank"
            rel="noopener noreferrer"
          >
            Petco FAQs
          </a>
          . Indicative price snapshot:{" "}
          <a
            className="text-emerald-300 underline"
            href={RECYCLING_SOURCES.prices}
            target="_blank"
            rel="noopener noreferrer"
          >
            WasteGo Green
          </a>
          . Find a nearby point in{" "}
          <a
            className="text-emerald-300 underline"
            href={RECYCLING_SOURCES.centres}
            target="_blank"
            rel="noopener noreferrer"
          >
            Petco’s buyback directory
          </a>
          .
        </p>
        <p className="mt-2">
          Images are AI-generated illustrations of example items. They are not identification
          evidence for a particular product.
        </p>
      </footer>
    </div>
  )
}
