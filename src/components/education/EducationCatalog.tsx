"use client";

import { useState } from "react";
import CourseCard from "@/components/education/CourseCard";
import CategoryFilter from "@/components/education/CategoryFilter";
// import { COURSES } from "@/data/education"; // Mock removed
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function EducationCatalog({ initialCourses }: { initialCourses: any[] }) {
    const [activeCategory, setActiveCategory] = useState("Tümü");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCourses = initialCourses.filter(course => {
        // Mock category logic since DB doesn't have categories yet
        const matchesCategory = activeCategory === "Tümü" || true;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col min-h-screen">
            {/* HERO SECTION */}
            <section className="relative py-12 md:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 to-bg-primary pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-green/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        Finansal Okuryazarlık <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-emerald-400">Akademisi</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">
                        Uzmanlardan en güncel borsa, kripto para ve teknik analiz eğitimleri ile finansal özgürlüğüne adım at.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-0 bg-accent-green/20 blur-xl group-hover:bg-accent-green/30 transition-all opacity-50 rounded-full" />
                        <div className="relative bg-bg-surface border border-border-subtle rounded-full flex items-center p-2 shadow-2xl">
                            <MagnifyingGlassIcon className="w-6 h-6 text-text-muted ml-3" />
                            <input
                                type="text"
                                placeholder="Eğitim, konu veya eğitmen ara..."
                                className="flex-1 bg-transparent border-none outline-none text-text-primary px-4 placeholder:text-text-muted h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="bg-accent-green hover:bg-emerald-500 text-text-primary px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105">
                                Ara
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT CONTAINER */}
            <div className="px-4 md:px-6 lg:px-8 pb-24 w-full">
                {/* Categories */}
                <div className="mb-8">
                    <CategoryFilter activeCategory={activeCategory} onSelect={setActiveCategory} />
                </div>

                {/* Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-border-subtle rounded-2xl bg-bg-surface/50">
                        <p className="text-lg text-text-muted">Aradığınız kriterlere uygun eğitim bulunamadı.</p>
                        <button
                            onClick={() => { setActiveCategory("Tümü"); setSearchQuery(""); }}
                            className="mt-4 text-accent-green hover:underline font-medium"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
