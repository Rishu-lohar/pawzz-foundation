
"use client";

import { useState } from "react";
import {
    PawPrint,
    Search,
    MapPin,
    ArrowRight,
    Menu,
    X,
    Activity,
    Building2,
    BedDouble,
    FlaskConical,
    Ambulance,
    HeartHandshake,
    Star,
    MapPinned,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const locations = ["Bengaluru", "Indore", "Delhi", "Mumbai", "Pune"];

const serviceOptions = [
    "All Services",
    "Veterinary Clinic",
    "Animal Hospital",
    "Pet Boarding",
    "Diagnostics",
    "Animal Ambulance",
    "Animal NGO",
];

const categories = [
    {
        title: "Veterinary Clinics",
        description: "Find experienced vets for regular checkups and medical care.",
        icon: Activity,
        count: "120+ Providers",
    },
    {
        title: "Animal Hospitals",
        description: "Discover advanced treatment and emergency medical facilities.",
        icon: Building2,
        count: "45+ Providers",
    },
    {
        title: "Pet Boarding",
        description: "Find safe and comfortable stays for your furry friends.",
        icon: BedDouble,
        count: "60+ Providers",
    },
    {
        title: "Diagnostics",
        description: "Access reliable animal laboratories and diagnostic services.",
        icon: FlaskConical,
        count: "35+ Providers",
    },
    {
        title: "Animal Ambulance",
        description: "Find emergency transportation and rescue assistance.",
        icon: Ambulance,
        count: "24/7 Support",
    },
    {
        title: "Animal Welfare NGOs",
        description: "Connect with organizations supporting animal rescue and welfare.",
        icon: HeartHandshake,
        count: "50+ Organizations",
    },
];

const providers = [
    {
        name: "Happy Paws Veterinary Clinic",
        type: "Veterinary Clinic",
        location: "Indiranagar, Bengaluru",
        rating: "4.8",
        reviews: "124 reviews",
        services: ["General Checkup", "Vaccination"],
        initials: "HP",
        isOpen24Hours: false,
    },
    {
        name: "PetCare Animal Hospital",
        type: "Animal Hospital",
        location: "Koramangala, Bengaluru",
        rating: "4.7",
        reviews: "98 reviews",
        services: ["Emergency Care", "Surgery"],
        initials: "PC",
        isOpen24Hours: true,
    },
    {
        name: "Furry Friends Boarding",
        type: "Pet Boarding",
        location: "Whitefield, Bengaluru",
        rating: "4.9",
        reviews: "76 reviews",
        services: ["Pet Boarding", "Pet Care"],
        initials: "FF",
        isOpen24Hours: false,
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: "easeOut" as const },
    },
};

const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.13,
        },
    },
};

export default function AnimalsPage() {
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [service, setService] = useState("All Services");
    const [menuOpen, setMenuOpen] = useState(false);
    const [open24HoursOnly, setOpen24HoursOnly] = useState(false);
    const [minimumRating, setMinimumRating] = useState("All Ratings");

    const [selectedProvider, setSelectedProvider] = useState<
        (typeof providers)[number] | null
    >(null);

    const handleSearch = () => {
        document.getElementById("providers")?.scrollIntoView({
            behavior: "smooth",
        });
    };

    const handleCategoryClick = (category: string) => {
        const categoryMap: Record<string, string> = {
            "Veterinary Clinics": "Veterinary Clinic",
            "Animal Hospitals": "Animal Hospital",
            "Pet Boarding": "Pet Boarding",
            Diagnostics: "Diagnostics",
            "Animal Ambulance": "Animal Ambulance",
            "Animal Welfare NGOs": "Animal NGO",
        };

        setService(categoryMap[category] || "All Services");

        document.getElementById("providers")?.scrollIntoView({
            behavior: "smooth",
        });
    };

    const clearFilters = () => {
        setKeyword("");
        setLocation("");
        setService("All Services");
        setOpen24HoursOnly(false);
        setMinimumRating("All Ratings");
    };

    const filteredProviders = providers.filter((provider) => {
        const searchText = keyword.toLowerCase().trim();

        const matchesKeyword =
            !searchText ||
            provider.name.toLowerCase().includes(searchText) ||
            provider.type.toLowerCase().includes(searchText) ||
            provider.location.toLowerCase().includes(searchText) ||
            provider.services.some((item) =>
                item.toLowerCase().includes(searchText)
            );

        const matchesLocation =
            !location ||
            provider.location.toLowerCase().includes(location.toLowerCase());

        const matchesService =
            service === "All Services" || provider.type === service;

        const matchesOpen24Hours =
            !open24HoursOnly || provider.isOpen24Hours;

        const matchesRating =
            minimumRating === "All Ratings" ||
            Number(provider.rating) >= Number(minimumRating);

        return (
            matchesKeyword &&
            matchesLocation &&
            matchesService &&
            matchesOpen24Hours &&
            matchesRating
        );
    });

    return (
        <main className="min-h-screen overflow-hidden bg-[#faf9ff] text-[#171b2a]">

            {/* NAVBAR */}

            <motion.header
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative z-50 border-b border-[#f0eff5] bg-white"
            >
                <div className="mx-auto flex h-[76px] max-w-[1420px] items-center justify-between px-6 lg:px-16">

                    <motion.a
                        href="/animals"
                        whileHover={{ scale: 1.04 }}
                        className="flex items-center gap-2"
                    >
                        <PawPrint
                            size={30}
                            strokeWidth={2.5}
                            className="text-[#4383ed]"
                        />

                        <span className="text-[23px] font-bold tracking-tight">
                            Pawzz<span className="text-[#4383ed]">Care</span>
                        </span>
                    </motion.a>

                    <nav className="hidden items-center gap-8 md:flex">
                        <a
                            href="/animals"
                            className="rounded-xl bg-[#edf2ff] px-4 py-2.5 text-sm font-medium text-[#4383ed]"
                        >
                            Home
                        </a>

                        <a
                            href="#listings"
                            className="text-sm font-medium text-gray-600 transition hover:text-[#4383ed]"
                        >
                            Listings
                        </a>

                        <a
                            href="#about"
                            className="text-sm font-medium text-gray-600 transition hover:text-[#4383ed]"
                        >
                            About
                        </a>
                    </nav>

                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        className="hidden rounded-xl bg-[#4383ed] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#326ed5] md:block"
                    >
                        Log In
                    </motion.button>

                    <button
                        className="text-gray-700 md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={25} /> : <Menu size={25} />}
                    </button>
                </div>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col gap-4 overflow-hidden border-t bg-white p-6 md:hidden"
                        >
                            <a href="/animals" onClick={() => setMenuOpen(false)}>
                                Home
                            </a>
                            <a href="#listings" onClick={() => setMenuOpen(false)}>
                                Listings
                            </a>
                            <a href="#about" onClick={() => setMenuOpen(false)}>
                                About
                            </a>
                            <button className="rounded-lg bg-[#4383ed] p-3 text-white">
                                Log In
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* HERO SECTION */}

            <section className="relative isolate overflow-hidden bg-[#f8f8ff]">

                {/* Decorative pet background icons */}

                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

                    <motion.div
                        className="absolute left-[5%] top-[15%] text-[#4383ed]/20"
                        animate={{ y: [0, -12, 0], rotate: [0, 12, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <PawPrint size={34} />
                    </motion.div>

                    <motion.div
                        className="absolute left-[43%] top-[10%] text-[#4383ed]/20"
                        animate={{ y: [0, 12, 0], x: [0, 8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <PawPrint size={25} />
                    </motion.div>

                    <motion.div
                        className="absolute right-[5%] top-[35%] text-[#4383ed]/15"
                        animate={{ y: [0, -14, 0], rotate: [0, -15, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <PawPrint size={42} />
                    </motion.div>

                    <motion.div
                        className="absolute left-[18%] bottom-[12%] text-[#4383ed]/15"
                        animate={{ y: [0, 12, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <PawPrint size={22} />
                    </motion.div>

                    <motion.div
                        className="absolute right-[35%] bottom-[15%] text-[#4383ed]/15"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <PawPrint size={28} />
                    </motion.div>

                    <motion.div
                        className="absolute left-[30%] top-[45%] text-[#4383ed]/10"
                        animate={{ rotate: [0, 20, 0], scale: [1, 1.15, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <HeartHandshake size={25} />
                    </motion.div>

                    <motion.div
                        className="absolute right-[18%] bottom-[8%] text-[#4383ed]/10"
                        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Activity size={25} />
                    </motion.div>
                </div>

                <div className="mx-auto grid min-h-[650px] max-w-[1220px] items-center gap-12 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">

                    {/* LEFT CONTENT */}

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="order-2 mx-auto w-full max-w-[610px] lg:order-1"
                    >
                        <motion.div
                            variants={fadeUp}
                            className="mb-6 inline-flex items-center rounded-full bg-[#e7ecfc] px-4 py-2 text-xs font-semibold text-[#36599f] sm:text-sm"
                        >
                            #1 Animal Care Discovery Platform
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            className="max-w-[610px] text-[42px] font-bold leading-[1.08] tracking-[-2px] text-[#171b2a] sm:text-5xl lg:text-[54px]"
                        >
                            Find the{" "}
                            <span className="text-[#4383ed]">
                                Perfect Care
                            </span>{" "}
                            for Your Pets
                        </motion.h1>

                        <motion.p
                            variants={fadeUp}
                            className="mt-5 max-w-[600px] text-base leading-[1.65] text-[#747b8c] sm:text-[17px]"
                        >
                            Discover top-rated veterinary clinics, animal hospitals,
                            boarding facilities and pet care services near you.
                            Connect with trusted professionals for your furry companions.
                        </motion.p>

                        {/* SEARCH BOX */}

                        <motion.div
                            variants={fadeUp}
                            className="mt-7 rounded-2xl border border-[#efedf5] bg-white p-3 shadow-[0_12px_40px_rgba(57,75,130,0.08)]"
                        >
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">

                                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-3">
                                    <Search size={19} className="shrink-0 text-[#7c8494]" />

                                    <input
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        placeholder="What are you looking for?"
                                        className="w-full min-w-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="flex items-center gap-2 rounded-xl border border-gray-100 px-3 py-3 lg:w-[150px]">
                                    <MapPin size={18} className="shrink-0 text-[#7c8494]" />

                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full min-w-0 cursor-pointer bg-transparent text-sm text-gray-600 outline-none"
                                    >
                                        <option value="">Select...</option>
                                        {locations.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2 rounded-xl border border-gray-100 px-3 py-3 lg:w-[165px]">
                                    <PawPrint size={17} className="shrink-0 text-[#7c8494]" />

                                    <select
                                        value={service}
                                        onChange={(e) => setService(e.target.value)}
                                        className="w-full min-w-0 cursor-pointer bg-transparent text-sm text-gray-600 outline-none"
                                    >
                                        {serviceOptions.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={handleSearch}
                                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#4383ed] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#326ed5]"
                                >
                                    Search
                                    <ArrowRight size={17} />
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* POPULAR LOCATIONS */}

                        <motion.div
                            variants={fadeUp}
                            className="mt-5 flex flex-wrap items-center gap-2"
                        >
                            <span className="mr-1 text-sm text-[#818798]">
                                Popular:
                            </span>

                            {["Bengaluru", "Indore", "Mumbai"].map((city) => (
                                <motion.button
                                    key={city}
                                    whileHover={{ y: -3, scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => setLocation(city)}
                                    className={`rounded-full px-4 py-2 text-xs font-medium transition ${location === city
                                        ? "bg-[#e5ebff] text-[#4383ed]"
                                        : "bg-[#f0f0f6] text-[#72798a] hover:bg-[#e5ebff] hover:text-[#4383ed]"
                                        }`}
                                >
                                    {city}
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* RIGHT VETERINARIAN IMAGE */}

                    <motion.div
                        initial={{ opacity: 0, x: 45, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                        className="order-1 mx-auto w-full max-w-[400px] lg:order-2"
                    >
                        <motion.div
                            animate={{ y: [0, -7, 0] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="relative isolate"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.035, 1] }}
                                transition={{
                                    duration: 7,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute -inset-4 -z-10 rounded-[28px] bg-[#e9edff] blur-xl opacity-90"
                            />

                            <motion.img
                                src="/images/vet-hero.png"
                                alt="Veterinarians caring for pets"
                                whileHover={{ scale: 1.025 }}
                                transition={{ duration: 0.4 }}
                                className="relative z-10 h-[350px] w-full rounded-[20px] object-contain sm:object-cover shadow-[0_12px_30px_rgba(57,75,130,0.14)] sm:h-[400px] lg:h-[450px]"
                            />
                        </motion.div>
                    </motion.div>

                </div>
            </section>

            {/* SERVICE CATEGORIES */}

            <section
                id="listings"
                className="bg-white px-6 py-20 lg:py-24"
            >
                <div className="mx-auto max-w-[1220px]">

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.25 }}
                        className="mb-12 text-center"
                    >
                        <motion.p
                            variants={fadeUp}
                            className="text-sm font-semibold uppercase tracking-[2px] text-[#4383ed]"
                        >
                            EXPLORE OUR SERVICES
                        </motion.p>

                        <motion.h2
                            variants={fadeUp}
                            className="mt-3 text-3xl font-bold tracking-tight text-[#171b2a] sm:text-4xl"
                        >
                            Find the Right Care for Your Pet
                        </motion.h2>

                        <motion.p
                            variants={fadeUp}
                            className="mx-auto mt-4 max-w-[600px] text-base leading-7 text-[#747b8c]"
                        >
                            Everything your furry companion needs, all in one place.
                            Discover trusted animal care services near you.
                        </motion.p>
                    </motion.div>

                    {/* CATEGORY GRID */}

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.12 }}
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {categories.map((category) => {
                            const Icon = category.icon;

                            return (
                                <motion.button
                                    type="button"
                                    key={category.title}
                                    variants={fadeUp}
                                    whileHover={{
                                        y: -7,
                                        transition: { duration: 0.25 },
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleCategoryClick(category.title)}
                                    className="group rounded-2xl border border-[#eeeef5] bg-white p-7 text-left transition-all duration-300 hover:border-[#cbdcff] hover:shadow-[0_15px_35px_rgba(57,75,130,0.09)]"
                                >
                                    <motion.div
                                        whileHover={{ rotate: 5, scale: 1.08 }}
                                        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf2ff] text-[#4383ed] transition group-hover:bg-[#4383ed] group-hover:text-white"
                                    >
                                        <Icon size={27} strokeWidth={1.8} />
                                    </motion.div>

                                    <h3 className="mt-6 text-lg font-bold text-[#171b2a]">
                                        {category.title}
                                    </h3>

                                    <p className="mt-2 min-h-[52px] text-sm leading-6 text-[#747b8c]">
                                        {category.description}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between">
                                        <span className="text-xs font-medium text-[#4383ed]">
                                            {category.count}
                                        </span>

                                        <motion.span
                                            whileHover={{ x: 5 }}
                                            className="text-[#4383ed]"
                                        >
                                            <ArrowRight size={18} />
                                        </motion.span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* FEATURED PROVIDERS */}

            <section
                id="providers"
                className="bg-[#f8f8ff] px-6 py-20 lg:py-24"
            >
                <div className="mx-auto max-w-[1220px]">

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.25 }}
                        className="mb-12 text-center"
                    >
                        <motion.p
                            variants={fadeUp}
                            className="text-sm font-semibold uppercase tracking-[2px] text-[#4383ed]"
                        >
                            TRUSTED ANIMAL CARE
                        </motion.p>

                        <motion.h2
                            variants={fadeUp}
                            className="mt-3 text-3xl font-bold tracking-tight text-[#171b2a] sm:text-4xl"
                        >
                            Featured Care Providers
                        </motion.h2>

                        <motion.p
                            variants={fadeUp}
                            className="mx-auto mt-4 max-w-[600px] text-base leading-7 text-[#747b8c]"
                        >
                            Explore animal care professionals and find the right
                            support for your furry companion.
                        </motion.p>
                    </motion.div>

                    {/* ADVANCED FILTERS */}

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#eeeef5] bg-white px-5 py-4 shadow-sm transition hover:border-[#cbdcff]">
                            <input
                                type="checkbox"
                                checked={open24HoursOnly}
                                onChange={(e) => setOpen24HoursOnly(e.target.checked)}
                                className="h-4 w-4 accent-[#4383ed]"
                            />

                            <span className="text-sm font-medium text-[#171b2a]">
                                Open 24 Hours
                            </span>
                        </label>

                        <div className="flex items-center gap-3 rounded-xl border border-[#eeeef5] bg-white px-5 py-3 shadow-sm transition hover:border-[#cbdcff]">
                            <Star size={18} className="text-[#F5B942]" />

                            <span className="text-sm font-medium text-[#171b2a]">
                                Minimum Rating
                            </span>

                            <select
                                value={minimumRating}
                                onChange={(e) => setMinimumRating(e.target.value)}
                                className="cursor-pointer bg-transparent text-sm font-medium text-[#4383ed] outline-none"
                            >
                                <option value="All Ratings">All Ratings</option>
                                <option value="4.0">4.0+</option>
                                <option value="4.5">4.5+</option>
                                <option value="4.8">4.8+</option>
                                <option value="4.9">4.9+</option>
                            </select>
                        </div>
                    </motion.div>

                    {/* PROVIDER CARDS */}

                    <motion.div
                        layout
                        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProviders.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    className="col-span-full rounded-2xl border border-[#eeeef5] bg-white px-6 py-16 text-center"
                                >
                                    <PawPrint
                                        size={36}
                                        className="mx-auto text-[#4383ed]"
                                    />

                                    <h3 className="mt-4 text-xl font-bold text-[#171b2a]">
                                        No Providers Found
                                    </h3>

                                    <p className="mt-2 text-sm text-[#747b8c]">
                                        Try changing your search keyword, location or service.
                                    </p>

                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={clearFilters}
                                        className="mt-5 rounded-xl bg-[#4383ed] px-5 py-3 text-sm font-semibold text-white hover:bg-[#326ed5]"
                                    >
                                        Clear Filters
                                    </motion.button>
                                </motion.div>
                            ) : (
                                filteredProviders.map((provider) => (
                                    <motion.div
                                        layout
                                        key={provider.name}
                                        initial={{ opacity: 0, y: 25 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: false, amount: 0.3 }}
                                        exit={{ opacity: 0, y: 15 }}
                                        transition={{ duration: 0.35 }}
                                        whileHover={{ y: -6 }}
                                        className="rounded-2xl border border-[#eeeef5] bg-white p-6 transition-shadow duration-300 hover:shadow-[0_15px_35px_rgba(57,75,130,0.08)]"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf2ff] text-xl font-bold text-[#4383ed]">
                                                {provider.initials}
                                            </div>

                                            <span className="rounded-full bg-[#eaf8ef] px-3 py-1 text-xs font-semibold text-[#27834c]">
                                                Listed
                                            </span>
                                        </div>

                                        <h3 className="mt-5 text-lg font-bold text-[#171b2a]">
                                            {provider.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-[#4383ed]">
                                            {provider.type}
                                        </p>

                                        <div className="mt-4 flex items-center gap-2 text-sm text-[#747b8c]">
                                            <MapPinned size={16} />
                                            {provider.location}
                                        </div>

                                        <div className="mt-4 flex items-center gap-2">
                                            <Star
                                                size={17}
                                                fill="#F5B942"
                                                className="text-[#F5B942]"
                                            />

                                            <span className="text-sm font-semibold text-[#171b2a]">
                                                {provider.rating}
                                            </span>

                                            <span className="text-xs text-[#8a90a0]">
                                                ({provider.reviews})
                                            </span>
                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {provider.services.map((item) => (
                                                <span
                                                    key={item}
                                                    className="rounded-full bg-[#f1f3fa] px-3 py-1.5 text-xs text-[#646d80]"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>

                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.025 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setSelectedProvider(provider)}
                                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#4383ed] py-3 text-sm font-semibold text-[#4383ed] transition hover:bg-[#4383ed] hover:text-white"
                                        >
                                            View Details
                                            <ArrowRight size={16} />
                                        </motion.button>

                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <p className="mt-6 text-center text-xs text-[#8a90a0]">
                        Illustrative demo listings. Provider details and ratings
                        are sample data, not verified business records.
                    </p>
                </div>
            </section>

            {/* PROVIDER DETAILS MODAL */}

            <AnimatePresence>
                {selectedProvider && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#171b2a]/50 p-4 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProvider(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 35, scale: 0.94 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.96 }}
                            transition={{ duration: 0.25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedProvider(null)}
                                className="absolute right-5 top-5 rounded-full bg-[#f1f3fa] p-2 text-gray-600 transition hover:bg-[#e5ebff] hover:text-[#4383ed]"
                                aria-label="Close provider details"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf2ff] text-2xl font-bold text-[#4383ed]">
                                {selectedProvider.initials}
                            </div>

                            <h2 className="mt-5 pr-8 text-2xl font-bold text-[#171b2a]">
                                {selectedProvider.name}
                            </h2>

                            <p className="mt-1 text-sm font-medium text-[#4383ed]">
                                {selectedProvider.type}
                            </p>

                            <div className="mt-5 flex items-center gap-2 text-sm text-[#747b8c]">
                                <MapPinned size={18} />
                                {selectedProvider.location}
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <Star size={18} fill="#F5B942" className="text-[#F5B942]" />
                                <span className="font-semibold text-[#171b2a]">
                                    {selectedProvider.rating}
                                </span>
                                <span className="text-sm text-[#8a90a0]">
                                    ({selectedProvider.reviews})
                                </span>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-semibold text-[#171b2a]">
                                    Available Services
                                </h3>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedProvider.services.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full bg-[#edf2ff] px-4 py-2 text-sm text-[#4383ed]"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl bg-[#f7f8fc] p-4">
                                <p className="text-sm font-medium text-[#171b2a]">
                                    Availability
                                </p>
                                <p className="mt-1 text-sm text-[#747b8c]">
                                    {selectedProvider.isOpen24Hours
                                        ? "Open 24 Hours"
                                        : "Regular operating hours"}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedProvider(null)}
                                className="mt-7 w-full rounded-xl bg-[#4383ed] py-3.5 text-sm font-semibold text-white transition hover:bg-[#326ed5]"
                            >
                                Close Details
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ABOUT */}

            <motion.section
                id="about"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.65 }}
                className="bg-white px-6 py-16 text-center"
            >
                <h2 className="text-2xl font-bold text-[#171b2a]">
                    Better Care for Every Paw
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#747b8c]">
                    PawzzCare aims to connect pet parents with trusted animal
                    care services and organizations, making animal welfare
                    more accessible.
                </p>
            </motion.section>

            {/* FOOTER */}

            <footer className="border-t border-[#f0eff5] bg-white px-6 py-8">
                <div className="mx-auto flex max-w-[1220px] flex-col items-center justify-between gap-4 sm:flex-row">

                    <div className="flex items-center gap-2">
                        <PawPrint size={22} className="text-[#4383ed]" />

                        <span className="font-bold text-[#171b2a]">
                            Pawzz<span className="text-[#4383ed]">Care</span>
                        </span>
                    </div>

                    <p className="text-center text-xs text-[#8a90a0]">
                        © 2026 PawzzCare. A concept prototype for Pawzz Foundation.
                    </p>
                </div>
            </footer>
        </main>
    );
}
