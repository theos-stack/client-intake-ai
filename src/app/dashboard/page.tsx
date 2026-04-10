"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Submission = {
    _id: string;
    name: string;
    businessType: string;
    goals: string;
    budget: string;
    location: string;
    createdAt: string;
    aiBrief: {
        business_summary: string;
        goals: string[];
        recommended_strategy: string[];
        budget_insight: string;
        next_steps: string[];
    };
};

export default function DashboardPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [businessFilter, setBusinessFilter] = useState("All");
    const [locationFilter, setLocationFilter] = useState("All");

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await fetch("/api/submissions");
                const data = await res.json();
                setSubmissions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const businessTypes = useMemo(() => {
        return [
            "All",
            ...Array.from(new Set(submissions.map((item) => item.businessType))).sort(),
        ];
    }, [submissions]);

    const locations = useMemo(() => {
        return [
            "All",
            ...Array.from(new Set(submissions.map((item) => item.location))).sort(),
        ];
    }, [submissions]);

    const filteredSubmissions = useMemo(() => {
        return submissions.filter((item) => {
            const query = search.toLowerCase();

            const matchesSearch =
                item.name.toLowerCase().includes(query) ||
                item.businessType.toLowerCase().includes(query) ||
                item.location.toLowerCase().includes(query) ||
                item.goals.toLowerCase().includes(query) ||
                item.aiBrief.business_summary.toLowerCase().includes(query);

            const matchesBusiness =
                businessFilter === "All" || item.businessType === businessFilter;

            const matchesLocation =
                locationFilter === "All" || item.location === locationFilter;

            return matchesSearch && matchesBusiness && matchesLocation;
        });
    }, [submissions, search, businessFilter, locationFilter]);

    const inputClass =
        "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200";

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
                            Internal Review
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                            Submission Dashboard
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-gray-600">
                            Review saved client submissions, search records, and filter by business type or location.
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        Back to Intake
                    </Link>
                </div>

                <section className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-3">
                        <input
                            type="text"
                            placeholder="Search by client name, business type, goals, or summary"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={inputClass}
                        />

                        <select
                            value={businessFilter}
                            onChange={(e) => setBusinessFilter(e.target.value)}
                            className={inputClass}
                        >
                            {businessTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>

                        <select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className={inputClass}
                        >
                            {locations.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="rounded-full bg-gray-100 px-3 py-1">
                            Total submissions: {submissions.length}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1">
                            Showing: {filteredSubmissions.length}
                        </span>
                    </div>
                </section>

                {loading ? (
                    <div className="rounded-3xl border border-gray-200 bg-white p-10 text-sm text-gray-600 shadow-sm">
                        Loading submissions...
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    <div className="rounded-3xl border border-gray-200 bg-white p-10 text-sm text-gray-600 shadow-sm">
                        No matching submissions found.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredSubmissions.map((item) => (
                            <article
                                key={item._id}
                                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {item.name}
                                        </h2>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                {item.businessType}
                                            </span>
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                {item.location}
                                            </span>
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                {new Date(item.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                                        <span className="font-semibold text-gray-900">Budget:</span>{" "}
                                        {item.budget}
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                                    <div className="rounded-2xl bg-gray-50 p-4">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Client Goals
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-gray-700">
                                            {item.goals}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-gray-50 p-4">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Business Summary
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-gray-700">
                                            {item.aiBrief.business_summary}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                                    <div className="rounded-2xl bg-gray-50 p-4">
                                        <h3 className="text-sm font-semibold text-gray-900">Goals</h3>
                                        <ul className="mt-2 space-y-2 text-sm text-gray-700">
                                            {item.aiBrief.goals.map((goal, index) => (
                                                <li key={index} className="flex gap-2">
                                                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-500" />
                                                    <span>{goal}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="rounded-2xl bg-gray-50 p-4">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Recommended Strategy
                                        </h3>
                                        <ul className="mt-2 space-y-2 text-sm text-gray-700">
                                            {item.aiBrief.recommended_strategy.map((strategy, index) => (
                                                <li key={index} className="flex gap-2">
                                                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-500" />
                                                    <span>{strategy}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="rounded-2xl bg-gray-50 p-4">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Next Steps
                                        </h3>
                                        <ul className="mt-2 space-y-2 text-sm text-gray-700">
                                            {item.aiBrief.next_steps.map((step, index) => (
                                                <li key={index} className="flex gap-2">
                                                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-500" />
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Budget Insight
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-gray-700">
                                        {item.aiBrief.budget_insight}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}