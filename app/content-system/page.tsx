
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FolderKanban,
    Workflow,
    PanelsTopLeft,
    Download,
    Plus,
    Sparkles,
    Search,
    Bell,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Check,
    Clock3,
    Heart,
    PawPrint,
    WandSparkles,
    FileText,
    Image as ImageIcon,
    Type,
    Palette,
    MoreHorizontal,
    ArrowUpRight,
    Eye,
    RefreshCw,
    Pencil,
    CheckCircle2,
    Menu,
    X,
} from "lucide-react";

type Slide = {
    id: number;
    label: string;
    title: string;
    body: string;
    footer: string;
    background: string;
    visualDirection?: string;
};

const initialSlides: Slide[] = [
    {"id": 1, "label": "Cover", "title": "Is your furry friend ready for the vet?", "body": "Let’s turn a routine checkup into a smooth, stress‑free experience for both of you!", "footer": "PAWZZ FOUNDATION · PET WELLNESS", "background": "bg-[#e9efff]", "visualDirection": "Bright, eye‑catching image of a happy pet in a carrier"},
    {"id": 2, "label": "Slide 2", "title": "Step 1: Make the carrier a favorite", "body": "Use the same carrier at home. Fill it with a cozy blanket and a favorite treat to create positive associations.", "footer": "PAWZZ FOUNDATION · PET WELLNESS", "background": "bg-[#e8f5ee]", "visualDirection": "Photo of a carrier with a blanket and treat"},
    {"id": 3, "label": "Slide 3", "title": "Step 2: Practice gentle handling", "body": "Daily, touch your pet’s paws, ears, and mouth for a few seconds. Keep it short, praise, and reward. Repeat until they’re comfortable.", "footer": "PAWZZ FOUNDATION · PET WELLNESS", "background": "bg-[#fff2e6]", "visualDirection": "Illustration of a hand gently touching a pet’s paw"},
    {"id": 4, "label": "Slide 4", "title": "Step 3: Schedule a pre‑check visit", "body": "Bring medical records, ask questions, and let the vet see your pet in a relaxed setting. It builds trust before the big day.", "footer": "PAWZZ FOUNDATION · PET WELLNESS", "background": "bg-[#f2ebff]", "visualDirection": "Image of a calendar with a vet appointment highlighted"},
    {"id": 5, "label": "CTA", "title": "Step 4: Celebrate the visit", "body": "After the exam, give a treat, play, or a gentle petting session. Positive reinforcement makes future visits easier.", "footer": "PAWZZ FOUNDATION · PET WELLNESS", "background": "bg-[#e8f4fa]", "visualDirection": "Picture of a pet receiving a treat with a happy owner"}
];

const workflowSteps = [
    { title: "Research & insights", detail: "Understanding the topic and audience", icon: Search },
    { title: "Content structure", detail: "Organising the key message", icon: FileText },
    { title: "Headline & copy", detail: "Creating slide-by-slide content", icon: Type },
    { title: "Visual direction", detail: "Selecting layouts, colours and style", icon: Palette },
    { title: "Carousel design", detail: "Preparing editable slide designs", icon: PanelsTopLeft },
    { title: "Review & export", detail: "Final review and publishing", icon: Download },
];

const navItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Projects", icon: FolderKanban },
    { label: "AI Workflow", icon: Workflow },
    { label: "Carousel Editor", icon: PanelsTopLeft },
    { label: "Exports", icon: Download },
];

export default function ContentSystemPage() {
    const [activeNav, setActiveNav] = useState("Overview");
    const [platform, setPlatform] = useState("Instagram");
    const [idea, setIdea] = useState("");
    const [audience, setAudience] = useState("Pet parents");
    const [tone, setTone] = useState("Friendly & educational");
    const [slideCount, setSlideCount] = useState("7");
    const [slides, setSlides] = useState<Slide[]>(initialSlides);
    const [activeSlide, setActiveSlide] = useState(0);
    const [generated, setGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [approved, setApproved] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [projectName, setProjectName] = useState("Get Your Pet Ready for a Vet Visit");
    const [activeWorkflowStep, setActiveWorkflowStep] = useState(-1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [workflowOutputs, setWorkflowOutputs] = useState<string[]>([]);
    const [generationError, setGenerationError] = useState("");
    const [canvaJobId, setCanvaJobId] = useState("");
    const [canvaStatus, setCanvaStatus] = useState("");
    const [canvaAuthUrl, setCanvaAuthUrl] = useState("");
    const [canvaEditUrl, setCanvaEditUrl] = useState("");
    const [canvaThumbnails, setCanvaThumbnails] = useState<string[]>([]);
    const [canvaError, setCanvaError] = useState("");
    const [canvaExportMessage, setCanvaExportMessage] = useState("");
    const [existingCanvaUrl, setExistingCanvaUrl] = useState("");
    const [carouselCaption, setCarouselCaption] = useState("");
    const [carouselCta, setCarouselCta] = useState("");

    const currentSlide = slides[activeSlide];

    const updateSlide = (field: keyof Slide, value: string) => {
        setSlides((prev) =>
            prev.map((slide, index) =>
                index === activeSlide ? { ...slide, [field]: value } : slide
            )
        );
        setApproved(false);
        if (canvaEditUrl) setCanvaStatus("draft_changed");
    };

    const generateContent = async () => {
        if (!idea.trim() || isGenerating) return;
        setIsGenerating(true);
        setGenerated(false);
        setApproved(false);
        setGenerationError("");
        setCompletedSteps([]);
        setActiveWorkflowStep(0);
        setWorkflowOutputs([]);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
            const response = await fetch(`${apiBase}/api/generate-carousel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: idea.trim(), platform, audience, tone, slide_count: Number(slideCount) }),
            });
            const payload = await response.json();
            if (!response.ok) throw new Error(payload.detail || "Content generation failed.");
            const result = payload.data;
            if (!Array.isArray(result?.slides) || result.slides.length !== Number(slideCount)) {
                throw new Error("The AI response did not contain the requested slide count.");
            }
            const colors = ["bg-[#e9efff]", "bg-[#e8f5ee]", "bg-[#fff2e6]", "bg-[#f2ebff]", "bg-[#e8f4fa]", "bg-[#fff0f2]"];
            const newSlides: Slide[] = result.slides.map((item: { slide_number: number; headline: string; body: string; visual_direction?: string }, index: number) => ({
                id: item.slide_number,
                label: item.slide_number === 1 ? "Cover" : item.slide_number === Number(slideCount) ? "CTA" : `Slide ${item.slide_number}`,
                title: item.headline,
                body: item.body,
                footer: `${result.topic || idea} · ${result.platform || platform}`,
                background: colors[index % colors.length],
                visualDirection: item.visual_direction,
            }));
            setSlides(newSlides);
            setProjectName(result.title || idea.trim());
            setCarouselCaption(result.caption || "");
            setCarouselCta(result.cta || "");
            setActiveSlide(0);
            setWorkflowOutputs([
                `Founder idea: ${idea.trim()}\nAudience: ${audience} · Platform: ${platform} · Tone: ${tone}`,
                `Structure from Groq: ${result.title || idea.trim()}\nResearch notes: ${(result.research_notes || []).join("; ") || "None returned."}`,
                newSlides.map((slide) => `${slide.id}. ${slide.title}\n${slide.body}`).join("\n\n"),
                newSlides.map((slide) => `${slide.id}. ${slide.visualDirection || "No visual direction returned."}`).join("\n"),
                "Editable draft is ready in the carousel editor. Create the Canva design after reviewing the copy.",
                `Caption: ${result.caption || ""}\nCTA: ${result.cta || ""}\nHashtags: ${(result.hashtags || []).join(" ")}`,
            ]);
            setCompletedSteps([0, 1, 2, 3]);
            setActiveWorkflowStep(3);
            setGenerated(true);
        } catch (error) {
            setGenerationError(error instanceof Error ? error.message : "Could not connect to the content service.");
            setCompletedSteps([]);
            setActiveWorkflowStep(-1);
        } finally {
            setIsGenerating(false);
        }
    };

    const createCanvaDesign = async () => {
        if (!generated || !slides.length) return;
        setCanvaError("");
        setCanvaAuthUrl("");
        setCanvaEditUrl("");
        setCanvaThumbnails([]);
        setCanvaStatus("starting");
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
            const response = await fetch(`${apiBase}/api/canva/create-design`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: projectName, platform, audience, tone,
                    slides: slides.map(({ title, body, visualDirection }) => ({
                        headline: title, body, visual_direction: visualDirection || "Use a relevant pet image and a clear, uncluttered layout.",
                    })),
                    caption: carouselCaption,
                    cta: carouselCta,
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || "Could not start Canva design creation.");
            setCanvaJobId(result.job_id);
            setCanvaStatus(result.status);
            setCanvaAuthUrl(result.authorization_url || "");
            if (result.edit_url) setCanvaEditUrl(result.edit_url);
            if (result.error) throw new Error(result.error);
        } catch (error) {
            setCanvaStatus("failed");
            setCanvaError(error instanceof Error ? error.message : "Could not connect to Canva.");
        }
    };

    const checkCanvaStatus = async () => {
        if (!canvaJobId) return;
        setCanvaError("");
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
            const response = await fetch(`${apiBase}/api/canva/jobs/${canvaJobId}`);
            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || "Could not read Canva job status.");
            setCanvaStatus(result.status);
            setCanvaAuthUrl(result.authorization_url || canvaAuthUrl);
            setCanvaEditUrl(result.edit_url || "");
            setCanvaThumbnails(result.thumbnails || []);
            if (result.error) setCanvaError(result.error);
        } catch (error) {
            setCanvaError(error instanceof Error ? error.message : "Could not check Canva status.");
        }
    };

    const connectExistingCanvaDesign = async () => {
        const match = existingCanvaUrl.match(/^https:\/\/www\.canva\.com\/design\/(D[A-Za-z0-9_-]{9,})\//);
        if (!match) {
            setCanvaError("Enter the full Canva edit URL for the existing five-page design.");
            return;
        }
        setCanvaError("");
        setCanvaJobId("");
        setCanvaEditUrl("");
        setCanvaThumbnails([]);
        setCanvaStatus("starting");
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
            const response = await fetch(`${apiBase}/api/canva/adopt-design`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ design_id: match[1], edit_url: existingCanvaUrl.trim() }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || "Could not connect the existing Canva design.");
            setCanvaJobId(result.job_id);
            setCanvaStatus(result.status);
            setCanvaAuthUrl(result.authorization_url || "");
            setCanvaEditUrl(result.edit_url || existingCanvaUrl.trim());
            if (result.error) throw new Error(result.error);
        } catch (error) {
            setCanvaStatus("failed");
            setCanvaError(error instanceof Error ? error.message : "Could not connect the existing Canva design.");
        }
    };

    const exportCanvaDesign = async (format: "png" | "pdf") => {
        if (!canvaJobId || canvaStatus !== "completed") return;
        setCanvaError("");
        setCanvaExportMessage("");
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
            const response = await fetch(`${apiBase}/api/canva/jobs/${canvaJobId}/export?file_format=${format}`, { method: "POST" });
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.detail || `Canva ${format.toUpperCase()} export failed.`);
            }
            const blob = await response.blob();
            const filename = format === "png" ? "pawzz-carousel-png.zip" : "pawzz-carousel.pdf";
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(url);
            setCanvaExportMessage(format === "png" ? "Downloaded five verified Canva PNG slides." : "Downloaded the verified five-page Canva PDF.");
        } catch (error) {
            setCanvaError(error instanceof Error ? error.message : "Canva export failed.");
        }
    };

    const navTo = (label: string) => {
        setActiveNav(label);
        setMobileMenu(false);

        const sectionIds: Record<string, string> = {
            Overview: "overview",
            Projects: "projects",
            "AI Workflow": "workflow",
            "Carousel Editor": "carousel-editor",
            Exports: "exports",
        };

        setTimeout(() => {
            const section = document.getElementById(sectionIds[label]);
            section?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
    };

    return (
        <div className="min-h-screen bg-[#f7f8fc] text-[#172033]">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[250px] shrink-0 flex-col overflow-y-auto border-r border-[#e9ebf2] bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${mobileMenu ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex h-[76px] items-center justify-between border-b border-[#eff0f4] px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf0ff] text-[#5269df]">
                                <PawPrint size={23} />
                            </div>
                            <div>
                                <p className="text-[17px] font-bold tracking-tight">pawzz<span className="text-[#5269df]">.</span></p>
                                <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#939bad]">AI Studio</p>
                            </div>
                        </div>
                        <button onClick={() => setMobileMenu(false)} className="lg:hidden">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="px-4 pt-7">
                        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.7px] text-[#a0a6b5]">
                            Workspace
                        </p>
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = activeNav === item.label;
                                return (
                                    <button
                                        key={item.label}
                                        onClick={() => navTo(item.label)}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${active
                                            ? "bg-[#eef0ff] text-[#5269df]"
                                            : "text-[#747d91] hover:bg-[#f6f7fb] hover:text-[#26324a]"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                        {item.label === "AI Workflow" && (
                                            <span className="ml-auto h-2 w-2 rounded-full bg-[#8c77eb]" />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="mx-5 mt-8 rounded-2xl border border-[#eceeff] bg-gradient-to-br from-[#f2f3ff] to-[#f8f5ff] p-4">
                        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#7865dc] shadow-sm">
                            <Sparkles size={18} />
                        </div>
                        <p className="text-[13px] font-bold">Your AI assistant</p>
                        <p className="mt-1 text-[11px] leading-5 text-[#7e8498]">
                            Turn your ideas into engaging social media content.
                        </p>
                        <button
                            onClick={() => navTo("AI Workflow")}
                            className="mt-3 flex items-center gap-2 text-[11px] font-bold text-[#5d68d9]"
                        >
                            Explore workflow <ArrowUpRight size={13} />
                        </button>
                    </div>

                    <div className="mt-auto border-t border-[#eff0f4] p-4">
                        <div className="flex items-center gap-3 rounded-xl p-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8edff] text-xs font-bold text-[#5269df]">
                                PF
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[12px] font-bold">Pawzz Founder</p>
                                <p className="text-[10px] text-[#969daf]">Workspace admin</p>
                            </div>
                            <MoreHorizontal size={18} className="text-[#969daf]" />
                        </div>
                    </div>
                </aside>

                {mobileMenu && (
                    <button
                        aria-label="Close navigation"
                        onClick={() => setMobileMenu(false)}
                        className="fixed inset-0 z-30 bg-black/20 lg:hidden"
                    />
                )}

                {/* Main area */}
                <main className="h-screen min-w-0 flex-1 overflow-y-auto">
                    {/* Topbar */}
                    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#e9ebf2] bg-white/90 px-5 backdrop-blur-xl sm:px-8">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setMobileMenu(true)}
                                className="rounded-lg p-2 hover:bg-[#f4f5f9] lg:hidden"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <div className="flex items-center gap-2 text-[11px] text-[#9aa1b1]">
                                    <span>Workspace</span>
                                    <span>/</span>
                                    <span className="text-[#5d6680]">{activeNav}</span>
                                </div>
                                <h1 className="mt-1 text-[15px] font-bold tracking-tight">
                                    {activeNav === "Overview" ? "Good morning, Pawzz team" : activeNav}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="hidden items-center gap-2 rounded-lg border border-[#eceef3] px-3 py-2 text-[11px] text-[#9097a8] md:flex">
                                <Search size={14} />
                                Search projects...
                                <span className="ml-4 rounded border border-[#e7e9ef] px-1.5 py-0.5">⌘ K</span>
                            </div>
                            <button className="relative rounded-lg p-2 text-[#858da0] hover:bg-[#f4f5f9]">
                                <Bell size={18} />
                                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ed777d]" />
                            </button>
                            <div className="hidden h-8 w-px bg-[#eceef3] sm:block" />
                            <button className="hidden items-center gap-2 text-[12px] font-semibold sm:flex">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf0ff] text-[#586bdf]">P</span>
                                Pawzz
                                <ChevronDown size={14} className="text-[#969daf]" />
                            </button>
                        </div>
                    </header>

                    <div
                        id="overview"
                        className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10"
                    >
                        {/* Welcome */}
                        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-[#7d83a1]">
                                    <Sparkles size={14} className="text-[#8a76e8]" />
                                    YOUR CONTENT COMMAND CENTER
                                </div>
                                <h2 className="text-[26px] font-bold tracking-tight sm:text-[30px]">
                                    Create something <span className="text-[#6473e4]">meaningful.</span>
                                </h2>
                                <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#858da0]">
                                    Transform raw ideas into beautifully structured, ready-to-publish social media carousels.
                                </p>
                            </div>
                            <button
                                onClick={() => navTo("Carousel Editor")}
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#536ce5] px-5 py-3 text-[12px] font-bold text-white shadow-lg shadow-[#536ce5]/20 transition hover:bg-[#4059d4]"
                            >
                                <Plus size={16} /> New project
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="mb-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
                            {[
                                { label: "Total projects", value: "12", note: "+3 this month", icon: FolderKanban, color: "bg-[#edf0ff] text-[#6474e5]" },
                                { label: "Carousels created", value: "28", note: "Across all platforms", icon: PanelsTopLeft, color: "bg-[#f1edff] text-[#8b70df]" },
                                { label: "Ready to publish", value: "08", note: "Awaiting approval", icon: CheckCircle2, color: "bg-[#e9f7ef] text-[#43a878]" },
                                { label: "Time saved", value: "16 hrs", note: "Estimated this month", icon: Clock3, color: "bg-[#fff3e7] text-[#e69b50]" },
                            ].map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={stat.label} className="rounded-2xl border border-[#e9ebf2] bg-white p-4 sm:p-5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-medium text-[#8d95a8]">{stat.label}</span>
                                            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}>
                                                <Icon size={17} />
                                            </span>
                                        </div>
                                        <p className="mt-3 text-[25px] font-bold tracking-tight">{stat.value}</p>
                                        <p className="mt-1 text-[10px] text-[#a0a6b5]">{stat.note}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(310px,0.8fr)]">
                            {/* Create project */}
                            <section className="overflow-hidden rounded-2xl border border-[#e9ebf2] bg-white">
                                <div className="flex items-center justify-between border-b border-[#eff0f4] px-5 py-4 sm:px-6">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf0ff] text-[#6474e5]">
                                                <WandSparkles size={16} />
                                            </div>
                                            <h3 className="text-[14px] font-bold">Create with AI</h3>
                                        </div>
                                        <p className="mt-2 text-[11px] text-[#9299aa]">Start with an idea. Let AI shape the story.</p>
                                    </div>
                                    <span className="rounded-full bg-[#f2efff] px-3 py-1.5 text-[9px] font-bold text-[#806cdb]">
                                        AI POWERED
                                    </span>
                                </div>

                                <div className="space-y-5 p-5 sm:p-6">
                                    <div>
                                        <label className="mb-2 block text-[11px] font-bold text-[#4b556b]">
                                            Project name
                                        </label>
                                        <input
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            className="w-full rounded-xl border border-[#e8eaf0] bg-[#fbfcfe] px-4 py-3 text-[12px] outline-none transition focus:border-[#7180eb]"
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="text-[11px] font-bold text-[#4b556b]">Your raw idea</label>
                                            <span className="text-[10px] text-[#a1a7b5]">Step 01 · Input</span>
                                        </div>
                                        <textarea
                                            value={idea}
                                            onChange={(e) => setIdea(e.target.value)}
                                            rows={4}
                                            placeholder="Example: I want to educate pet parents about why regular veterinary checkups are important..."
                                            className="w-full resize-none rounded-xl border border-[#e8eaf0] bg-[#fbfcfe] px-4 py-3 text-[12px] leading-6 outline-none transition placeholder:text-[#b1b6c3] focus:border-[#7180eb]"
                                        />
                                        <p className="mt-2 text-[10px] text-[#a4aaba]">
                                            <Sparkles size={11} className="mr-1 inline text-[#8875e7]" />
                                            Tip: Share your message, goal or rough thoughts. They don&apos;t need to be perfect.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-[11px] font-bold text-[#4b556b]">Platform</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["Instagram", "LinkedIn"].map((item) => (
                                                    <button
                                                        key={item}
                                                        onClick={() => setPlatform(item)}
                                                        className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-[11px] font-semibold transition ${platform === item
                                                            ? "border-[#6979e9] bg-[#f0f2ff] text-[#586be0]"
                                                            : "border-[#e8eaf0] text-[#9299aa] hover:bg-[#fafbfe]"
                                                            }`}
                                                    >
                                                        {item === "Instagram" ? (
                                                            <span className="text-[14px] font-bold">◎</span>
                                                        ) : (
                                                            <span className="text-[12px] font-extrabold">in</span>
                                                        )}
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[11px] font-bold text-[#4b556b]">Target audience</label>
                                            <select
                                                value={audience}
                                                onChange={(e) => setAudience(e.target.value)}
                                                className="w-full rounded-xl border border-[#e8eaf0] bg-white px-3 py-3 text-[11px] outline-none focus:border-[#7180eb]"
                                            >
                                                <option>Pet parents</option>
                                                <option>First-time pet owners</option>
                                                <option>Animal lovers</option>
                                                <option>Veterinary professionals</option>
                                                <option>General audience</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[11px] font-bold text-[#4b556b]">Content tone</label>
                                            <select
                                                value={tone}
                                                onChange={(e) => setTone(e.target.value)}
                                                className="w-full rounded-xl border border-[#e8eaf0] bg-white px-3 py-3 text-[11px] outline-none focus:border-[#7180eb]"
                                            >
                                                <option>Friendly & educational</option>
                                                <option>Professional</option>
                                                <option>Emotional & inspiring</option>
                                                <option>Fun & conversational</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[11px] font-bold text-[#4b556b]">Number of slides</label>
                                            <select
                                                value={slideCount}
                                                onChange={(e) => setSlideCount(e.target.value)}
                                                className="w-full rounded-xl border border-[#e8eaf0] bg-white px-3 py-3 text-[11px] outline-none focus:border-[#7180eb]"
                                            >
                                                <option value="5">5 slides</option>
                                                <option value="7">7 slides</option>
                                                <option value="8">8 slides</option>
                                                <option value="10">10 slides</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        onClick={generateContent}
                                        disabled={!idea.trim() || isGenerating}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#536ce5] py-3.5 text-[12px] font-bold text-white shadow-lg shadow-[#536ce5]/15 transition hover:bg-[#4059d4] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <RefreshCw size={15} className="animate-spin" />
                                                Generating your content...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={16} />
                                                Generate carousel with AI
                                                <ArrowUpRight size={15} />
                                            </>
                                        )}
                                    </button>
                                    {generationError && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[10px] text-red-700">{generationError}</p>}
                                    <p className="text-center text-[9px] text-[#a4aaba]">
                                        Calls the local Groq backend · Canva MCP creates an editable design after generation
                                    </p>
                                </div>
                            </section>

                            {/* Workflow */}

                            <section
                                id="workflow"
                                className="rounded-2xl border border-[#e9ebf2] bg-white p-5 sm:p-6 scroll-mt-24"
                            >
                                <div className="mb-5 flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1edff] text-[#806cdb]">
                                                <Workflow size={16} />
                                            </div>
                                            <h3 className="text-[14px] font-bold">AI workflow</h3>
                                        </div>
                                        <p className="mt-2 text-[10px] text-[#9299aa]">
                                            From raw idea to publish-ready carousel
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-[#f2efff] px-3 py-1.5 text-[9px] font-bold text-[#806cdb]">
                                        {generated ? "CONTENT READY" : isGenerating ? "RUNNING" : "READY"}
                                    </span>
                                </div>

                                <div className="mb-5">
                                    <div className="mb-2 flex justify-between text-[10px]">
                                        <span className="font-semibold text-[#657087]">
                                            Workflow progress
                                        </span>
                                        <span className="font-bold text-[#6474e5]">
                                            {Math.round((completedSteps.length / workflowSteps.length) * 100)}%
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-[#f0f1f6]">
                                        <motion.div
                                            className="h-full rounded-full bg-[#6474e5]"
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${(completedSteps.length / workflowSteps.length) * 100}%`,
                                            }}
                                            transition={{ duration: 0.4 }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {workflowSteps.map((step, index) => {
                                        const Icon = step.icon;
                                        const isComplete = completedSteps.includes(index);
                                        const isActive = activeWorkflowStep === index;

                                        return (
                                            <button
                                                key={step.title}
                                                onClick={() => {
                                                    if (workflowOutputs[index]) {
                                                        setActiveWorkflowStep(index);
                                                    }
                                                }}
                                                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${isActive
                                                    ? "border-[#cbd2ff] bg-[#f5f6ff]"
                                                    : isComplete
                                                        ? "border-[#e2f2e8] bg-[#f7fcf8]"
                                                        : "border-[#eff0f4] bg-white hover:bg-[#fafbfe]"
                                                    }`}
                                            >
                                                <div
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isComplete
                                                        ? "bg-[#e5f6eb] text-[#3ca477]"
                                                        : isActive
                                                            ? "bg-[#e9ecff] text-[#6474e5]"
                                                            : "bg-[#f4f5f9] text-[#9ba2b1]"
                                                        }`}
                                                >
                                                    {isComplete ? (
                                                        <Check size={16} />
                                                    ) : isActive ? (
                                                        <RefreshCw size={15} className="animate-spin" />
                                                    ) : (
                                                        <Icon size={15} />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[11px] font-bold text-[#39445b]">
                                                        {step.title}
                                                    </p>
                                                    <p className="mt-1 text-[9px] text-[#9299aa]">
                                                        {step.detail}
                                                    </p>
                                                </div>

                                                <span className="text-[9px] font-semibold text-[#8e96a8]">
                                                    {isComplete
                                                        ? "Done"
                                                        : isActive
                                                            ? "Running"
                                                            : "Pending"}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {activeWorkflowStep >= 0 && workflowOutputs[activeWorkflowStep] && (
                                    <div className="mt-5 rounded-xl border border-[#e9ebf2] bg-[#fafbff] p-4">
                                        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold text-[#6474e5]">
                                            <Sparkles size={14} />
                                            {workflowSteps[activeWorkflowStep].title} — Output
                                        </div>

                                        <p className="whitespace-pre-line text-[10px] leading-6 text-[#737e94]">
                                            {workflowOutputs[activeWorkflowStep]}
                                        </p>
                                    </div>
                                )}

                                {generated && (
                                    <div className="mt-5 rounded-xl border border-[#dcefe3] bg-[#f2fbf5] p-4">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-[#329568]">
                                            <CheckCircle2 size={16} />
                                            Groq draft ready
                                        </div>
                                        <p className="mt-2 text-[10px] leading-5 text-[#718b7d]">
                                            Groq generated the editable draft. Create the Canva design below to review it in Canva and export PNG or PDF.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setActiveNav("Carousel Editor");
                                                document.getElementById("carousel-editor")?.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "start",
                                                });
                                            }}
                                            className="mt-3 flex items-center gap-2 text-[10px] font-bold text-[#329568]"
                                        >
                                            Open carousel editor <ArrowUpRight size={13} />
                                        </button>
                                    </div>
                                )}

                                {!generated && !isGenerating && (
                                    <p className="mt-4 text-[9px] leading-5 text-[#a0a6b5]">
                                        Enter an idea and select Generate carousel with AI. This calls the configured Groq backend.
                                    </p>
                                )}
                            </section>



                        </div>

                        {/* Editor */}
                        <section
                            id="carousel-editor"
                            className="mt-7 overflow-hidden rounded-2xl border border-[#e9ebf2] bg-white scroll-mt-24"
                        >
                            <div className="flex flex-col justify-between gap-3 border-b border-[#eff0f4] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <PanelsTopLeft size={17} className="text-[#6676e5]" />
                                        <h3 className="text-[14px] font-bold">Carousel editor</h3>
                                        <span className="rounded-md bg-[#f1f2f7] px-2 py-1 text-[9px] font-semibold text-[#8b92a3]">
                                            {slides.length} SLIDES
                                        </span>
                                    </div>
                                    <p className="mt-1 text-[10px] text-[#969daf]">
                                        Edit your content and preview each slide.
                                    </p>
                                </div>

                                <div id="exports" className="flex flex-wrap items-center gap-2 scroll-mt-24">
                                    <span className="flex items-center gap-1.5 text-[10px] text-[#9299aa]">
                                        <span className="h-2 w-2 rounded-full bg-[#54b985]" />
                                        {approved ? "Approved" : "Draft"}
                                    </span>
                                    <button
                                        onClick={() => exportCanvaDesign("pdf")}
                                        className="flex items-center gap-2 rounded-lg border border-[#e7e9ef] px-3 py-2 text-[10px] font-bold text-[#647087] hover:bg-[#f8f9fc]"
                                    >
                                        <Download size={14} /> Export PDF
                                    </button>
                                    <button
                                        onClick={() => setApproved(true)}
                                        className="flex items-center gap-2 rounded-lg bg-[#536ce5] px-3 py-2 text-[10px] font-bold text-white hover:bg-[#4059d4]"
                                    >
                                        <Check size={14} /> Approve
                                    </button>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-[220px_minmax(0,1fr)_280px]">
                                {/* Slide list */}
                                <div className="border-b border-[#eff0f4] p-4 lg:border-b-0 lg:border-r">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9299aa]">Slides</p>
                                        <button className="rounded-md p-1.5 text-[#9299aa] hover:bg-[#f4f5f9]">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-2 lg:overflow-visible">
                                        {slides.map((slide, index) => (
                                            <button
                                                key={slide.id}
                                                onClick={() => setActiveSlide(index)}
                                                className={`flex min-w-[145px] items-center gap-3 rounded-xl border p-2 text-left transition lg:w-full ${activeSlide === index
                                                    ? "border-[#7180eb] bg-[#f5f6ff]"
                                                    : "border-transparent hover:bg-[#f8f9fc]"
                                                    }`}
                                            >
                                                <div className={`flex h-[52px] w-[43px] shrink-0 items-center justify-center rounded-lg ${slide.background}`}>
                                                    <span className="text-[12px] font-bold text-[#586bce]">{String(index + 1).padStart(2, "0")}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-[10px] font-bold text-[#4b556b]">{slide.label}</p>
                                                    <p className="mt-1 text-[9px] text-[#a1a7b5]">Slide {index + 1}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="min-w-0 bg-[#f7f8fc] p-5 sm:p-8">
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="text-[10px] font-semibold text-[#9299aa]">LIVE PREVIEW</p>
                                        <div className="flex items-center gap-2 text-[10px] text-[#9299aa]">
                                            <Eye size={13} />
                                            {platform} · 4:5
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentSlide.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2 }}
                                            className={`relative mx-auto flex aspect-[4/5] w-full max-w-[350px] flex-col justify-between overflow-hidden rounded-[5px] p-7 shadow-xl shadow-[#283451]/10 sm:p-9 ${currentSlide.background}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-[#6575d9]">
                                                        <PawPrint size={15} />
                                                    </div>
                                                    <span className="text-[9px] font-bold tracking-[1.5px] text-[#4a5573]">PAWZZ</span>
                                                </div>
                                                <span className="rounded-full bg-white/70 px-3 py-1 text-[8px] font-bold text-[#69749a]">
                                                    {String(activeSlide + 1).padStart(2, "0")} / {slides.length}
                                                </span>
                                            </div>

                                            <div className="relative z-10 py-5">
                                                <span className="mb-4 inline-block rounded-full bg-white/70 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[1.2px] text-[#6473d3]">
                                                    {currentSlide.label}
                                                </span>
                                                <h3 className="whitespace-pre-wrap text-[25px] font-extrabold leading-[1.18] tracking-tight text-[#202b49] sm:text-[29px]">
                                                    {currentSlide.title}
                                                </h3>
                                                <p className="mt-5 max-w-[260px] text-[12px] leading-6 text-[#66718a]">
                                                    {currentSlide.body}
                                                </p>
                                                <div className="mt-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-[#6675d8]">
                                                    <Heart size={20} />
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between border-t border-[#53628a]/15 pt-4">
                                                <span className="max-w-[220px] text-[7px] font-bold tracking-[1.2px] text-[#65718b]">
                                                    {currentSlide.footer}
                                                </span>
                                                <PawPrint size={19} className="text-[#7b86bf]" />
                                            </div>
                                            <div className="pointer-events-none absolute -bottom-16 -right-14 h-48 w-48 rounded-full border-[28px] border-white/20" />
                                            <div className="pointer-events-none absolute -right-8 top-20 h-24 w-24 rounded-full bg-white/20 blur-xl" />
                                        </motion.div>
                                    </AnimatePresence>

                                    <div className="mx-auto mt-5 flex max-w-[350px] items-center justify-between">
                                        <button
                                            onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                                            disabled={activeSlide === 0}
                                            className="flex items-center gap-1 rounded-lg border border-[#e6e8ef] bg-white px-3 py-2 text-[10px] font-semibold text-[#68738b] disabled:opacity-40"
                                        >
                                            <ChevronLeft size={14} /> Previous
                                        </button>
                                        <span className="text-[10px] font-semibold text-[#9299aa]">
                                            {activeSlide + 1} of {slides.length}
                                        </span>
                                        <button
                                            onClick={() => setActiveSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                                            disabled={activeSlide === slides.length - 1}
                                            className="flex items-center gap-1 rounded-lg border border-[#e6e8ef] bg-white px-3 py-2 text-[10px] font-semibold text-[#68738b] disabled:opacity-40"
                                        >
                                            Next <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Edit panel */}
                                <div className="border-t border-[#eff0f4] p-5 lg:border-l lg:border-t-0">
                                    <div className="mb-5 flex items-center gap-2">
                                        <Pencil size={15} className="text-[#6979e8]" />
                                        <h4 className="text-[12px] font-bold">Edit slide</h4>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-[10px] font-bold text-[#657087]">Slide label</label>
                                            <input
                                                value={currentSlide.label}
                                                onChange={(e) => updateSlide("label", e.target.value)}
                                                className="w-full rounded-lg border border-[#e8eaf0] px-3 py-2.5 text-[11px] outline-none focus:border-[#7180eb]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[10px] font-bold text-[#657087]">Headline</label>
                                            <textarea
                                                rows={4}
                                                value={currentSlide.title}
                                                onChange={(e) => updateSlide("title", e.target.value)}
                                                className="w-full resize-none rounded-lg border border-[#e8eaf0] px-3 py-2.5 text-[11px] leading-5 outline-none focus:border-[#7180eb]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[10px] font-bold text-[#657087]">Body copy</label>
                                            <textarea
                                                rows={5}
                                                value={currentSlide.body}
                                                onChange={(e) => updateSlide("body", e.target.value)}
                                                className="w-full resize-none rounded-lg border border-[#e8eaf0] px-3 py-2.5 text-[11px] leading-5 outline-none focus:border-[#7180eb]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[10px] font-bold text-[#657087]">Footer text</label>
                                            <input
                                                value={currentSlide.footer}
                                                onChange={(e) => updateSlide("footer", e.target.value)}
                                                className="w-full rounded-lg border border-[#e8eaf0] px-3 py-2.5 text-[10px] outline-none focus:border-[#7180eb]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[10px] font-bold text-[#657087]">Visual direction</label>
                                            <textarea
                                                rows={3}
                                                value={currentSlide.visualDirection || ""}
                                                onChange={(e) => updateSlide("visualDirection", e.target.value)}
                                                className="w-full resize-y rounded-lg border border-[#e8eaf0] px-3 py-2.5 text-[11px] leading-5 outline-none focus:border-[#7180eb]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[10px] font-bold text-[#657087]">Background style</label>
                                            <div className="flex gap-2">
                                                {[
                                                    "bg-[#e9efff]",
                                                    "bg-[#e8f5ee]",
                                                    "bg-[#fff2e6]",
                                                    "bg-[#f2ebff]",
                                                    "bg-[#e8f4fa]",
                                                    "bg-[#fff0f2]",
                                                ].map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => updateSlide("background", color)}
                                                        className={`h-7 w-7 rounded-full border border-black/5 ${color} ${currentSlide.background === color ? "ring-2 ring-[#6678e8] ring-offset-2" : ""
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-xl bg-[#f6f7fc] p-3">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#6473d3]">
                                            <Sparkles size={13} /> AI writing assistant
                                        </div>
                                        <p className="mt-2 text-[9px] leading-5 text-[#9098aa]">
                                            Review your message for clarity and keep each slide focused on one key idea.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="canva-design" className="mt-7 rounded-2xl border border-[#e9ebf2] bg-white p-5 sm:p-6 scroll-mt-24">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h3 className="text-[14px] font-bold">Canva design</h3>
                                    <p className="mt-1 max-w-2xl text-[10px] leading-5 text-[#9299aa]">Create an editable Canva carousel with animal imagery from the reviewed slide copy. Canva will ask you to sign in and authorize Pawzz the first time.</p>
                                </div>
                                <button onClick={createCanvaDesign} disabled={!generated || canvaStatus === "starting" || canvaStatus === "creating_design" || canvaStatus === "design_processing"} className="shrink-0 rounded-lg bg-[#536ce5] px-4 py-2.5 text-[10px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
                                    {canvaStatus === "starting" || canvaStatus === "creating_design" || canvaStatus === "design_processing" ? "Creating design…" : canvaStatus === "draft_changed" ? "Create updated Canva design" : "Create editable Canva design"}
                                </button>
                            </div>
                            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                <input aria-label="Existing Canva design URL" value={existingCanvaUrl} onChange={(event) => setExistingCanvaUrl(event.target.value)} placeholder="Paste the existing Canva edit URL to reconnect" className="min-w-0 flex-1 rounded-lg border border-[#e8eaf0] px-3 py-2.5 text-[10px] outline-none focus:border-[#7180eb]" />
                                <button onClick={connectExistingCanvaDesign} disabled={!existingCanvaUrl.trim() || canvaStatus === "starting" || canvaStatus === "checking_design"} className="rounded-lg border border-[#e7e9ef] px-4 py-2.5 text-[10px] font-bold text-[#647087] disabled:opacity-50">Reconnect existing Canva design</button>
                            </div>
                            {canvaAuthUrl && canvaStatus === "authorization_required" && <div className="mt-4 rounded-xl border border-[#e8eaf0] bg-[#fafbff] p-4"><p className="text-[11px] font-semibold">Sign in to Canva and allow Pawzz AI Studio access.</p><a href={canvaAuthUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-[11px] font-bold text-[#536ce5] underline">Continue to Canva authorization</a><p className="mt-2 text-[9px] leading-5 text-[#9299aa]">After Canva returns a success message, come back here and check the design status.</p></div>}
                            {canvaJobId && <div className="mt-4 flex flex-wrap items-center gap-3"><span className="rounded-full bg-[#f2efff] px-3 py-1.5 text-[9px] font-bold text-[#6c63c8]">Canva status: {canvaStatus.replaceAll("_", " ")}</span><button onClick={checkCanvaStatus} className="rounded-lg border border-[#e7e9ef] px-3 py-2 text-[10px] font-bold text-[#647087]">Check status</button>{canvaEditUrl && <a href={canvaEditUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-[#eaf1ff] px-3 py-2 text-[10px] font-bold text-[#536ce5]">Open and edit in Canva</a>}{canvaStatus === "completed" && <><button onClick={() => exportCanvaDesign("png")} className="rounded-lg border border-[#e7e9ef] px-3 py-2 text-[10px] font-bold text-[#647087]">Export PNG</button><button onClick={() => exportCanvaDesign("pdf")} className="rounded-lg border border-[#e7e9ef] px-3 py-2 text-[10px] font-bold text-[#647087]">Export PDF</button></>}</div>}
                            {canvaThumbnails.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{canvaThumbnails.map((url, index) => <Image key={`${url}-${index}`} src={url} alt={`Canva carousel page ${index + 1}`} width={600} height={750} unoptimized className="w-full rounded-lg border border-[#e9ebf2]" />)}</div>}
                            {canvaError && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[10px] text-red-700">{canvaError}</p>}
                            {canvaExportMessage && <p role="status" className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-[10px] text-green-700">{canvaExportMessage}</p>}
                            {canvaStatus === "draft_changed" && <p className="mt-3 text-[9px] text-amber-700">Your Canva design reflects the previous copy. Create an updated design or edit it directly in Canva.</p>}
                        </section>

                        {/* Bottom project and integrations */}
                        <div className="mt-7 grid gap-6 lg:grid-cols-2">

                            <section
                                id="projects"
                                className="rounded-2xl border border-[#e9ebf2] bg-white p-5 sm:p-6 scroll-mt-24"
                            >
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-[14px] font-bold">Recent projects</h3>
                                        <p className="mt-1 text-[10px] text-[#9299aa]">Pick up where you left off</p>
                                    </div>
                                    <button onClick={() => navTo("Projects")} className="text-[10px] font-bold text-[#6274df]">
                                        View all
                                    </button>
                                </div>
                                {[
                                    { name: "Pet Wellness Campaign", date: "Edited today", status: "In progress", bg: "bg-[#e9efff]", icon: PawPrint },
                                    { name: "Adoption Awareness", date: "Edited yesterday", status: "Ready for review", bg: "bg-[#e8f5ee]", icon: Heart },
                                    { name: "Responsible Pet Care", date: "Edited 3 days ago", status: "Draft", bg: "bg-[#fff2e6]", icon: ImageIcon },
                                ].map((project) => {
                                    const Icon = project.icon;
                                    return (
                                        <div key={project.name} className="flex items-center gap-3 border-t border-[#f0f1f5] py-3 first:border-0">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${project.bg} text-[#6375d9]`}>
                                                <Icon size={18} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[11px] font-bold">{project.name}</p>
                                                <p className="mt-1 text-[9px] text-[#a0a6b5]">{project.date}</p>
                                            </div>
                                            <span className="rounded-full bg-[#f5f6fa] px-2.5 py-1.5 text-[9px] font-semibold text-[#7f8799]">
                                                {project.status}
                                            </span>
                                        </div>
                                    );
                                })}
                            </section>

                            <section className="rounded-2xl border border-[#e9ebf2] bg-white p-5 sm:p-6">
                                <div className="mb-5">
                                    <h3 className="text-[14px] font-bold">Connected tools</h3>
                                    <p className="mt-1 text-[10px] text-[#9299aa]">Your content creation ecosystem</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { name: "Groq AI", desc: "Content generation", mark: "AI", bg: "bg-[#f0edff]", color: "text-[#8069db]" },
                                        { name: "Canva", desc: "Editable design and exports", mark: "C", bg: "bg-[#e8f2ff]", color: "text-[#477ad6]" },
                                        { name: "Canva MCP", desc: "OAuth connected", mark: "M", bg: "bg-[#eaf6ef]", color: "text-[#3d9c71]" },
                                        { name: "Automation", desc: "Not configured", mark: "n8n", bg: "bg-[#fff0e9]", color: "text-[#db8559]" },
                                    ].map((tool) => (
                                        <div key={tool.name} className="flex items-center gap-3 rounded-xl border border-[#eff0f4] p-3">
                                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[12px] font-extrabold ${tool.bg} ${tool.color}`}>
                                                {tool.mark}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold">{tool.name}</p>
                                                <p className="mt-1 text-[9px] text-[#a0a6b5]">{tool.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-4 text-[9px] leading-5 text-[#a0a6b5]">
                                    Groq and Canva MCP are connected to the local API. Canva export links are temporary; sign in and authorize Canva when prompted. External automation is not configured.
                                </p>
                            </section>
                        </div>

                        <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-[#e9ebf2] py-5 text-[10px] text-[#a0a6b5] sm:flex-row">
                            <span>© 2026 Pawzz Foundation · AI Carousel Studio</span>
                            <span>Built for meaningful content and better pet care.</span>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
}
