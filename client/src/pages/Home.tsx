/* Precision Notebook: editorial study ledger, warm canvas, graphite ink, cobalt progress signals. */
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
  },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "My learning", icon: Library },
  { label: "Collections", icon: FolderKanban },
  { label: "Achievements", icon: Award },
];

const upcoming = [
  { day: "MON", date: "24", label: "Cloud concepts", meta: "Module 04 · 18 min", color: "blue" },
  { day: "TUE", date: "25", label: "Azure architecture", meta: "Module 05 · 32 min", color: "ink" },
  { day: "WED", date: "26", label: "Knowledge check", meta: "Quiz · 10 min", color: "orange" },
];

function ProgressBar({ value, color = "blue" }: { value: number; color?: string }) {
  return (
    <div className="progress-track" aria-label={`${value}% complete`}>
      <span className={`progress-fill ${color}`} style={{ width: `${value}%` }} />
      <span className="progress-ticks" aria-hidden="true">{[0, 1, 2, 3, 4].map((tick) => <i key={tick} />)}</span>
    </div>
  );
}

function AppMark({ small = false }: { small?: boolean }) {
  return <img className={`app-mark-image ${small ? "small" : ""}`} src="/manus-storage/pathfinder-mark_7479ba9c.png" alt="Pathfinder mark" />;
}

export default function Home() {
  const [courses, setCourses] = useState(initialCourses);
  const [activeNav, setActiveNav] = useState("Overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");

  const totalComplete = useMemo(
    () => courses.reduce((sum, course) => sum + course.done, 0),
    [courses],
  );
  const filteredCourses = courses.filter((course) =>
    `${course.title} ${course.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  function handleNav(label: string) {
    setActiveNav(label);
    setMobileNavOpen(false);
    if (label !== "Overview") toast(`${label} view is being prepared for your workspace.`);
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
          <button className="path-row" onClick={() => toast("Azure path selected") }>
            <span className="path-icon azure"><Cloud size={15} /></span>
            <span>Azure Fundamentals</span>
            <span className="path-percent">67%</span>
          </button>
          <button className="path-row" onClick={() => toast("Power Platform path selected") }>
            <span className="path-icon power"><Zap size={15} /></span>
            <span>Power Platform</span>
            <span className="path-percent">24%</span>
          </button>
          <button className="path-row muted" onClick={() => toast("Add a learning path to your workspace") }>
            <span className="path-icon add"><Plus size={15} /></span>
            <span>Add a path</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="mini-coach-card">
            <div className="coach-kicker"><Sparkles size={13} /> Study coach</div>
            <p>Make the next hour count.</p>
            <button onClick={() => toast("Study coach recommendations are coming soon.")}>View focus plan <ArrowUpRight size={14} /></button>
          </div>
          <button className="nav-item secondary-nav" onClick={() => toast("Settings are coming soon.")}>
            <Settings2 size={17} /> <span>Settings</span>
          </button>
          <div className="profile-row">
            <div className="avatar">AP</div>
            <div className="profile-copy"><strong>Alex Parker</strong><span>Cloud learner</span></div>
            <MoreHorizontal size={18} className="profile-more" />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-trigger" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button>
          <div className="topbar-left"><div className="topbar-brand"><AppMark small /><span>PATHFINDER</span></div><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activeNav}</strong></div></div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your learning" aria-label="Search your learning" />
              <span className="shortcut">⌘ K</span>
            </label>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => toast("You're all caught up.")}><Bell size={18} /><span /></button>
            <div className="top-avatar">AP</div>
          </div>
        </header>

        <div className="page-wrap">
          <section className="page-heading reveal-one">
            <div>
              <div className="eyebrow"><span className="eyebrow-rule" /> MONDAY, AUGUST 24, 2026</div>
              <h1>Good morning, Alex.</h1>
              <p>Take the next module. Your momentum is already doing the work.</p>
            </div>
            <button className="outline-button" onClick={() => toast("Learning path picker is coming soon.")}><Plus size={17} /> Add learning path</button>
          </section>

          <section className="overview-grid reveal-two">
            <article className="hero-card">
              <div className="hero-card-copy">
                <div className="card-kicker"><span className="blue-dot" /> CURRENT PATH</div>
                <h2>Azure Fundamentals</h2>
                <p>Build a working foundation in cloud concepts, services, and architecture.</p>
                <div className="hero-progress-row"><strong>67%</strong><span>8 of 12 modules complete</span></div>
                <ProgressBar value={67} />
                <div className="hero-card-footer"><button className="primary-button" onClick={completeNext}><Play size={15} fill="currentColor" /> Continue learning</button><span className="last-studied"><Clock3 size={14} /> Last studied yesterday</span></div>
              </div>
              <div className="hero-image-wrap">
                <img src="/manus-storage/pathfinder-study-desk_1f988ccf.jpg" alt="Notebook, ruler, and study materials on a warm desk" />
                <div className="image-note"><span>Next up</span><strong>Describe cloud concepts</strong></div>
              </div>
            </article>

            <article className="streak-card">
              <div className="card-header"><div className="card-kicker"><Flame size={14} className="orange-icon" /> WEEKLY RHYTHM</div><button className="more-button" aria-label="More streak options" onClick={() => toast("Streak details are coming soon.")}><MoreHorizontal size={18} /></button></div>
              <div className="streak-number">4<span>days</span></div>
              <p className="streak-caption">Your longest streak this month</p>
              <div className="week-dots">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <div className="day-cell" key={`${day}-${index}`}><span className={`day-dot ${index < 4 ? "done" : index === 4 ? "today" : ""}`}>{index < 4 ? <Check size={12} /> : ""}</span><small>{day}</small></div>)}
              </div>
              <div className="streak-foot"><TrendingUp size={14} /> <span>+2 from last week</span></div>
            </article>
          </section>

          <section className="section-block reveal-three">
            <div className="section-heading"><div><div className="section-kicker">KEEP MOVING</div><h2>Your learning paths</h2></div><button className="text-button" onClick={() => setShowAll(!showAll)}>{showAll ? "Show less" : "View all paths"} <ArrowUpRight size={15} /></button></div>
            <div className="path-cards">
              {filteredCourses.slice(0, showAll ? 3 : 2).map((course, index) => {
                const percent = Math.round((course.done / course.lessons) * 100);
                return <article className={`course-card course-${course.accent}`} key={course.id}>
                  <div className="course-top"><span className="course-icon">{course.accent === "blue" ? <Cloud size={20} /> : course.accent === "sage" ? <BookOpen size={20} /> : <Target size={20} />}</span><button className="more-button" aria-label={`More options for ${course.title}`} onClick={() => toast(`${course.title} options are coming soon.`)}><MoreHorizontal size={18} /></button></div>
                  <div className="course-content"><span className="course-category">{course.category}</span><h3>{course.title}</h3><p>{course.provider}</p></div>
                  {course.image && <img className="course-thumb" src={course.image} alt="Abstract cloud pathway illustration" />}
                  <div className="course-progress"><div className="course-progress-label"><span>{course.done}/{course.lessons} modules</span><strong>{percent}%</strong></div><ProgressBar value={percent} color={course.accent} /></div>
                  <button className="course-action" onClick={() => course.done === course.lessons ? toast.success("Path complete — nice work!") : (course.id === 1 ? completeNext() : toast(`Opening ${course.title}`))}>{course.done === 0 ? "Start path" : "Continue"} <ChevronRight size={15} /></button>
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
                <button className="circle-arrow" aria-label="Open next module" onClick={() => toast("Opening Describe cloud service types") }><ArrowUpRight size={19} /></button>
              </div>
            </article>

            <article className="readiness-card">
              <div className="readiness-art"><img src="/manus-storage/certification-badge-study_2a799bfd.jpg" alt="Notebook and certification study marker" /></div>
              <div className="card-header"><div><div className="section-kicker">CERTIFICATION</div><h2>AZ-900 readiness</h2></div><GraduationCap size={22} className="readiness-icon" /></div>
              <div className="readiness-body"><div className="readiness-score">42<span>%</span></div><div className="readiness-copy"><strong>Foundational</strong><span>Keep building your core skills</span></div></div>
              <ProgressBar value={42} color="orange" />
              <div className="readiness-foot"><span>Est. 3 weeks at your pace</span><button onClick={() => toast("Readiness breakdown is coming soon.")}>See breakdown <ArrowUpRight size={14} /></button></div>
            </article>
          </section>

          <section className="section-block upcoming-block reveal-five">
            <div className="section-heading"><div><div className="section-kicker">YOUR WEEK</div><h2>Upcoming study plan</h2></div><button className="text-button" onClick={() => toast("Calendar view is coming soon.")}>Open calendar <ArrowUpRight size={15} /></button></div>
            <div className="upcoming-list">{upcoming.map((item, index) => <button className="upcoming-row" key={`${item.day}-${item.date}`} onClick={() => toast(`Opening ${item.label}`)}><div className="date-block"><small>{item.day}</small><strong>{item.date}</strong></div><div className={`upcoming-marker ${item.color}`}><span /></div><div className="upcoming-copy"><strong>{item.label}</strong><span>{item.meta}</span></div><span className="upcoming-status">{index === 0 ? <span className="today-label">Today</span> : <ChevronRight size={16} />}</span></button>)}</div>
          </section>

          <footer className="page-footer"><span><AppMark small /> Pathfinder for Microsoft Learn</span><span>Progress is a practice, not a finish line.</span></footer>
        </div>
      </main>
    </div>
  );
}
