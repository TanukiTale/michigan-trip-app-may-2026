import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  ArrowUpRight,
  Backpack,
  CalendarDays,
  CheckCircle2,
  Coffee,
  Compass,
  House,
  Moon,
  NotebookPen,
  Route,
  Sparkles,
  Sun,
  Trees,
  UtensilsCrossed,
  Waves,
} from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { SectionHeader } from './components/SectionHeader';
import { TripDayCard } from './components/TripDayCard';
import { tripData } from './data/trip';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import type { NavSection } from './types/trip';

const sections = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'itinerary', label: 'Days', icon: CalendarDays },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'food', label: 'Food', icon: UtensilsCrossed },
  { id: 'packing', label: 'Packing', icon: Backpack },
  { id: 'route', label: 'Route', icon: Route },
  { id: 'notes', label: 'Notes', icon: NotebookPen },
] as const satisfies {
  id: NavSection;
  label: string;
  icon: typeof House;
}[];

function getTodayPlan() {
  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startDate = new Date(`${tripData.days[0].date}T00:00:00`);
  const endDate = new Date(`${tripData.days[tripData.days.length - 1].date}T00:00:00`);

  if (normalizedToday < startDate) {
    return {
      heading: 'Trip is upcoming',
      note: `Start with ${tripData.days[0].title} and keep the first day intentionally light.`,
      day: tripData.days[0],
    };
  }

  if (normalizedToday > endDate) {
    return {
      heading: 'Trip memory board',
      note: 'The plan becomes a scrapbook after the last Grand Haven morning.',
      day: tripData.days[tripData.days.length - 1],
    };
  }

  const activeDay =
    tripData.days.find((day) => {
      const current = new Date(`${day.date}T00:00:00`);
      return current.getTime() === normalizedToday.getTime();
    }) ?? tripData.days[0];

  return {
    heading: 'Today’s plan',
    note: activeDay.summary,
    day: activeDay,
  };
}

function getBirthdayLabel() {
  const today = new Date();
  const birthday = new Date('2026-05-25T00:00:00');
  const msPerDay = 1000 * 60 * 60 * 24;
  const distance = Math.ceil((birthday.getTime() - today.getTime()) / msPerDay);

  if (distance > 1) {
    return `${distance} days until birthday picnic`;
  }

  if (distance === 1) {
    return 'Birthday picnic is tomorrow';
  }

  if (distance === 0) {
    return 'Birthday day is here';
  }

  return 'Birthday spotlight: May 25';
}

function toggleId(id: string, setter: Dispatch<SetStateAction<string[]>>) {
  setter((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
}

const ludingtonHeroImage =
  'https://commons.wikimedia.org/wiki/Special:FilePath/Big%20Sable%20Point%20Lighthouse%20%28August%202023%29.jpg';

function App() {
  const todayPlan = getTodayPlan();
  const [theme, setTheme] = useLocalStorageState<'light' | 'dark'>('michigan-trip-theme', () => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [expandedDays, setExpandedDays] = useLocalStorageState<Record<string, boolean>>('michigan-trip-expanded-days', {
    '2026-05-24': true,
    '2026-05-25': true,
  });
  const [completedIds, setCompletedIds] = useLocalStorageState<string[]>('michigan-trip-completed', []);
  const [packingCheckedIds, setPackingCheckedIds] = useLocalStorageState<string[]>('michigan-trip-packing', []);
  const [activePackingCategoryId, setActivePackingCategoryId] = useLocalStorageState(
    'michigan-trip-packing-category',
    tripData.packing[0].id,
  );
  const [activeNoteDayId, setActiveNoteDayId] = useLocalStorageState('michigan-trip-note-day', tripData.days[0].id);
  const [noteDrafts, setNoteDrafts] = useLocalStorageState<Record<string, string>>('michigan-trip-note-drafts', {});
  const [dayNotes, setDayNotes] = useLocalStorageState<Record<string, string[]>>('michigan-trip-notes', {});

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    const observedSections = document.querySelectorAll<HTMLElement>('[data-section]');

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id as NavSection);
        }
      },
      {
        rootMargin: '-28% 0px -42% 0px',
        threshold: [0.2, 0.4, 0.6],
      },
    );

    observedSections.forEach((section) => observer.observe(section));

    return () => {
      observedSections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  function scrollToSection(section: NavSection) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function addNote(dayId: string) {
    const draft = noteDrafts[dayId]?.trim();

    if (!draft) {
      return;
    }

    setDayNotes((current) => ({
      ...current,
      [dayId]: [...(current[dayId] ?? []), draft],
    }));
    setNoteDrafts((current) => ({ ...current, [dayId]: '' }));
  }

  const packingItems = tripData.packing.flatMap((category) => category.items);
  const packingProgress = Math.round((packingCheckedIds.length / packingItems.length) * 100) || 0;
  const activePackingCategory =
    tripData.packing.find((category) => category.id === activePackingCategoryId) ?? tripData.packing[0];
  const activeNoteDay = tripData.days.find((day) => day.id === activeNoteDayId) ?? tripData.days[0];
  const activeDayNotes = dayNotes[activeNoteDay.id] ?? [];

  return (
    <div className="app-shell bottom-safe">
      <div className="mb-4 flex items-center justify-between px-1">
        <div>
          <p className="eyebrow">West Michigan birthday getaway</p>
          <h1 className="font-display text-[2rem] leading-none tracking-[-0.05em] text-ink sm:text-[2.5rem]">
            Eric & Mona
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            className="rounded-full border border-white/70 bg-white/70 p-3 text-driftwood shadow-soft backdrop-blur"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon className="h-4 w-4 text-deepLake" /> : <Sun className="h-4 w-4 text-[#ffd27a]" />}
          </button>
          <div className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-right shadow-soft backdrop-blur">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-driftwood">Dates</p>
            <p className="text-sm font-medium text-ink">{tripData.dates}</p>
          </div>
        </div>
      </div>

      <main className="space-y-5">
        <section id="home" data-section className="section-shell">
          <SectionHeader
            eyebrow="Home"
            title="The trip at a glance"
            description="Image-forward, practical, and calm: Jack Pine is the heart of the trip, Grand Haven is the exhale at the end, and the whole flow stays scenic without feeling overpacked."
          />

          <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <article className="editorial-card">
              <div className="card-inner">
                <div
                  className="visual-panel overflow-hidden bg-gradient-to-br from-[#b9e3f4] via-[#f7fdff] to-[#8acde8]"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(247, 253, 255, 0.78), rgba(138, 205, 232, 0.35)), url(${ludingtonHeroImage})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                >
                  <div className="relative z-10 flex h-full min-h-[14rem] flex-col justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="tag-pill">Jack Pine first</span>
                      <span className="tag-pill">Birthday on Monday, May 25</span>
                    </div>
                    <div className="max-w-[18rem] space-y-3">
                      <h2 className="font-display text-[2.4rem] leading-[0.92] tracking-[-0.06em] text-ink sm:text-[3rem]">
                        West Michigan birthday escape.
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-white/75 p-4">
                    <p className="eyebrow mb-2">Trip Mood</p>
                    <p className="text-sm leading-6 text-ink/76">{tripData.moodLine}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-sand/65 p-4">
                    <p className="eyebrow mb-2">Route</p>
                    <p className="text-sm leading-6 text-ink/76">{tripData.route}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.35rem] bg-sand/55 p-4">
                  <p className="eyebrow mb-2">Trip shape</p>
                  <p className="text-sm leading-6 text-ink/76">
                    Six days total: three Ludington nights up front, one scenic southbound move day, then two easier
                    Grand Haven nights to finish.
                  </p>
                </div>
              </div>
            </article>

            <div className="space-y-4">
              <article className="editorial-card">
                <div className="card-inner">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="eyebrow">{todayPlan.heading}</span>
                    <CalendarDays className="h-4 w-4 text-deepLake" />
                  </div>
                  <h3 className="font-display text-[1.6rem] leading-none tracking-[-0.04em] text-ink">
                    {todayPlan.day.dayLabel}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-ink">{todayPlan.day.title}</p>
                  <p className="mt-3 text-sm leading-6 text-ink/74">{todayPlan.note}</p>
                </div>
              </article>

              <article className="editorial-card">
                <div className="visual-panel bg-gradient-to-br from-[#d0ebfa] via-[#fbfeff] to-[#b5e2f4]">
                  <div className="relative z-10">
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-deepLake" />
                      <span className="eyebrow">Birthday highlight</span>
                    </div>
                    <h3 className="font-display text-[1.85rem] leading-none tracking-[-0.05em] text-ink">
                      {getBirthdayLabel()}
                    </h3>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-ink/74">
                      Big Sable in the morning, a quieter beach reset later, then sunset picnic layers and candles.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="masonry-board columns-1 sm:columns-2">
              {tripData.homeFeatures.slice(0, 3).map((feature) => (
                <div key={feature.id} className="masonry-item">
                  <article className="editorial-card">
                    <div className={`visual-panel bg-gradient-to-br ${feature.palette}`}>
                      <div className="relative z-10 flex min-h-[9rem] flex-col justify-between">
                        <div className="flex items-start gap-3">
                          <span className="tag-pill">{feature.tag}</span>
                        </div>
                        <div>
                          <h3 className="font-display text-[1.7rem] leading-none tracking-[-0.04em] text-ink">
                            {feature.title}
                          </h3>
                          <p className="mt-2 text-sm text-ink/74">{feature.subtitle}</p>
                        </div>
                      </div>
                    </div>
                    <div className="card-inner">
                      <p className="text-sm leading-6 text-ink/74">{feature.note}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <article className="editorial-card">
                <div className="card-inner">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-deepLake" />
                    <span className="eyebrow">Trip anchors</span>
                  </div>
                  <div className="space-y-3">
                    {tripData.mustDos.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleId(item.id, setCompletedIds)}
                        className={`w-full rounded-[1.35rem] border p-4 text-left transition ${
                          completedIds.includes(item.id)
                            ? 'border-[#b4cab2] bg-[#eef5eb]'
                            : 'border-driftwood/15 bg-white/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-ink">{item.title}</p>
                            <p className="mt-2 text-sm leading-6 text-ink/72">{item.note}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-sand px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-driftwood"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <CheckCircle2
                            className={`mt-1 h-5 w-5 ${
                              completedIds.includes(item.id) ? 'text-[#6e8475]' : 'text-driftwood/45'
                            }`}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 rounded-[1.35rem] bg-sand/55 p-4">
                    <p className="eyebrow mb-2">Trip rhythm</p>
                    <p className="text-sm leading-6 text-ink/74">
                      Jack Pine and Ludington carry the big moments up front. The move south is one scenic transition,
                      and Grand Haven is there to feel lighter, not fuller.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="itinerary" data-section className="section-shell">
          <SectionHeader
            eyebrow="Daily Itinerary"
            title="Days that feel planned, not packed"
            description="Each day has a clear anchor, breathing room around it, and enough practical detail to use this like a real trip companion while traveling."
          />

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {tripData.days.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => document.getElementById(`day-${day.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="shrink-0 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-semibold text-driftwood shadow-soft"
              >
                {day.dayLabel}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {tripData.days.map((day) => (
              <div key={day.id} id={`day-${day.id}`}>
                <TripDayCard
                  day={day}
                  expanded={Boolean(expandedDays[day.id])}
                  completed={completedIds.includes(day.id)}
                  onToggleExpanded={() =>
                    setExpandedDays((current) => ({ ...current, [day.id]: !current[day.id] }))
                  }
                  onToggleCompleted={() => toggleId(day.id, setCompletedIds)}
                />
              </div>
            ))}
          </div>
        </section>

        <section id="explore" data-section className="section-shell">
          <SectionHeader
            eyebrow="Explore"
            title="Hikes and activities with real trip logic"
            description="The exploration side is curated around what is most worth doing, what fits the flow, and what stays optional so the whole trip never starts feeling over-engineered."
          />

          <div className="mb-4 flex flex-wrap gap-2">
            <a
              href="https://www.michigan.gov/recsearch/-/media/Project/Websites/recsearch/documents/MapsI-N/ludington_hiking.pdf?hash=2C8F30752F200157BE5ACF1E2AC847A8&rev=1baf45f1ebb6437c8eed25b67234febb"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-ink shadow-soft"
            >
              Open Ludington hike map
              <ArrowUpRight className="h-4 w-4 text-deepLake" />
            </a>
            <span className="rounded-full bg-sand/60 px-4 py-2 text-sm text-ink/72">
              Official DNR PDF for Big Sable, Sable River, Jack Pine, and inland trail options
            </span>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-3 flex items-center gap-2 px-1">
                <Trees className="h-4 w-4 text-deepLake" />
                <span className="eyebrow">Hikes</span>
              </div>
              <div className="masonry-board columns-1 sm:columns-2">
                {tripData.hikes.map((hike) => (
                  <div key={hike.id} className="masonry-item">
                    <article className="editorial-card">
                      <div className={`visual-panel bg-gradient-to-br ${hike.palette}`}>
                        <div className="relative z-10 flex min-h-[10rem] flex-col justify-between">
                          <div className="flex flex-wrap gap-2">
                            {hike.tags.map((tag) => (
                              <span key={tag} className="tag-pill">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="max-w-[15rem] font-display text-[1.7rem] leading-none tracking-[-0.04em] text-ink">
                            {hike.title}
                          </h3>
                        </div>
                      </div>
                      <div className="card-inner space-y-3">
                        <p className="text-sm leading-6 text-ink/74">{hike.description}</p>
                        <div className="grid gap-3 rounded-[1.4rem] bg-white/70 p-3">
                          <div>
                            <p className="eyebrow mb-1">Best time</p>
                            <p className="text-sm text-ink/76">{hike.bestTime}</p>
                          </div>
                          <div>
                            <p className="eyebrow mb-1">Effort</p>
                            <p className="text-sm text-ink/76">{hike.effort}</p>
                          </div>
                          <div>
                            <p className="eyebrow mb-1">Worth doing because</p>
                            <p className="text-sm leading-6 text-ink/74">{hike.why}</p>
                          </div>
                          <div>
                            <p className="eyebrow mb-1">Practical note</p>
                            <p className="text-sm leading-6 text-ink/74">{hike.note}</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 px-1">
                <Waves className="h-4 w-4 text-deepLake" />
                <span className="eyebrow">Activities</span>
              </div>
              <div className="space-y-4">
                {tripData.activities.map((activity) => (
                  <article key={activity.id} className="editorial-card">
                    <div className={`visual-panel bg-gradient-to-br ${activity.palette}`}>
                      <div className="relative z-10 flex min-h-[8.8rem] flex-col justify-between">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap gap-2">
                            {activity.tags.map((tag) => (
                              <span key={tag} className="tag-pill">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleId(activity.id, setCompletedIds)}
                            className={`rounded-full border p-2 ${
                              completedIds.includes(activity.id)
                                ? 'border-white/70 bg-white/80 text-[#6e8475]'
                                : 'border-white/70 bg-white/60 text-driftwood'
                            }`}
                            aria-label={`Mark ${activity.title} complete`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        </div>
                        <h3 className="max-w-[15rem] font-display text-[1.75rem] leading-none tracking-[-0.04em] text-ink">
                          {activity.title}
                        </h3>
                      </div>
                    </div>
                    <div className="card-inner space-y-3">
                      <p className="text-sm leading-6 text-ink/74">{activity.description}</p>
                      <div className="rounded-[1.4rem] bg-white/70 p-3">
                        <p className="eyebrow mb-1">When it fits</p>
                        <p className="text-sm leading-6 text-ink/74">{activity.timing}</p>
                      </div>
                      <div className="rounded-[1.4rem] bg-sand/60 p-3">
                        <p className="eyebrow mb-1">Practical note</p>
                        <p className="text-sm leading-6 text-ink/74">{activity.practical}</p>
                      </div>
                      {activity.links?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {activity.links.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-driftwood/15 bg-white/80 px-4 py-2 text-sm font-semibold text-ink shadow-soft"
                            >
                              {link.label}
                              <ArrowUpRight className="h-4 w-4 text-deepLake" />
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="food" data-section className="section-shell">
          <SectionHeader
            eyebrow="Food & Picnic"
            title="Cozy food planning with gluten-free awareness"
            description="This section keeps meals attractive and useful. It assumes snacks-only is possible in a pinch, but plans for something slightly better so the trip feels cared for."
          />

          <div className="masonry-board columns-1 sm:columns-2 xl:columns-3">
            {tripData.food.map((category, index) => (
              <div key={category.id} className="masonry-item">
                <article className="editorial-card">
                  <div
                    className={`visual-panel bg-gradient-to-br ${
                      index % 3 === 0
                        ? 'from-[#c6ebf8] via-[#fbfeff] to-[#9ed7ee]'
                        : index % 3 === 1
                          ? 'from-[#d8f3f6] via-[#fbfeff] to-[#bae8e3]'
                          : 'from-[#d3edfa] via-[#fcfeff] to-[#b5e2f4]'
                    }`}
                  >
                    <div className="relative z-10 flex min-h-[9rem] flex-col justify-end">
                      <span className="tag-pill">{category.title}</span>
                      <h3 className="mt-3 font-display text-[1.7rem] leading-none tracking-[-0.04em] text-ink">
                        {category.subtitle}
                      </h3>
                    </div>
                  </div>
                  <div className="card-inner">
                    <p className="text-sm leading-6 text-ink/74">{category.note}</p>
                    <ul className="mt-4 space-y-2">
                      {category.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 rounded-[1.1rem] bg-white/70 px-3 py-2 text-sm text-ink/76"
                        >
                          <span className="mt-1 h-2 w-2 rounded-full bg-deepLake/65" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section id="packing" data-section className="section-shell">
          <SectionHeader
            eyebrow="Packing"
            title="Carry-in essentials first, comfort extras second"
            description="The Jack Pine flow matters here: first pass should cover sleep, water, food, and hike basics. Decor and extra comfort can come on the second trip from the car."
          />

          <div className="mb-5 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
            <article className="editorial-card">
              <div className="card-inner">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="eyebrow">Checklist progress</p>
                    <h3 className="font-display text-[1.7rem] leading-none tracking-[-0.04em] text-ink">
                      {packingProgress}% packed
                    </h3>
                  </div>
                  <Backpack className="h-5 w-5 text-deepLake" />
                </div>
                <div className="h-3 rounded-full bg-sand/80">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-deepLake to-pine transition-all"
                    style={{ width: `${packingProgress}%` }}
                  />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.35rem] bg-white/70 p-4">
                    <p className="eyebrow mb-2">First carry-in essentials</p>
                    <p className="text-sm leading-6 text-ink/74">
                      Shelter, sleep setup, water, core food, and hike-day basics.
                    </p>
                  </div>
                  <div className="rounded-[1.35rem] bg-sand/65 p-4">
                    <p className="eyebrow mb-2">Second pass by the car</p>
                    <p className="text-sm leading-6 text-ink/74">
                      Picnic decor, extra comfort layers, backup snacks, and anything nice-but-not-urgent.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="editorial-card">
              <div className="card-inner">
                <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                  {tripData.packing.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActivePackingCategoryId(category.id)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activePackingCategoryId === category.id
                          ? 'bg-sand text-ink shadow-soft'
                          : 'border border-white/70 bg-white/70 text-driftwood'
                      }`}
                    >
                      {category.title}
                    </button>
                  ))}
                </div>

                <div className="rounded-[1.45rem] bg-white/72 p-4">
                  <p className="eyebrow mb-2">{activePackingCategory.title}</p>
                  <p className="mb-3 text-sm leading-6 text-ink/72">{activePackingCategory.subtitle}</p>
                  <div className="space-y-2">
                    {activePackingCategory.items.map((item) => {
                      const checked = packingCheckedIds.includes(item.id);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleId(item.id, setPackingCheckedIds)}
                          className={`flex w-full items-start gap-3 rounded-[1rem] px-3 py-2 text-left transition ${
                            checked ? 'bg-[#edf5ea]' : 'bg-sand/45'
                          }`}
                        >
                          <CheckCircle2
                            className={`mt-0.5 h-4 w-4 ${checked ? 'text-pine' : 'text-driftwood/45'}`}
                          />
                          <div>
                            <p className="text-sm text-ink/78">{item.label}</p>
                            <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-driftwood/80">
                              {item.phase === 'first' ? 'first carry-in' : 'second pass'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {tripData.packing
                    .filter((category) => category.id !== activePackingCategory.id)
                    .map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActivePackingCategoryId(category.id)}
                        className="rounded-[1.2rem] border border-driftwood/10 bg-sand/40 p-3 text-left"
                      >
                        <p className="text-sm font-semibold text-ink">{category.title}</p>
                        <p className="mt-1 text-sm text-ink/66">{category.items.length} items</p>
                      </button>
                    ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="route" data-section className="section-shell">
          <SectionHeader
            eyebrow="Route"
            title="A stylized route instead of an overbuilt map"
            description="Version 1 keeps the route visual and readable on a phone: it shows the chapter sequence and what each stop is supposed to feel like."
          />

          <article className="editorial-card">
            <div className="card-inner">
              <div className="visual-panel mb-4 bg-gradient-to-br from-[#c0e6f5] via-[#f9fdff] to-[#99d3eb]">
                <div className="relative z-10 flex min-h-[9rem] flex-col justify-between">
                  <div className="flex flex-wrap gap-2">
                    <span className="tag-pill">Ludington first</span>
                    <span className="tag-pill">One move day</span>
                    <span className="tag-pill">Grand Haven unwind</span>
                  </div>
                  <h3 className="max-w-[17rem] font-display text-[2rem] leading-none tracking-[-0.05em] text-ink">
                    North-to-south route with one scenic middle chapter.
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {tripData.routeStops.map((stop, index) => (
                  <div key={stop.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/80 text-xs font-semibold text-ink shadow-soft">
                        {index + 1}
                      </span>
                      {index < tripData.routeStops.length - 1 ? (
                        <span className="mt-2 h-full min-h-12 w-px bg-driftwood/20" />
                      ) : null}
                    </div>
                    <div className={`light-gradient-panel flex-1 rounded-[1.35rem] bg-gradient-to-br ${stop.palette} p-4`}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-ink">{stop.title}</p>
                        <span className="tag-pill">{stop.tag}</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-ink/78">{stop.note}</p>
                      <p className="mt-2 text-sm leading-6 text-ink/72">{stop.detail}</p>
                      {stop.links?.length ? (
                        <div className="mt-3 flex flex-col gap-2">
                          {stop.links.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-ink shadow-soft"
                            >
                              {link.label}
                              <ArrowUpRight className="h-4 w-4 text-deepLake" />
                            </a>
                          ))}
                          {stop.links.map((link) =>
                            link.note ? (
                              <p key={`${link.url}-note`} className="text-sm leading-6 text-ink/66">
                                {link.note}
                              </p>
                            ) : null,
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section id="notes" data-section className="section-shell">
          <SectionHeader
            eyebrow="Notes & Journal"
            title="A lightweight local scrapbook"
            description="Use this section for quick notes, favorite moments, or little things to remember. Everything here stays in local state for version 1."
          />

          <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
            <article className="editorial-card">
              <div className="card-inner">
                <div className="mb-4 flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-deepLake" />
                  <span className="eyebrow">Favorite moments prompt board</span>
                </div>
                <div className="space-y-3">
                  {[
                    'Best lake view',
                    'Favorite snack stop',
                    'Moment worth repeating next trip',
                    'Quietest beach stretch',
                  ].map((prompt) => (
                    <div key={prompt} className="rounded-[1.35rem] bg-white/72 p-4">
                      <p className="text-sm font-semibold text-ink">{prompt}</p>
                      <p className="mt-2 text-sm leading-6 text-ink/70">
                        Add a quick note after the moment happens so the memory board feels real later.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="editorial-card">
              <div className="card-inner">
                <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                  {tripData.days.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => setActiveNoteDayId(day.id)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeNoteDayId === day.id
                          ? 'bg-sand text-ink shadow-soft'
                          : 'border border-white/70 bg-white/75 text-driftwood'
                      }`}
                    >
                      {day.dayLabel}
                    </button>
                  ))}
                </div>

                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">{activeNoteDay.dayLabel}</p>
                    <h3 className="text-base font-semibold text-ink">{activeNoteDay.title}</h3>
                  </div>
                  <span className="rounded-full bg-sand px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-driftwood">
                    {activeNoteDay.mood}
                  </span>
                </div>

                <textarea
                  value={noteDrafts[activeNoteDay.id] ?? ''}
                  onChange={(event) =>
                    setNoteDrafts((current) => ({
                      ...current,
                      [activeNoteDay.id]: event.target.value,
                    }))
                  }
                  placeholder="Quick note, favorite moment, or something to remember..."
                  className="min-h-[7rem] w-full rounded-[1.2rem] border border-driftwood/15 bg-white/72 p-3 text-sm text-ink outline-none transition focus:border-deepLake/35"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-driftwood">
                    {activeDayNotes.length} saved notes
                  </p>
                  <button
                    type="button"
                    onClick={() => addNote(activeNoteDay.id)}
                    className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-soft"
                  >
                    Save snippet
                  </button>
                </div>

                {activeDayNotes.length ? (
                  <div className="mt-4 space-y-2">
                    {activeDayNotes.map((note, index) => (
                      <div
                        key={`${activeNoteDay.id}-${index}`}
                        className="rounded-[1.15rem] bg-sand/55 px-3 py-3 text-sm leading-6 text-ink/76"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[1.15rem] bg-white/72 px-3 py-3 text-sm leading-6 text-ink/66">
                    No saved notes for this day yet.
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>
      </main>

      <BottomNav items={sections} activeSection={activeSection} onNavigate={scrollToSection} />
    </div>
  );
}

export default App;
