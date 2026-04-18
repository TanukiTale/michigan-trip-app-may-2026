import { CheckCircle2, ChevronDown, ChevronUp, MoonStar, Sun, Sunrise, Trees } from 'lucide-react';
import type { TripDay } from '../types/trip';

interface TripDayCardProps {
  day: TripDay;
  expanded: boolean;
  completed: boolean;
  onToggleExpanded: () => void;
  onToggleCompleted: () => void;
}

const segmentIcons = {
  Morning: Sunrise,
  Afternoon: Sun,
  Evening: MoonStar,
};

export function TripDayCard({
  day,
  expanded,
  completed,
  onToggleExpanded,
  onToggleCompleted,
}: TripDayCardProps) {
  return (
    <article className="editorial-card">
      <div className={`visual-panel bg-gradient-to-br ${day.palette}`}>
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="tag-pill">{day.dayLabel}</span>
              <span className="tag-pill">{day.mood}</span>
            </div>
            <h3 className="max-w-[14rem] font-display text-[1.65rem] leading-none tracking-[-0.04em] text-ink">
              {day.title}
            </h3>
            <p className="mt-2 text-sm text-ink/70">{day.location}</p>
          </div>
          <button
            type="button"
            onClick={onToggleCompleted}
            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
              completed
                ? 'border-white/80 bg-white/80 text-deepLake shadow-soft'
                : 'border-white/70 bg-white/50 text-ink/70'
            }`}
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {completed ? 'Done' : 'Anchor'}
            </span>
          </button>
        </div>
      </div>

      <div className="card-inner space-y-4">
        <p className="text-sm leading-6 text-ink/76">{day.summary}</p>

        <div className="grid gap-3 rounded-[1.4rem] bg-white/65 p-3 sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-2">Main Activity</p>
            <p className="text-sm font-medium leading-6 text-ink">{day.mainActivity}</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Meal Note</p>
            <p className="text-sm leading-6 text-ink/74">{day.mealNote}</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Hike</p>
            <p className="text-sm leading-6 text-ink/74">{day.hike ?? 'No hike planned'}</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Bring</p>
            <div className="flex flex-wrap gap-2">
              {day.bring.map((item) => (
                <span key={item} className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-ink/78">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex w-full items-center justify-between rounded-[1.25rem] border border-driftwood/15 bg-white/70 px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Trees className="h-4 w-4 text-deepLake" />
            Day flow + flex idea
          </span>
          {expanded ? <ChevronUp className="h-4 w-4 text-driftwood" /> : <ChevronDown className="h-4 w-4 text-driftwood" />}
        </button>

        {expanded ? (
          <div className="space-y-3">
            {day.segments.map((segment) => {
              const Icon = segmentIcons[segment.label];

              return (
                <div key={segment.label} className="rounded-[1.4rem] bg-white/70 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-deepLake" />
                    <span className="eyebrow">{segment.label}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-ink">{segment.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-ink/74">{segment.details}</p>
                </div>
              );
            })}

            <div className="rounded-[1.4rem] border border-dune/50 bg-sand/55 p-4">
              <p className="eyebrow mb-2">Optional Flex</p>
              <p className="text-sm leading-6 text-ink/74">{day.optionalFlex}</p>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
