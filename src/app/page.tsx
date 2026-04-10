"use client";

import { useState } from "react";
import Link from "next/link";

type Brief = {
  business_summary: string;
  goals: string[];
  recommended_strategy: string[];
  budget_insight: string;
  next_steps: string[];
};

export default function HomePage() {
  const [form, setForm] = useState({
    name: "",
    businessType: "",
    goals: "",
    budget: "",
    location: "",
  });

  const [result, setResult] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Request failed");
      }

      setResult(data.aiBrief);
      setForm({
        name: "",
        businessType: "",
        goals: "",
        budget: "",
        location: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200";

  const labelClass = "text-sm font-medium text-gray-700";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
              BrandNovate Assessment
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              AI Client Intake Tool
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Capture new client details, generate an AI-powered onboarding
              brief, and save submissions for internal review.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Open Dashboard
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                New Client Intake
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Use this tool to capture new client details and generate a
                structured onboarding summary.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Client Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Olivia Bennett"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Business Type</label>
                <input
                  name="businessType"
                  value={form.businessType}
                  onChange={handleChange}
                  placeholder="e.g. Wellness Clinic"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Client Goals</label>
                <p className="mt-1 text-xs text-gray-500">
                  Include the client’s key priorities, challenges, or desired
                  outcomes.
                </p>
                <textarea
                  name="goals"
                  value={form.goals}
                  onChange={handleChange}
                  placeholder="e.g. Increase bookings, improve brand visibility, and generate more qualified leads"
                  className={`${inputClass} min-h-[130px] resize-none`}
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Budget Range</label>
                  <input
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="e.g. CAD 2,000 - CAD 5,000"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Toronto, Canada"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Generating Brief..." : "Generate AI Brief"}
                </button>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </form>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Generated Brief
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                The AI-generated onboarding summary will appear here after
                submission.
              </p>
            </div>

            {!result ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    No brief generated yet
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Submit a client intake form to view the onboarding summary.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Business Summary
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {result.business_summary}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Goals
                    </h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700">
                      {result.goals.map((item, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Recommended Strategy
                    </h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700">
                      {result.recommended_strategy.map((item, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Budget Insight
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {result.budget_insight}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Next Steps
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm text-gray-700">
                    {result.next_steps.map((item, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}