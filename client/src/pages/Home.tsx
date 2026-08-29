/* Precision Notebook: editorial study ledger, warm canvas, graphite ink, cobalt progress signals. */
import { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useTheme } from "@/contexts/ThemeContext";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  ArrowUpRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Cloud,
  Compass,
  Flame,
  FolderKanban,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Library,
  Moon,
  Sun,
  Download,
  FileImage,
  FileText,
  Menu,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

type Course = {
  id: number;
  title: string;
  provider: string;
  category: string;
  lessons: number;
  done: number;
  time: string;
  accent: "blue" | "sage" | "orange";
  image?: string;
  url: string;
};

const initialCourses: Course[] = [
  {
    id: 1,
    title: "Azure Fundamentals",
    provider: "Microsoft Learn",
    category: "Azure",
    lessons: 12,
    done: 8,
    time: "2h 40m left",
    accent: "blue",
    image: "/manus-storage/cloud-pathway-illustration_3c3ae29a.jpg",
    url: "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
  },
  {
    id: 2,
    title: "Describe cloud concepts",
    provider: "Learning module",
    category: "In progress",
    lessons: 6,
    done: 3,
    time: "42m left",
    accent: "sage",
    url: "https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/",
  },
  {
    id: 3,
    title: "Secure your cloud journey",
    provider: "Microsoft Learn",
    category: "Security",
    lessons: 9,
    done: 0,
    time: "1h 55m",
    accent: "orange",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
  },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Analytics", icon: BarChart3 },
  { label: "My learning", icon: Library },
  { label: "Collections", icon: FolderKanban },
  { label: "Achievements", icon: Award },
];

const upcoming = [
  { day: "MON", date: "24", label: "Cloud concepts", meta: "Module 04 · 18 min", color: "blue", url: "https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/1-introduction/" },
  { day: "TUE", date: "25", label: "Azure architecture", meta: "Module 05 · 32 min", color: "ink", url: "https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/" },
  { day: "WED", date: "26", label: "Knowledge check", meta: "Quiz · 10 min", color: "orange", url: "https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/5-knowledge-check/" },
];

const progressHistory = [
  { week: "Jul 06", completed: 2, minutes: 38 },
  { week: "Jul 13", completed: 3, minutes: 52 },
  { week: "Jul 20", completed: 4, minutes: 74 },
  { week: "Jul 27", completed: 3, minutes: 61 },
  { week: "Aug 03", completed: 5, minutes: 98 },
  { week: "Aug 10", completed: 4, minutes: 86 },
  { week: "Aug 17", completed: 6, minutes: 112 },
  { week: "Aug 24", completed: 2, minutes: 34 },
];

const chartTooltipStyle = { background: "#fffefa", border: "1px solid #e1dfd7", borderRadius: 0, fontSize: 11, color: "#17212b" };

function ProgressBar({ value, color = "blue" }: { value: number; color?: string }) {
  return (
    <div className="progress-track" aria-label={`${value}% complete`}>
      <span className={`progress-fill ${color}`} style={{ width: `${value}%` }} />
      <span className="progress-ticks" aria-hidden="true">{[0, 1, 2, 3, 4].map((tick) => <i key={tick} />)}</span>
    </div>
  );
}

function AnalyticsView({ learner, totalComplete, theme, exporting, onBack, onThemeToggle, onExportImage, onExportPdf }: { learner: string; totalComplete: number; theme: "light" | "dark"; exporting: boolean; onBack: () => void; onThemeToggle: () => void; onExportImage: () => void; onExportPdf: () => void }) {
  const chartInk = theme === "dark" ? "#b2bfcb" : "#87918f";
  const chartGrid = theme === "dark" ? "#263642" : "#e8e6df";
  const chartTip = theme === "dark" ? { background: "#17232c", border: "1px solid #344651", borderRadius: 0, fontSize: 11, color: "#f2f6f8" } : chartTooltipStyle;
  return <div className="analytics-view" id="analytics-export-surface">
    <section className="analytics-heading"><div><div className="eyebrow"><span className="eyebrow-rule" /> PATHFINDER INSIGHTS</div><h1>Your learning, in motion.</h1><p>See how your focus is building over time, {learner.split(" ")[0]}.</p></div><div className="analytics-actions"><button className="theme-toggle analytics-theme" onClick={onThemeToggle}>{theme === "dark" ? <Sun size={15} /> : <Moon size={15} />} {theme === "dark" ? "Light mode" : "Dark mode"}</button><button className="outline-button" onClick={onBack}>Back to overview</button><button className="primary-button" onClick={onExportImage} disabled={exporting}><FileImage size={15} /> {exporting ? "Preparing…" : "Share image"}</button><button className="dark-button" onClick={onExportPdf} disabled={exporting}><FileText size={15} /> {exporting ? "Preparing…" : "Export PDF"}</button></div></section>
    <section className="analytics-summary"><div className="analytics-summary-card"><span className="section-kicker">PATH COMPLETION</span><strong>{totalComplete}<small> modules</small></strong><span>Across your active learning paths</span></div><div className="analytics-summary-card"><span className="section-kicker">STUDY TIME</span><strong>86<small> min</small></strong><span>Logged in the last 7 days</span></div><div className="analytics-summary-card"><span className="section-kicker">CURRENT STREAK</span><strong>4<small> days</small></strong><span>Best month-to-date: 6 days</span></div></section>
    <section className="chart-grid"><article className="chart-card chart-card-wide"><div className="chart-header"><div><div className="section-kicker">MODULES COMPLETED</div><h2>Progress over time</h2></div><span className="chart-legend"><i className="legend-blue" /> Modules</span></div><div className="chart-frame"><ResponsiveContainer width="100%" height="100%"><AreaChart data={progressHistory} margin={{ top: 8, right: 10, left: -22, bottom: 0 }}><defs><linearGradient id="cobaltArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#087efb" stopOpacity={0.22} /><stop offset="100%" stopColor="#087efb" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke={chartGrid} vertical={false} /><XAxis dataKey="week" tick={{ fill: chartInk, fontSize: 10 }} tickLine={false} axisLine={false} /><YAxis tick={{ fill: chartInk, fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} /><ChartTooltip contentStyle={chartTip} cursor={{ stroke: "#c7dcef" }} /><Area type="monotone" dataKey="completed" stroke="#087efb" strokeWidth={3} fill="url(#cobaltArea)" /></AreaChart></ResponsiveContainer></div></article><article className="chart-card"><div className="chart-header"><div><div className="section-kicker">STUDY MINUTES</div><h2>Weekly rhythm</h2></div><span className="chart-legend"><i className="legend-sage" /> Minutes</span></div><div className="chart-frame"><ResponsiveContainer width="100%" height="100%"><BarChart data={progressHistory.slice(-6)} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}><CartesianGrid stroke={chartGrid} vertical={false} /><XAxis dataKey="week" tick={{ fill: chartInk, fontSize: 10 }} tickLine={false} axisLine={false} /><YAxis tick={{ fill: chartInk, fontSize: 10 }} tickLine={false} axisLine={false} /><ChartTooltip contentStyle={chartTip} cursor={{ fill: "#f1f4ef" }} /><Bar dataKey="minutes" fill="#6fb58d" radius={[2, 2, 0, 0]} /></BarChart></ResponsiveContainer></div></article></section>
    <section className="export-sheet" id="progress-export-card"><div className="export-sheet-top"><div className="export-brand"><AppMark small /><span>PATHFINDER</span></div><span className="export-date">PROGRESS SNAPSHOT · AUG 24, 2026</span></div><div className="export-sheet-main"><div><span className="section-kicker">LEARNING PATH REPORT</span><h2>{learner.split(" ")[0]}’s momentum</h2><p>A focused snapshot of progress across Microsoft Learn paths.</p></div><strong className="export-score">67<span>%</span></strong></div><div className="export-sheet-bottom"><span><b>{totalComplete}</b> modules complete</span><span><b>4</b> day streak</span><span><b>86</b> study minutes this week</span><span>Pathfinder for Microsoft Learn</span></div></section>
  </div>;
}

function AppMark({ small = false }: { small?: boolean }) {
  return <img className={`app-mark-image ${small ? "small" : ""}`} src="/manus-storage/pathfinder-mark_7479ba9c.png" alt="Pathfinder mark" />;
}

function LoginScreen({ onSignIn }: { onSignIn: (email: string, remember: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !email.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 4) return setError("Password must be at least 4 characters.");
    onSignIn(email.trim(), remember);
  }

  return <div className="login-shell">
    <div className="login-aside"><div className="login-brand"><AppMark /><div><strong>PATHFINDER</strong><span>Microsoft Learn</span></div></div><div className="login-aside-copy"><span className="section-kicker">A CLEARER WAY TO LEARN</span><h1>Make the next hour count.</h1><p>See your progress, pick up where you left off, and open the exact Microsoft Learn material you need.</p><div className="login-proof"><span><Check size={14} /> Progress stays in view</span><span><Check size={14} /> Every module has a next step</span><span><Check size={14} /> Built for focused learners</span></div></div><small className="login-aside-foot">Pathfinder for Microsoft Learn · 2026</small></div>
    <main className="login-panel"><div className="login-panel-inner"><div className="login-panel-top"><span className="section-kicker">LEARNER WORKSPACE</span><span>New here? <button onClick={() => setError("Use the sign-in form to create a local workspace.")}>Create account</button></span></div><div className="login-form-heading"><h2>Sign in to Pathfinder</h2><p>Pick up your learning path without losing the thread.</p></div><form className="login-form" onSubmit={submit}><label>Email address<Input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} placeholder="you@example.com" autoComplete="email" /></label><label>Password<Input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Enter your password" autoComplete="current-password" /></label><div className="login-options"><label className="remember-option"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Keep me signed in</label><button type="button" onClick={() => setError("Password reset is available once a connected account is enabled.")}>Forgot password?</button></div>{error && <div className="login-error" role="alert">{error}</div>}<button className="primary-button login-submit" type="submit">Continue to workspace <ArrowUpRight size={16} /></button></form><div className="login-divider"><span>LOCAL WORKSPACE SIGN-IN</span></div><p className="login-note">This frontend stores your learner session in this browser. Connect Microsoft OAuth later to use production accounts.</p></div></main>
  </div>;
}

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [courses, setCourses] = useState(initialCourses);
  const [activeNav, setActiveNav] = useState("Overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<"path" | "coach" | "settings" | "streak" | "calendar" | "readiness" | "next" | "course-options" | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [newPath, setNewPath] = useState("Power BI Data Analyst");
  const [renameValue, setRenameValue] = useState("");
  const [focusDone, setFocusDone] = useState<number[]>([]);
  const [settings, setSettings] = useState({ reminders: true, weeklyDigest: true });
  const [learner, setLearner] = useState(() => typeof window !== "undefined" ? (localStorage.getItem("pathfinder-learner") || "") : "");
  const [exporting, setExporting] = useState(false);
  const { theme, toggleTheme } = useTheme();

  async function exportProgress(kind: "image" | "pdf") {
    const surface = document.getElementById("analytics-export-surface");
    if (!surface) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(surface, { scale: 2, backgroundColor: theme === "dark" ? "#101820" : "#f7f5ef", useCORS: true });
      if (kind === "image") {
        const link = document.createElement("a");
        link.download = `pathfinder-progress-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("Progress image downloaded", { description: "Your shareable Pathfinder snapshot is ready." });
      } else {
        const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`pathfinder-progress-${new Date().toISOString().slice(0, 10)}.pdf`);
        toast.success("Progress PDF downloaded", { description: "Your Pathfinder report is ready to share." });
      }
    } catch { toast.error("Export could not be created", { description: "Try again from the analytics view." }); }
    finally { setExporting(false); }
  }

  function signIn(email: string, remember: boolean) {
    const displayName = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    setLearner(displayName);
    if (remember) localStorage.setItem("pathfinder-learner", displayName); else sessionStorage.setItem("pathfinder-learner", displayName);
    toast.success("Workspace unlocked", { description: `Good to have you here, ${displayName}.` });
  }

  function signOut() {
    localStorage.removeItem("pathfinder-learner");
    sessionStorage.removeItem("pathfinder-learner");
    setLearner("");
    toast("Signed out of Pathfinder");
  }

  function openLearn(url: string, label: string) {
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Opening Microsoft Learn", { description: label });
  }

  const totalComplete = useMemo(
    () => courses.reduce((sum, course) => sum + course.done, 0),
    [courses],
  );
  const filteredCourses = courses.filter((course) =>
    `${course.title} ${course.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  if (!learner) return <LoginScreen onSignIn={signIn} />;
  if (activeNav === "Analytics") return <AnalyticsView learner={learner} totalComplete={totalComplete} theme={theme} exporting={exporting} onBack={() => setActiveNav("Overview")} onThemeToggle={() => toggleTheme?.()} onExportImage={() => exportProgress("image")} onExportPdf={() => exportProgress("pdf")} />;

  function handleNav(label: string) {
    setActiveNav(label);
    setMobileNavOpen(false);
    if (label === "Analytics") return;
    if (label === "My learning") setDialog("path");
    if (label === "Collections") setDialog("path");
    if (label === "Achievements") setDialog("readiness");
    if (label === "Overview") toast.success("Overview selected", { description: `${totalComplete} modules are marked complete.` });
  }

  function openCourseOptions(course: Course) {
    setSelectedCourseId(course.id);
    setRenameValue(course.title);
    setDialog("course-options");
  }

  function addPath() {
    const nextId = Math.max(...courses.map((course) => course.id)) + 1;
    setCourses((current) => [...current, { id: nextId, title: newPath, provider: "Microsoft Learn", category: "New path", lessons: 8, done: 0, time: "2h 10m", accent: "orange", url: "https://learn.microsoft.com/en-us/training/" }]);
    setDialog(null);
    setShowAll(true);
    toast.success("Learning path added", { description: `${newPath} is now in your workspace.` });
  }

  function saveRename() {
    if (!selectedCourseId || !renameValue.trim()) return;
    setCourses((current) => current.map((course) => course.id === selectedCourseId ? { ...course, title: renameValue.trim() } : course));
    setDialog(null);
    toast.success("Path renamed");
  }

  function archiveSelected() {
    if (!selectedCourseId) return;
    const course = courses.find((item) => item.id === selectedCourseId);
    setCourses((current) => current.filter((item) => item.id !== selectedCourseId));
    setDialog(null);
    toast.success("Path archived", { description: `${course?.title ?? "The path"} was removed from your active workspace.` });
  }

  function duplicateSelected() {
    const course = courses.find((item) => item.id === selectedCourseId);
    if (!course) return;
    const nextId = Math.max(...courses.map((item) => item.id)) + 1;
    setCourses((current) => [...current, { ...course, id: nextId, title: `${course.title} · Copy`, done: 0 }]);
    setDialog(null);
    setShowAll(true);
    toast.success("Path duplicated");
  }

  function completeNext() {
    setCourses((current) =>
      current.map((course, index) =>
        index === 0 ? { ...course, done: Math.min(course.done + 1, course.lessons) } : course,
      ),
    );
    toast.success("Module marked complete", { description: "Your Azure Fundamentals progress is up to date." });
  }

  return (
    <div className="tracker-app">
      <aside className={`sidebar ${mobileNavOpen ? "is-open" : ""}`}>
        <div className="sidebar-top">
          <div className="brand-lockup">
            <AppMark />
            <div>
              <div className="brand-name">PATHFINDER</div>
              <div className="brand-subtitle">Microsoft Learn</div>
            </div>
          </div>
          <button className="icon-button mobile-close" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-label">Workspace</div>
        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleNav(item.label)}
              >
                <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} />
                <span>{item.label}</span>
                {item.label === "Achievements" && <span className="nav-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-label spaced">Your paths</div>
        <div className="path-list">
          <button className="path-row" onClick={() => openLearn(initialCourses[0].url, "Azure Fundamentals")}>
            <span className="path-icon azure"><Cloud size={15} /></span>
            <span>Azure Fundamentals</span>
            <span className="path-percent">67%</span>
          </button>
          <button className="path-row" onClick={() => openLearn(initialCourses[1].url, "Describe cloud service types")}>
            <span className="path-icon power"><Zap size={15} /></span>
            <span>Power Platform</span>
            <span className="path-percent">24%</span>
          </button>
          <button className="path-row muted" onClick={() => setDialog("path")}>
            <span className="path-icon add"><Plus size={15} /></span>
            <span>Add a path</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="mini-coach-card">
            <div className="coach-kicker"><Sparkles size={13} /> Study coach</div>
            <p>Make the next hour count.</p>
            <button onClick={() => setDialog("coach")}>View focus plan <ArrowUpRight size={14} /></button>
          </div>
          <button className="nav-item secondary-nav" onClick={() => setDialog("settings")}>
            <Settings2 size={17} /> <span>Settings</span>
          </button>
          <button className="profile-row" onClick={signOut} aria-label="Sign out of Pathfinder">
            <div className="avatar">{learner.slice(0, 2).toUpperCase()}</div>
            <div className="profile-copy"><strong>{learner}</strong><span>Cloud learner · Sign out</span></div>
            <MoreHorizontal size={18} className="profile-more" />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-trigger" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button>
          <div className="topbar-left"><div className="topbar-brand"><AppMark small /><span>PATHFINDER</span></div><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activeNav}</strong></div></div>
            <div className="topbar-actions">
            <span className="sync-chip"><span className="sync-dot" /> Synced 08:42</span>
            <button className="theme-toggle top-theme-toggle" onClick={() => toggleTheme?.()} aria-label="Toggle dark mode">{theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}<span>{theme === "dark" ? "Light" : "Dark"}</span></button>
            <label className="search-box">
              <Search size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your learning" aria-label="Search your learning" />
              <span className="shortcut">⌘ K</span>
            </label>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => toast("You're all caught up.")}><Bell size={18} /><span /></button>
            <div className="top-avatar">{learner.slice(0, 2).toUpperCase()}</div>
          </div>
        </header>

        <div className="page-wrap">
          <section className="page-heading reveal-one">
            <div>
              <div className="eyebrow"><span className="eyebrow-rule" /> MONDAY, AUGUST 24, 2026</div>
              <h1>Good morning, {learner.split(" ")[0]}.</h1>
              <p>Take the next module. Your momentum is already doing the work.</p>
            </div>
            <button className="outline-button" onClick={() => setDialog("path")}><Plus size={17} /> Add learning path</button>
          </section>

          <section className="overview-grid reveal-two">
            <article className="hero-card">
              <div className="hero-card-copy">
                <div className="card-kicker"><span className="blue-dot" /> CURRENT PATH</div>
                <h2>Azure Fundamentals</h2>
                <p>Build a working foundation in cloud concepts, services, and architecture.</p>
                <div className="hero-progress-row"><strong>67%</strong><span>8 of 12 modules complete</span></div>
                <ProgressBar value={67} />
                <div className="hero-card-footer"><button className="primary-button" onClick={() => { completeNext(); openLearn(initialCourses[1].url, "Describe cloud service types"); }}><Play size={15} fill="currentColor" /> Continue learning</button><span className="last-studied"><Clock3 size={14} /> Last studied yesterday</span></div>
              </div>
              <div className="hero-image-wrap">
                <img src="/manus-storage/pathfinder-study-desk_1f988ccf.jpg" alt="Notebook, ruler, and study materials on a warm desk" />
                <div className="image-note"><span>Next up</span><strong>Describe cloud concepts</strong></div>
              </div>
            </article>

            <article className="streak-card">
              <div className="card-header"><div className="card-kicker"><Flame size={14} className="orange-icon" /> WEEKLY RHYTHM</div><button className="more-button" aria-label="More streak options" onClick={() => setDialog("streak")}><MoreHorizontal size={18} /></button></div>
              <div className="streak-number">4<span>days</span></div>
              <p className="streak-caption">Your longest streak this month</p>
              <div className="week-dots">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <div className="day-cell" key={`${day}-${index}`}><span className={`day-dot ${index < 4 ? "done" : index === 4 ? "today" : ""}`}>{index < 4 ? <Check size={12} /> : ""}</span><small>{day}</small></div>)}
              </div>
              <div className="streak-foot"><TrendingUp size={14} /> <span>+2 from last week</span></div>
            </article>
          </section>

          <section className="quick-stats reveal-three">
            <div className="quick-stat"><span className="quick-stat-icon blue"><BarChart3 size={16} /></span><div><strong>{totalComplete} modules</strong><span>marked complete</span></div><span className="stat-trend">+2 this week</span></div>
            <div className="quick-stat"><span className="quick-stat-icon sage"><Gauge size={16} /></span><div><strong>86 min</strong><span>study time this week</span></div><span className="stat-trend sage-text">on pace</span></div>
            <div className="quick-stat"><span className="quick-stat-icon orange"><Compass size={16} /></span><div><strong>2 days</strong><span>ahead of last week</span></div><span className="stat-trend orange-text">steady</span></div>
          </section>

          <section className="section-block reveal-three">
            <div className="section-heading"><div><div className="section-kicker">KEEP MOVING</div><h2>Your learning paths</h2></div><button className="text-button" onClick={() => setShowAll(!showAll)}>{showAll ? "Show less" : "View all paths"} <ArrowUpRight size={15} /></button></div>
            <div className="path-cards">
              {filteredCourses.slice(0, showAll ? 3 : 2).map((course, index) => {
                const percent = Math.round((course.done / course.lessons) * 100);
                return <article className={`course-card course-${course.accent}`} key={course.id}>
                  <div className="course-top"><span className="course-icon">{course.accent === "blue" ? <Cloud size={20} /> : course.accent === "sage" ? <BookOpen size={20} /> : <Target size={20} />}</span><button className="more-button" aria-label={`More options for ${course.title}`} onClick={() => openCourseOptions(course)}><MoreHorizontal size={18} /></button></div>
                  <div className="course-content"><span className="course-category">{course.category}</span><h3>{course.title}</h3><p>{course.provider}</p></div>
                  {course.image && <img className="course-thumb" src={course.image} alt="Abstract cloud pathway illustration" />}
                  <div className="course-progress"><div className="course-progress-label"><span>{course.done}/{course.lessons} modules</span><strong>{percent}%</strong></div><ProgressBar value={percent} color={course.accent} /></div>
                  <button className="course-action" onClick={() => course.done === course.lessons ? toast.success("Path complete — nice work!") : (course.id === 1 ? completeNext() : null, openLearn(course.url, course.title))}>{course.done === 0 ? "Open path" : "Continue"} <ChevronRight size={15} /></button>
                </article>;
              })}
              {filteredCourses.length > 0 && !showAll && !query && <aside className="path-annotation"><div className="annotation-rule" /><div className="section-kicker">FIELD NOTES</div><p>Two paths in motion. One clear next move.</p><span><CheckCircle2 size={13} /> Synced with your study plan</span><small>Last updated 08:42</small></aside>}
              {filteredCourses.length === 0 && <div className="empty-state"><Search size={20} /><strong>No matching paths</strong><span>Try a different search.</span></div>}
            </div>
          </section>

          <section className="lower-grid reveal-four">
            <article className="next-card">
              <div className="section-heading compact"><div><div className="section-kicker">THE NEXT MOVE</div><h2>The next module is ready</h2></div><span className="flag-mark"><span /></span></div>
              <div className="next-content">
                <div className="next-number">04</div>
                <div className="next-copy"><span className="course-category">MODULE 04 · AZURE FUNDAMENTALS</span><h3>Describe cloud service types</h3><p>Understand IaaS, PaaS, and SaaS — and when to use each one.</p><div className="next-meta"><span><Clock3 size={14} /> 18 min</span><span><BookOpen size={14} /> 1 knowledge check</span></div></div>
                <button className="circle-arrow" aria-label="Open next module" onClick={() => openLearn("https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/", "Describe cloud service types") }><ArrowUpRight size={19} /></button>
              </div>
            </article>

            <article className="readiness-card">
              <div className="readiness-art"><img src="/manus-storage/certification-badge-study_2a799bfd.jpg" alt="Notebook and certification study marker" /></div>
              <div className="card-header"><div><div className="section-kicker">CERTIFICATION</div><h2>AZ-900 readiness</h2></div><GraduationCap size={22} className="readiness-icon" /></div>
              <div className="readiness-body"><div className="readiness-score">42<span>%</span></div><div className="readiness-copy"><strong>Foundational</strong><span>Keep building your core skills</span></div></div>
              <ProgressBar value={42} color="orange" />
              <div className="readiness-foot"><span>Est. 3 weeks at your pace</span><button onClick={() => openLearn("https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/", "AZ-900 certification")}>See certification <ArrowUpRight size={14} /></button></div>
            </article>
          </section>

          <section className="section-block upcoming-block reveal-five">
            <div className="section-heading"><div><div className="section-kicker">YOUR WEEK</div><h2>Upcoming study plan</h2></div><button className="text-button" onClick={() => setDialog("calendar")}>Open calendar <ArrowUpRight size={15} /></button></div>
            <div className="upcoming-list">{upcoming.map((item, index) => <button className="upcoming-row" key={`${item.day}-${item.date}`} onClick={() => openLearn(item.url, item.label)}><div className="date-block"><small>{item.day}</small><strong>{item.date}</strong></div><div className={`upcoming-marker ${item.color}`}><span /></div><div className="upcoming-copy"><strong>{item.label}</strong><span>{item.meta}</span></div><span className="upcoming-status">{index === 0 ? <span className="today-label">Today</span> : <ChevronRight size={16} />}</span></button>)}</div>
          </section>

          <footer className="page-footer"><span><AppMark small /> Pathfinder for Microsoft Learn</span><span>Progress is a practice, not a finish line.</span></footer>
        </div>

        <Dialog open={dialog === "path"} onOpenChange={(open) => !open && setDialog(null)}>
          <DialogContent className="tracker-dialog">
            <DialogHeader><DialogTitle>Add a learning path</DialogTitle><DialogDescription>Pick a Microsoft Learn path to add to your active workspace.</DialogDescription></DialogHeader>
            <div className="path-picker-grid">
              {["Power BI Data Analyst", "Azure AI Fundamentals", "Microsoft 365 Fundamentals"].map((path) => <button key={path} className={`path-picker-option ${newPath === path ? "selected" : ""}`} onClick={() => setNewPath(path)}><span className="picker-number">0{["Power BI Data Analyst", "Azure AI Fundamentals", "Microsoft 365 Fundamentals"].indexOf(path) + 1}</span><span><strong>{path}</strong><small>{path.includes("Azure") ? "Azure · 8 modules" : path.includes("Power BI") ? "Data · 10 modules" : "Microsoft 365 · 7 modules"}</small></span><Check size={16} /></button>)}
            </div>
            <DialogFooter><button className="outline-button" onClick={() => setDialog(null)}>Cancel</button><button className="primary-button" onClick={addPath}>Add selected path</button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={dialog === "coach"} onOpenChange={(open) => !open && setDialog(null)}>
          <DialogContent className="tracker-dialog">
            <DialogHeader><DialogTitle>Today’s focus plan</DialogTitle><DialogDescription>A compact 45-minute block built around your Azure Fundamentals path.</DialogDescription></DialogHeader>
            <div className="focus-plan">{[{ title: "Review cloud service types", meta: "12 min · Read", id: 1 }, { title: "Complete the knowledge check", meta: "10 min · Practice", id: 2 }, { title: "Write one real-world example", meta: "15 min · Reflect", id: 3 }].map((item) => <button className={`focus-row ${focusDone.includes(item.id) ? "complete" : ""}`} key={item.id} onClick={() => setFocusDone((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])}><span className="focus-check">{focusDone.includes(item.id) && <Check size={13} />}</span><span><strong>{item.title}</strong><small>{item.meta}</small></span><ChevronRight size={15} /></button>)}</div>
            <DialogFooter><button className="primary-button" onClick={() => { setDialog(null); toast.success("Focus plan started"); }}>Start focus block <Play size={14} fill="currentColor" /></button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={dialog === "settings"} onOpenChange={(open) => !open && setDialog(null)}>
          <DialogContent className="tracker-dialog">
            <DialogHeader><DialogTitle>Study preferences</DialogTitle><DialogDescription>Keep the workspace tuned to the way you learn.</DialogDescription></DialogHeader>
            <div className="settings-list"><label className="setting-row"><span><strong>Daily study reminders</strong><small>Get a nudge when your planned block is due.</small></span><input type="checkbox" checked={settings.reminders} onChange={(event) => setSettings({ ...settings, reminders: event.target.checked })} /></label><label className="setting-row"><span><strong>Weekly progress digest</strong><small>A Sunday summary of modules, streaks, and next steps.</small></span><input type="checkbox" checked={settings.weeklyDigest} onChange={(event) => setSettings({ ...settings, weeklyDigest: event.target.checked })} /></label></div>
            <DialogFooter><button className="primary-button" onClick={() => { setDialog(null); toast.success("Preferences saved"); }}>Save preferences</button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={dialog === "streak"} onOpenChange={(open) => !open && setDialog(null)}>
          <DialogContent className="tracker-dialog compact-dialog"><DialogHeader><DialogTitle>Your weekly rhythm</DialogTitle><DialogDescription>Four focused days already logged this week. Keep Friday light and intentional.</DialogDescription></DialogHeader><div className="streak-detail"><div className="detail-stat"><strong>4</strong><span>days in a row</span></div><div className="detail-stat"><strong>86<span>m</span></strong><span>study time this week</span></div><div className="detail-note"><TrendingUp size={15} /> You’re 2 days ahead of last week.</div></div><DialogFooter><button className="primary-button" onClick={() => { setDialog(null); toast("Friday study block added"); }}>Plan Friday block</button></DialogFooter></DialogContent>
        </Dialog>

        <Dialog open={dialog === "calendar"} onOpenChange={(open) => !open && setDialog(null)}>
          <DialogContent className="tracker-dialog"><DialogHeader><DialogTitle>Upcoming study plan</DialogTitle><DialogDescription>Plan the next few small moves instead of waiting for a free afternoon.</DialogDescription></DialogHeader><div className="calendar-detail">{upcoming.map((item, index) => <div className="calendar-detail-row" key={item.date}><span className={`calendar-dot ${item.color}`} /><div><strong>{item.day} · {item.label}</strong><small>{item.meta}</small></div><button className="small-action" onClick={() => toast.success(`${item.label} marked as planned`)}>{index === 0 ? "Planned" : "Add"}</button></div>)}</div><DialogFooter><button className="primary-button" onClick={() => { setDialog(null); toast.success("Study session added to your plan"); }}>Add a study session <Plus size={14} /></button></DialogFooter></DialogContent>
        </Dialog>

        <Dialog open={dialog === "readiness"} onOpenChange={(open) => !open && setDialog(null)}>
          <DialogContent className="tracker-dialog"><DialogHeader><DialogTitle>AZ-900 readiness breakdown</DialogTitle><DialogDescription>Three milestones are shaping your current readiness score.</DialogDescription></DialogHeader><div className="milestone-list">{[["Cloud concepts", 78], ["Azure architecture", 42], ["Core services", 19]].map(([label, value]) => <div className="milestone" key={label as string}><div><strong>{label}</strong><span>{value}%</span></div><ProgressBar value={value as number} color="orange" /></div>)}</div><DialogFooter><button className="primary-button" onClick={() => openLearn("https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/", "Next AZ-900 milestone")}>Open next milestone <ArrowUpRight size={14} /></button></DialogFooter></DialogContent>
        </Dialog>

        <Dialog open={dialog === "next"} onOpenChange={(open) => !open && setDialog(null)}>
          <DialogContent className="tracker-dialog"><DialogHeader><DialogTitle>Describe cloud service types</DialogTitle><DialogDescription>Module 04 · Azure Fundamentals · 18 minutes</DialogDescription></DialogHeader><div className="module-preview"><div className="module-number-large">04</div><div><p>Understand the difference between IaaS, PaaS, and SaaS, then choose the right model for real-world scenarios.</p><div className="module-preview-meta"><span><BookOpen size={14} /> 3 lessons</span><span><CircleHelp size={14} /> 1 knowledge check</span></div></div></div><DialogFooter><button className="outline-button" onClick={() => setDialog(null)}>Close</button><button className="primary-button" onClick={() => { completeNext(); openLearn("https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/", "Describe cloud service types"); setDialog(null); }}>Open module in Learn <ArrowUpRight size={14} /></button></DialogFooter></DialogContent>
        </Dialog>

        <Dialog open={dialog === "course-options"} onOpenChange={(open) => !open && setDialog(null)}>
          <DialogContent className="tracker-dialog compact-dialog"><DialogHeader><DialogTitle>Path options</DialogTitle><DialogDescription>Make a quick adjustment to this learning path.</DialogDescription></DialogHeader><div className="course-option-panel"><label>Path name<Input value={renameValue} onChange={(event) => setRenameValue(event.target.value)} /></label><div className="option-actions"><button className="outline-button" onClick={saveRename}>Rename path</button><button className="outline-button" onClick={duplicateSelected}>Duplicate path</button><button className="danger-button" onClick={archiveSelected}>Archive path</button></div></div></DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
