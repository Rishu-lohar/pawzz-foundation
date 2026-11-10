"use client";

import { useEffect, useState } from "react";
import {
  Brain, Sparkles, ArrowRight, CheckCircle2, Menu, X,
  Search, LayoutDashboard, BookOpen, CalendarDays, Trophy,
  BarChart3, Clock3, Bell, CircleUserRound, TrendingUp,
  Play, Zap, User, Send, ClipboardCheck, Users, Rocket,
  GraduationCap, ChevronDown, Mail, Phone,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

const HEADER_HEIGHT = 76;
const EASE = [0.22, 1, 0.36, 1] as const;

const programs = [
  {
    title: "Generative AI & Prompt Engineering",
    category: "ARTIFICIAL INTELLIGENCE",
    description: "Explore modern AI tools, prompt design and intelligent workflows through practical activities.",
    level: "Beginner", duration: "6 Weeks",
    icon: Brain, color: "text-blue-300 bg-blue-500/15",
  },
  {
    title: "Machine Learning Fundamentals",
    category: "MACHINE LEARNING",
    description: "Understand machine learning concepts, algorithms and predictive modelling fundamentals.",
    level: "Intermediate", duration: "8 Weeks",
    icon: BarChart3, color: "text-violet-300 bg-violet-500/15",
  },
  {
    title: "Data Science & Analytics",
    category: "DATA & ANALYTICS",
    description: "Build analytical thinking and learn to turn raw data into meaningful insights.",
    level: "Beginner", duration: "8 Weeks",
    icon: TrendingUp, color: "text-cyan-300 bg-cyan-500/15",
  },
  {
    title: "AI Tools for Productivity",
    category: "DIGITAL PRODUCTIVITY",
    description: "Discover AI tools for research, creativity, communication and everyday work.",
    level: "Beginner", duration: "4 Weeks",
    icon: Zap, color: "text-pink-300 bg-pink-500/15",
  },
];

const features = [
  { icon: Brain, title: "Practical AI Learning", description: "Understand AI concepts through guided exercises, examples and hands-on activities.", color: "text-blue-300 bg-blue-500/15" },
  { icon: TrendingUp, title: "Career-Focused Skills", description: "Develop relevant digital skills for an evolving professional environment.", color: "text-violet-300 bg-violet-500/15" },
  { icon: BookOpen, title: "Project-Based Approach", description: "Apply knowledge through practical projects and real-world scenarios.", color: "text-cyan-300 bg-cyan-500/15" },
  { icon: Trophy, title: "Guided Growth", description: "Follow a structured learning journey and build confidence as you progress.", color: "text-amber-300 bg-amber-500/15" },
];

const steps = [
  { icon: Search, title: "Explore Programs", description: "Discover programmes that match your interests and learning goals." },
  { icon: ClipboardCheck, title: "Register Your Interest", description: "Share your details and tell us which programme you want to explore." },
  { icon: Users, title: "Connect & Get Guidance", description: "Receive programme information and guidance about learning options." },
  { icon: Rocket, title: "Start Learning", description: "Begin your learning journey through practical activities and projects." },
];

const faqs = [
  { question: "Who can join these programmes?", answer: "The programmes are designed for students, graduates and young professionals interested in developing practical AI and digital skills." },
  { question: "Do I need prior AI experience?", answer: "Some programmes are designed for beginners, while others may require basic technical knowledge. Check the level mentioned on each programme." },
  { question: "Will I get practical learning experience?", answer: "The proposed learning approach includes practical exercises, guided activities and project-based learning." },
  { question: "How do I register for a programme?", answer: "Complete the enquiry form with your contact details and programme preference. The team can then follow up with relevant information." },
  { question: "Can I enquire before enrolling?", answer: "Yes. You can submit an enquiry to learn more about programme details and available learning options before making a decision." },
];

const navLinks = [
  { id: "programs", label: "Programs" },
  { id: "how-it-works", label: "How it works" },
  { id: "about", label: "About" },
  { id: "faq", label: "FAQ" },
];

const inputClass = "w-full rounded-xl border border-white/10 bg-[#0a1430] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10";
const labelClass = "mb-2 block text-xs font-semibold text-slate-300";

/* ---------- Animation variants ---------- */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const sectionClass =
  "relative z-10 flex min-h-[calc(100vh-76px)] items-center px-6 py-16 sm:py-20";

function OrbitalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#080d24]">
      <div className="absolute inset-0 bg-[#080d24]" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-[48%] h-[900px] w-[1250px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-blue-300/[0.10]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 190, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-[48%] h-[680px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-violet-300/[0.10]"
      />

      <motion.div
        animate={{ y: [0, -18, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[12%] top-[25%] h-2 w-2 rounded-full bg-blue-300 blur-[1px]"
      />
      <motion.div
        animate={{ y: [0, 16, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[15%] top-[43%] h-3 w-3 rounded-full bg-violet-300 blur-[2px]"
      />
      <motion.div
        animate={{ y: [0, -12, 0], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] left-[28%] h-2 w-2 rounded-full bg-indigo-300/70"
      />
      <motion.div
        animate={{ y: [0, 14, 0], x: [0, 10, 0], opacity: [0.2, 0.7, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[30%] top-[15%] h-1.5 w-1.5 rounded-full bg-cyan-300/80"
      />
    </div>
  );
}

function Heading({
  eyebrow, title, highlight, description,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.4 }}
      className="mx-auto mb-10 max-w-[680px] text-center"
    >
      <motion.span
        variants={popIn}
        className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300"
      >
        <Sparkles size={14} /> {eyebrow}
      </motion.span>

      <motion.h2
        variants={fadeUp}
        className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[46px]"
      >
        {title}{" "}
        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
          {highlight}
        </span>
      </motion.h2>

      <motion.p variants={fadeUp} className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
        {description}
      </motion.p>
    </motion.div>
  );
}

export default function EducationPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    enquiryType: "Course information",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "success">("idle");
  const [formError, setFormError] = useState("");

  /* Scroll progress bar + parallax */
  const { scrollYProgress, scrollY } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });
  const heroIconY = useTransform(scrollY, [0, 600], [0, -80]);
  const dashboardY = useTransform(scrollY, [200, 900], [30, -30]);

  /* Active section highlight in navbar */
  useEffect(() => {
    const ids = ["programs", "about", "how-it-works", "faq", "register"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const onScrollTop = () => {
      if (window.scrollY < 300) setActiveSection("");
    };
    window.addEventListener("scroll", onScrollTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollTop);
    };
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError("");
    setFormStatus("idle");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.program) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9+\-\s()]{7,16}$/.test(form.phone)) {
      setFormError("Please enter a valid phone number.");
      return;
    }

    setFormStatus("success");
    setFormError("");
    setForm({
      name: "",
      email: "",
      phone: "",
      program: "",
      enquiryType: "Course information",
    });
  };

  /* Single smooth-scroll handler.
     Sections are min-h(100vh - header) and vertically centered,
     so scrolling to (section top - header) centers the content. */
  const handleNavClick = (e: React.MouseEvent<HTMLElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href || !href.startsWith("#") || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const top =
      target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;

    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
    window.history.replaceState(null, "", href);
  };

  return (
    <main
      onClick={handleNavClick}
      className="relative min-h-screen overflow-x-clip bg-[#080d24] text-white"
    >
      <OrbitalBackground />

      {/* SCROLL PROGRESS */}
      <motion.div
        style={{ scaleX: progressScale }}
        className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400"
      />

      {/* NAVBAR */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080d24]/75 backdrop-blur-2xl"
      >
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-6 lg:px-10">
          <a href="/education" className="flex items-center gap-2">
            <motion.span
              whileHover={{ rotate: 12, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20"
            >
              <Brain size={21} />
            </motion.span>
            <span className="text-[21px] font-bold tracking-tight">
              SkillSync <span className="text-blue-400">AI</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`relative py-2 transition hover:text-blue-300 ${
                  activeSection === link.id ? "text-blue-300" : "text-slate-400"
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-blue-400 to-violet-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <a href="#register" className="text-sm text-slate-300 transition hover:text-white">Enquire</a>
            <motion.a
              href="#register"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-500"
            >
              Register interest <ArrowRight className="ml-1 inline" size={15} />
            </motion.a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-white md:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden border-t border-white/10 bg-[#0b1430] px-6 md:hidden"
            >
              <div className="flex flex-col gap-4 py-5 text-sm text-slate-300">
                {["programs", "how-it-works", "about", "faq", "register"].map((id, i) => (
                  <motion.a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="capitalize"
                  >
                    {id.replaceAll("-", " ")}
                  </motion.a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* HERO */}
      <section className="relative z-10 bg-transparent">
        <motion.div
          style={{ y: heroIconY }}
          animate={{ rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[9%] top-[25%] hidden text-blue-300/40 lg:block"
        >
          <Sparkles size={34} />
        </motion.div>

        <motion.div
          style={{ y: heroIconY }}
          animate={{ rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[11%] top-[30%] hidden text-violet-300/50 lg:block"
        >
          <Brain size={36} />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-[1100px] px-6 pb-28 pt-20 text-center sm:pt-24"
        >
          <motion.div
            variants={popIn}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-semibold text-blue-200 backdrop-blur-xl"
          >
            <Sparkles size={14} /> Learn smarter. Build your future.
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-[880px] text-[42px] font-bold leading-[1.1] tracking-[-2px] sm:text-5xl md:text-[66px]"
          >
            Unlock your potential with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              AI-powered
            </span>{" "}
            learning.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-[600px] text-[15px] leading-7 text-blue-100/70 sm:text-base"
          >
            Build practical AI and digital skills through guided learning, hands-on programmes and real-world projects designed for your future.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <motion.a
              href="#register"
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500"
            >
              Register your interest <ArrowRight size={16} />
            </motion.a>
            <motion.a
              href="#programs"
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore programs
            </motion.a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-blue-100/70"
          >
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-blue-400" /> Practical projects</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-blue-400" /> Guided learning</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-blue-400" /> Career-focused skills</span>
          </motion.div>
        </motion.div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="relative z-10 mx-auto -mt-8 max-w-[1120px] px-4 pb-24 sm:px-6">
        <motion.div style={{ y: dashboardY }}>
          <motion.div
            initial={{ opacity: 0, y: 70, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#101936]/95 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          >
            <div className="flex h-[65px] items-center justify-between border-b border-white/10 px-4 sm:px-7">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600"><Brain size={18} /></span>
                <span className="font-bold">SkillSync <span className="text-blue-400">AI</span></span>
              </div>
              <div className="mx-5 hidden max-w-[390px] flex-1 items-center gap-2 rounded-lg border border-white/10 bg-[#0b1430] px-3 py-2 md:flex">
                <Search size={15} className="text-slate-500" />
                <span className="text-xs text-slate-500">Search courses, topics, instructors...</span>
              </div>
              <div className="flex items-center gap-3"><Bell size={17} className="text-slate-400" /><CircleUserRound size={25} className="text-indigo-300" /></div>
            </div>

            <div className="grid min-h-[410px] md:grid-cols-[175px_1fr]">
              <aside className="hidden border-r border-white/10 bg-[#0c1530] p-4 md:block">
                <p className="mb-4 px-3 text-[10px] uppercase tracking-widest text-slate-500">Workspace</p>
                {[
                  ["Dashboard", LayoutDashboard],
                  ["My Courses", BookOpen],
                  ["Schedule", CalendarDays],
                  ["Achievements", Trophy],
                ].map(([label, Icon], i) => {
                  const ItemIcon = Icon as typeof LayoutDashboard;
                  return (
                    <motion.div
                      key={label as string}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className={`mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs ${i === 0 ? "bg-blue-500/15 text-blue-300" : "text-slate-400"}`}
                    >
                      <ItemIcon size={15} />{label as string}
                    </motion.div>
                  );
                })}
                <p className="mb-4 mt-8 px-3 text-[10px] uppercase tracking-widest text-slate-500">Insights</p>
                <div className="flex items-center gap-3 px-3 py-2 text-xs text-slate-400"><BarChart3 size={15} /> My Progress</div>
              </aside>

              <div className="min-w-0 p-4 sm:p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div><p className="text-lg font-bold">Welcome back, Learner!</p><p className="mt-1 text-xs text-slate-400">Your learning progress and activity</p></div>
                  <span className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold">+ New Course</span>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
                  {[
                    { label: "Learning Hours", value: "42.5", icon: Clock3 },
                    { label: "Completed Courses", value: "08", icon: Trophy },
                    { label: "Skill Points", value: "1,250", icon: TrendingUp },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
                      whileHover={{ y: -4 }}
                      className={`rounded-xl border border-white/10 bg-[#0b1430] p-3 sm:p-4 ${i === 2 ? "col-span-2 lg:col-span-1" : ""}`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400">{stat.label}<stat.icon size={16} className="text-blue-400" /></div>
                      <p className="mt-2 text-xl font-bold">{stat.value}</p>
                      <p className="mt-1 text-[10px] text-emerald-400">↑ Learning progress</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                  <div>
                    <h3 className="mb-4 text-sm font-bold">Continue Learning</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { name: "Generative AI Foundations", progress: 65, icon: Brain },
                        { name: "Data Analytics Essentials", progress: 35, icon: BarChart3 },
                      ].map((course, i) => (
                        <motion.div
                          key={course.name}
                          whileHover={{ y: -5 }}
                          className="overflow-hidden rounded-xl border border-white/10 bg-[#0b1430]"
                        >
                          <div className="flex h-[100px] items-center justify-center bg-gradient-to-br from-blue-500/20 to-violet-500/10">
                            <motion.div
                              animate={{ y: [0, -6, 0] }}
                              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <course.icon size={40} className="text-blue-300" />
                            </motion.div>
                          </div>
                          <div className="p-3">
                            <p className="text-xs font-bold">{course.name}</p>
                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${course.progress}%` }}
                                viewport={{ once: false }}
                                transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
                                className="h-full rounded-full bg-blue-500"
                              />
                            </div>
                            <p className="mt-2 text-[10px] text-slate-400">{course.progress}% completed</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#0b1430] p-4">
                    <p className="text-xs font-bold">Current Course</p>
                    <div className="mt-3 rounded-lg bg-indigo-500/10 p-3">
                      <motion.div
                        animate={{ rotate: [0, 12, -12, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-fit"
                      >
                        <Sparkles size={22} className="text-indigo-300" />
                      </motion.div>
                      <p className="mt-3 text-xs font-bold">AI & Prompt Engineering</p>
                      <p className="mt-2 text-[10px] text-slate-400">Progress · 65%</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "65%" }}
                          viewport={{ once: false }}
                          transition={{ duration: 1.2, delay: 0.7, ease: EASE }}
                          className="h-full rounded-full bg-blue-500"
                        />
                      </div>
                      <span className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-[10px] font-semibold"><Play size={12} /> Continue Learning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <p className="mt-5 text-center text-[10px] uppercase tracking-[3px] text-blue-300/60">Illustrative learning dashboard preview</p>
        </motion.div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className={sectionClass}>
        <div className="mx-auto w-full max-w-[1180px]">
          <Heading
            eyebrow="Explore our programs"
            title="Learn skills that move"
            highlight="you forward."
            description="Discover practical programmes designed to help you understand emerging technologies, build real-world skills and grow with confidence."
          />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {programs.map((p) => (
              <motion.article
                key={p.title}
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="group flex flex-col rounded-2xl border border-white/10 bg-[#111b3b]/80 p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition-colors hover:border-blue-400/40 hover:shadow-blue-500/10"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${p.color}`}
                >
                  <p.icon size={26} />
                </motion.div>
                <p className="text-[9px] font-bold tracking-[1.4px] text-blue-300">{p.category}</p>
                <h3 className="mt-3 min-h-[55px] text-lg font-bold leading-6">{p.title}</h3>
                <p className="mt-3 flex-1 text-xs leading-6 text-slate-400">{p.description}</p>
                <div className="mt-6 flex justify-between border-t border-white/10 pt-4 text-[10px] text-slate-400"><span>{p.level}</span><span>{p.duration}</span></div>
                <a href="#register" className="mt-5 flex items-center justify-between rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-xs font-semibold text-blue-300 transition group-hover:bg-blue-600 group-hover:text-white">
                  Enquire about program
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </a>
              </motion.article>
            ))}
          </motion.div>

          <p className="mt-6 text-center text-[10px] text-slate-500">Programme names and durations are illustrative prototype content.</p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="about" className={sectionClass}>
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.span variants={popIn} className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300"><Sparkles size={14} /> The SkillSync advantage</motion.span>
            <motion.h2 variants={fadeLeft} className="mt-6 text-3xl font-bold leading-tight sm:text-4xl md:text-[45px]">
              More than learning.
              <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">A step towards your future.</span>
            </motion.h2>
            <motion.p variants={fadeLeft} className="mt-6 max-w-[430px] text-sm leading-7 text-slate-400">Learning should go beyond watching videos. Build practical knowledge, explore emerging technologies and develop skills you can apply to real-world challenges.</motion.p>
            <motion.a
              variants={fadeUp}
              href="#programs"
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold hover:bg-blue-500"
            >
              Explore programs <ArrowRight size={16} />
            </motion.a>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {features.map((f) => (
              <motion.article
                key={f.title}
                variants={popIn}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="rounded-2xl border border-white/10 bg-[#111b3b]/80 p-6 backdrop-blur-xl transition-colors hover:border-blue-400/30"
              >
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}
                >
                  <f.icon size={23} />
                </motion.div>
                <h3 className="mt-5 font-bold">{f.title}</h3>
                <p className="mt-3 text-xs leading-6 text-slate-400">{f.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className={sectionClass}>
        <div className="mx-auto w-full max-w-[1120px]">
          <Heading eyebrow="Your learning journey" title="Your journey to" highlight="smarter learning." description="Getting started is simple. Follow a guided path from discovering your interests to building practical skills." />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
              className="absolute left-[12%] right-[12%] top-[34px] hidden h-px origin-left bg-gradient-to-r from-blue-400/20 via-indigo-400/50 to-violet-400/20 lg:block"
            />
            {steps.map((s, i) => (
              <motion.div key={s.title} variants={fadeUp} className="relative z-10 text-center">
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-blue-300/20 bg-[#17234a] text-blue-300 shadow-lg shadow-blue-950/30"
                >
                  <s.icon size={27} />
                </motion.div>
                <span className="mt-5 block text-[10px] font-bold tracking-[2px] text-blue-300">STEP 0{i + 1}</span>
                <h3 className="mt-3 font-bold">{s.title}</h3>
                <p className="mx-auto mt-3 max-w-[230px] text-xs leading-6 text-slate-400">{s.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-14 text-center">
            <motion.a
              href="#register"
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold hover:bg-blue-500"
            >
              Start your journey <ArrowRight size={16} />
            </motion.a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={sectionClass}>
        <div className="mx-auto grid w-full max-w-[1100px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.span variants={popIn} className="inline-block rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300">Got questions?</motion.span>
            <motion.h2 variants={fadeLeft} className="mt-6 text-3xl font-bold sm:text-4xl">Everything you need to know.</motion.h2>
            <motion.p variants={fadeLeft} className="mt-5 text-sm leading-7 text-slate-400">Find answers to common questions about our programmes, learning approach and registration process.</motion.p>
            <motion.a variants={fadeUp} href="#register" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300">Still have questions? Enquire now <ArrowRight size={15} /></motion.a>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
            className="space-y-3"
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.question}
                variants={fadeUp}
                className={`overflow-hidden rounded-xl border bg-[#111b3b]/80 backdrop-blur-xl transition-colors ${openFaq === i ? "border-blue-400/30" : "border-white/10"}`}
              >
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left">
                  <span className="text-sm font-semibold text-white">{faq.question}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-blue-400"><ChevronDown size={19} /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-xs leading-7 text-slate-400">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* REGISTRATION */}
      <section id="register" className={sectionClass}>
        <div className="mx-auto grid w-full max-w-[1100px] gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            className="flex flex-col justify-center"
          >
            <motion.span variants={popIn} className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300"><GraduationCap size={15} /> Take the next step</motion.span>
            <motion.h2 variants={fadeLeft} className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">Let&apos;s find the right <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">learning path</span> for you.</motion.h2>
            <motion.p variants={fadeLeft} className="mt-5 text-sm leading-7 text-slate-400">Tell us a little about yourself and the programme you are interested in. Submit an enquiry to express your interest and explore the next steps.</motion.p>
            <div className="mt-8 space-y-4 text-sm text-slate-300">
              {["Share your learning interests", "Choose a programme to explore", "Request programme information"].map((t) => (
                <motion.div key={t} variants={fadeLeft} className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-400" /> {t}</motion.div>
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="rounded-2xl border border-white/10 bg-[#111b3b]/90 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8"
          >
            <div className="mb-7">
              <h3 className="text-xl font-bold">Register your interest</h3>
              <p className="mt-2 text-xs text-slate-400">Fill in the details below to submit a demo enquiry.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="lead-name">Full name *</label>
                <div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input id="lead-name" className={`${inputClass} pl-10`} placeholder="Your full name" value={form.name} onChange={e => updateField("name", e.target.value)} required /></div>
              </div>

              <div>
                <label className={labelClass} htmlFor="lead-email">Email address *</label>
                <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input id="lead-email" type="email" className={`${inputClass} pl-10`} placeholder="you@example.com" value={form.email} onChange={e => updateField("email", e.target.value)} required /></div>
              </div>

              <div>
                <label className={labelClass} htmlFor="lead-phone">Phone number *</label>
                <div className="relative"><Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input id="lead-phone" type="tel" className={`${inputClass} pl-10`} placeholder="+91 98765 43210" value={form.phone} onChange={e => updateField("phone", e.target.value)} required /></div>
              </div>

              <div>
                <label className={labelClass} htmlFor="lead-program">Interested programme *</label>
                <select id="lead-program" className={inputClass} value={form.program} onChange={e => updateField("program", e.target.value)} required>
                  <option value="" className="bg-[#0b1430]">Select a programme</option>
                  {programs.map(p => <option key={p.title} value={p.title} className="bg-[#0b1430]">{p.title}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="lead-enquiry">What would you like to know?</label>
                <select id="lead-enquiry" className={inputClass} value={form.enquiryType} onChange={e => updateField("enquiryType", e.target.value)}>
                  <option className="bg-[#0b1430]">Course information</option>
                  <option className="bg-[#0b1430]">Fees and schedule</option>
                  <option className="bg-[#0b1430]">Eligibility and prerequisites</option>
                  <option className="bg-[#0b1430]">General enquiry</option>
                </select>
              </div>
            </div>

            <AnimatePresence>
              {formError && (
                <motion.p
                  key="error"
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-xs text-rose-400"
                >
                  {formError}
                </motion.p>
              )}
              {formStatus === "success" && (
                <motion.p
                  key="success"
                  role="status"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-400"
                >
                  <CheckCircle2 size={17} /> Demo enquiry submitted successfully!
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
            >
              Submit enquiry <Send size={16} />
            </motion.button>
            <p className="mt-4 text-center text-[10px] leading-5 text-slate-500">Prototype only: form submissions are handled in the browser and are not stored or sent to a server.</p>
          </motion.form>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 overflow-hidden border-y border-white/[0.06] bg-[#111b46]/65 px-6 py-24 sm:py-28">
        <div className="absolute inset-0 bg-[#111b46]/30" />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          className="relative mx-auto max-w-[760px] text-center"
        >
          <motion.span variants={popIn} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-200"><Sparkles size={14} /> Your future starts with one step</motion.span>
          <motion.h2 variants={fadeUp} className="mt-7 text-3xl font-bold leading-tight sm:text-4xl md:text-[52px]">Ready to build your future with <span className="bg-gradient-to-r from-blue-300 to-violet-300 bg-clip-text text-transparent">AI?</span></motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-[560px] text-sm leading-7 text-blue-100/70">Take the next step towards practical AI and digital skills. Explore our programmes and find a learning path that works for you.</motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <motion.a
              href="#register"
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              Register your interest <ArrowRight size={16} />
            </motion.a>
            <motion.a
              href="#programs"
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore programmes
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 bg-[#060a1b] px-6 pb-8 pt-16">
        <div className="mx-auto grid max-w-[1180px] gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <a href="/education" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600"><Brain size={21} /></span>
              <span className="text-xl font-bold">SkillSync <span className="text-blue-400">AI</span></span>
            </a>
            <p className="mt-5 max-w-[290px] text-xs leading-7 text-slate-400">A concept learning platform designed to help students and young professionals explore practical AI and digital skills.</p>
          </div>

          <div><h3 className="text-sm font-bold">Explore</h3><div className="mt-5 flex flex-col gap-4 text-xs text-slate-400"><a href="#programs" className="hover:text-white">Our Programs</a><a href="#how-it-works" className="hover:text-white">How It Works</a><a href="#about" className="hover:text-white">Why SkillSync</a></div></div>

          <div><h3 className="text-sm font-bold">Learning</h3><div className="mt-5 flex flex-col gap-4 text-xs text-slate-400"><a href="#register" className="hover:text-white">Register Interest</a><a href="#faq" className="hover:text-white">FAQs</a><a href="#register" className="hover:text-white">Enquire Now</a></div></div>

          <div><h3 className="text-sm font-bold">Get Started</h3><p className="mt-5 text-xs leading-6 text-slate-400">Interested in practical AI and digital skills?</p><a href="#register" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300">Talk to our team <ArrowRight size={14} /></a></div>
        </div>

        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] text-slate-500">© 2026 SkillSync AI. Concept prototype for Pawzz assignment.</p>
          <p className="text-[11px] text-slate-500">Learn smarter. Build your future.</p>
        </div>
      </footer>
    </main>
  );
}