"use client";

const PLANS = [
  {
    duration: "1 Saac",
    durationEn: "1 Hour",
    price: "$0.50",
    features: [
      "Fully charged power bank",
      "Compatible with all phones",
      "Lightning + USB-C + Micro USB",
      "Return at any station",
    ],
    popular: false,
  },
  {
    duration: "2 Saac",
    durationEn: "2 Hours",
    price: "$1.00",
    features: [
      "Fully charged power bank",
      "Compatible with all phones",
      "Lightning + USB-C + Micro USB",
      "Return at any station",
      "Best value for longer use",
    ],
    popular: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-pink-500">
            Simple Pricing
          </p>
          <h2 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
            Affordable Power
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
            No hidden fees. No subscriptions. Just pay for the time you need.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.duration}
              className={`relative overflow-hidden rounded-3xl border-2 p-8 shadow-sm transition-all hover:shadow-lg ${
                plan.popular
                  ? "border-pink-500 bg-white"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-1.5 text-xs font-bold text-white">
                  Popular
                </div>
              )}

              <p className="text-sm font-bold text-gray-500">
                {plan.durationEn}
              </p>
              <p className="mt-1 text-lg font-black text-pink-500">
                {plan.duration}
              </p>

              <p className="mt-4 text-5xl font-black text-gray-900">
                {plan.price}
              </p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs text-pink-600">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Pay using <strong>EVC Plus</strong>, <strong>ZAAD</strong>, or{" "}
          <strong>SAHAL</strong> — no cash needed.
        </p>
      </div>
    </section>
  );
}
