'use client';

import { useState } from 'react';
import { Coffee, Dumbbell, EyeOff, Footprints, GlassWater, Globe, Lightbulb, Moon, Pill, Plane, Sun, Utensils, Watch, Wind, WineOff, type LucideIcon } from 'lucide-react';
import { Notice, PageHeader, Panel, RouteStrip, Row, RowList, Section, Status, Tape, type TapeSegment, type Tone } from '@/components/ui';

/** Reads a clock time such as "23:00" as hours (23). Text that does not start with a clock time gives null. */
function toHour(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})/.exec(time.trim());
  return match ? Number(match[1]) + Number(match[2]) / 60 : null;
}

/** A block of time for the 24-hour tape. A block that crosses midnight is split in two. */
function timeBlock(from: string, to: string, tone: Tone, label: string): TapeSegment[] {
  const start = toHour(from);
  const end = toHour(to);
  if (start === null || end === null) return [];
  if (start <= end) return [{ from: start, to: end, tone, label }];
  return [
    { from: start, to: 24, tone, label },
    { from: 0, to: end, tone, label },
  ];
}

/** Finds a window such as "07:00-09:00" inside a sentence, for the tape. */
function windowIn(text: string): [string, string] | null {
  const match = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/.exec(text);
  return match ? [match[1], match[2]] : null;
}

type Technique = { icon: LucideIcon; title: string; description: string; timing: string };
type FlightTip = { icon: LucideIcon; tip: string };

export default function SleepSchedulePage() {
  const [selectedFlight, setSelectedFlight] = useState('upcoming');

  const upcomingFlight = {
    flightNumber: 'BA123',
    departure: { city: 'London', code: 'LHR', time: '10:30', date: 'Nov 18', timezone: 'GMT (UTC+0)' },
    arrival: { city: 'Tokyo', code: 'NRT', time: '06:30+1', date: 'Nov 19', timezone: 'JST (UTC+9)' },
    duration: '11h 30m',
    timeShift: '+9 hours',
    daysUntil: 3,
  };

  const sleepSchedule = {
    current: {
      timezone: 'GMT (UTC+0)',
      bedtime: '23:00',
      waketime: '07:00',
      sleepDuration: '8h',
    },
    destination: {
      timezone: 'JST (UTC+9)',
      recommendedBedtime: '22:00',
      recommendedWaketime: '06:00',
      targetSleepDuration: '8h',
    },
    adjustment: {
      strategy: 'Gradual advance',
      shiftPerDay: '1-2 hours earlier',
      startDate: 'Nov 15',
      daysNeeded: 3,
    },
  };

  const dailySchedule = [
    {
      date: 'Nov 15 (Today)',
      day: 'Day 1',
      bedtime: '22:00',
      waketime: '06:00',
      lightExposure: 'Morning: 07:00-09:00',
      mealTimes: ['Breakfast: 06:30', 'Lunch: 12:00', 'Dinner: 18:00'],
      notes: 'Start shifting 1 hour earlier',
      completed: false,
    },
    {
      date: 'Nov 16',
      day: 'Day 2',
      bedtime: '21:00',
      waketime: '05:00',
      lightExposure: 'Morning: 05:30-07:30',
      mealTimes: ['Breakfast: 05:30', 'Lunch: 11:00', 'Dinner: 17:00'],
      notes: 'Shift another hour earlier',
      completed: false,
    },
    {
      date: 'Nov 17',
      day: 'Day 3',
      bedtime: '22:00',
      waketime: '06:00',
      lightExposure: 'Morning: 06:30-08:30',
      mealTimes: ['Breakfast: 06:30', 'Lunch: 12:00', 'Dinner: 18:00'],
      notes: 'Final adjustment day',
      completed: false,
    },
    {
      date: 'Nov 18',
      day: 'Flight day',
      bedtime: 'On flight',
      waketime: '06:00 JST',
      lightExposure: 'Upon arrival in Tokyo',
      mealTimes: ['Eat according to Tokyo time'],
      notes: 'Sleep on the plane, arrive ready',
      completed: false,
      isFlightDay: true,
    },
  ];

  const adjustmentTechniques: Technique[] = [
    {
      icon: Sun,
      title: 'Light therapy',
      description: 'Expose yourself to bright light in the morning to shift your circadian rhythm forward',
      timing: 'Morning',
    },
    {
      icon: Moon,
      title: 'Darkness in the evening',
      description: 'Dim lights and avoid screens 2 hours before new bedtime',
      timing: 'Evening',
    },
    {
      icon: Utensils,
      title: 'Meal timing',
      description: 'Gradually shift meal times to match destination timezone',
      timing: 'All day',
    },
    {
      icon: Pill,
      title: 'Melatonin',
      description: 'Take 0.5-3 mg melatonin 30 minutes before your new bedtime',
      timing: 'Evening',
    },
    {
      icon: Dumbbell,
      title: 'Exercise',
      description: 'Light exercise in the morning helps reinforce the new schedule',
      timing: 'Morning',
    },
    {
      icon: Coffee,
      title: 'Caffeine management',
      description: 'Avoid caffeine after 2 PM to protect your new sleep time',
      timing: 'Afternoon',
    },
  ];

  const flightTips: FlightTip[] = [
    { icon: Watch, tip: 'Set your watch to destination time when you board' },
    { icon: GlassWater, tip: 'Stay hydrated: drink water every hour' },
    { icon: WineOff, tip: 'Avoid alcohol: it disrupts sleep quality' },
    { icon: EyeOff, tip: 'Use an eye mask and earplugs for better sleep' },
    { icon: Wind, tip: 'Practice deep breathing or meditation' },
    { icon: Footprints, tip: 'Move around the cabin every 2 hours' },
  ];

  // The two sleep windows, each on the clock of its own time zone.
  // Teal is where you sleep now; magenta is the recommended plan.
  const currentSleep = timeBlock(sleepSchedule.current.bedtime, sleepSchedule.current.waketime, 'info', 'Current sleep');
  const targetSleep = timeBlock(sleepSchedule.destination.recommendedBedtime, sleepSchedule.destination.recommendedWaketime, 'plan', 'Recommended sleep');

  const comparison = [
    { label: 'Bedtime', current: sleepSchedule.current.bedtime, target: sleepSchedule.destination.recommendedBedtime },
    { label: 'Wake time', current: sleepSchedule.current.waketime, target: sleepSchedule.destination.recommendedWaketime },
    { label: 'Sleep duration', current: sleepSchedule.current.sleepDuration, target: sleepSchedule.destination.targetSleepDuration },
  ];

  return (
    <div>
      <PageHeader title="Sleep schedule" lead="Adapt to your destination time zone" story={5} />

      <Section title="Next flight">
        <Panel padded={false}>
          <div className="p-4">
            <RouteStrip
              flight={upcomingFlight.flightNumber}
              from={upcomingFlight.departure.code}
              fromName={upcomingFlight.departure.city}
              fromTime={`${upcomingFlight.departure.date}, ${upcomingFlight.departure.time}`}
              to={upcomingFlight.arrival.code}
              toName={upcomingFlight.arrival.city}
              toTime={`${upcomingFlight.arrival.date}, ${upcomingFlight.arrival.time}`}
              duration={upcomingFlight.duration}
              aside={<Status tone="info">In {upcomingFlight.daysUntil} days</Status>}
            />
          </div>
          <div className="border-t border-line-soft px-4">
            <Row icon={Globe} label="Time zone shift" hint={`${upcomingFlight.departure.timezone} to ${upcomingFlight.arrival.timezone}`} value={upcomingFlight.timeShift} />
          </div>
        </Panel>
      </Section>

      {/* The signature view: where you sleep now against where the plan wants you to sleep */}
      <Section title="Sleep time comparison">
        <Panel padded={false}>
          <div className="grid gap-5 p-4">
            <Tape title={`Current schedule, ${sleepSchedule.current.timezone}`} segments={currentSleep} />
            <Tape title={`Target schedule, ${sleepSchedule.destination.timezone}`} segments={targetSleep} />
          </div>
          <div className="border-t border-line-soft px-4">
            <div className="flex justify-end gap-4 pt-3 text-[13px] text-ink-soft" aria-hidden="true">
              <span className="flex w-[72px] items-center justify-end gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-info" />
                Current
              </span>
              <span className="flex w-[72px] items-center justify-end gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-plan" />
                Target
              </span>
            </div>
            {comparison.map((item) => (
              <Row key={item.label} label={item.label}>
                <p className="tabular flex shrink-0 gap-4 text-[15px] font-medium">
                  <span className="w-[72px] text-right text-ink">
                    <span className="sr-only">Current </span>
                    {item.current}
                  </span>
                  <span className="w-[72px] text-right text-plan">
                    <span className="sr-only">Target </span>
                    {item.target}
                  </span>
                </p>
              </Row>
            ))}
          </div>
        </Panel>
      </Section>

      <Section title="Your adjustment plan">
        <RowList>
          <Row label="Strategy" value={sleepSchedule.adjustment.strategy} tone="plan" />
          <Row label="Daily shift" value={sleepSchedule.adjustment.shiftPerDay} />
          <Row label="Start date" value={sleepSchedule.adjustment.startDate} />
          <Row label="Days needed" value={`${sleepSchedule.adjustment.daysNeeded} days`} />
        </RowList>
        <div className="mt-3">
          <Notice tone="info" icon={Lightbulb}>
            <strong className="font-semibold text-ink">Tip:</strong> start adjusting 3 days before your flight for best results. Gradual shifts are easier on your body than sudden changes.
          </Notice>
        </div>
      </Section>

      <Section title="Day-by-day schedule">
        <div className="grid gap-3">
          {dailySchedule.map((day) => {
            const light = windowIn(day.lightExposure);
            const segments = [
              ...timeBlock(day.bedtime, day.waketime, 'plan', 'Recommended sleep'),
              ...(light ? timeBlock(light[0], light[1], 'caution', 'Light exposure') : []),
            ];
            return (
              <Panel key={day.day} padded={false}>
                <div className="px-4 pb-1 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[17px] font-semibold leading-tight text-ink">{day.day}</h3>
                      <p className="tabular text-[13px] text-ink-faint">{day.date}</p>
                    </div>
                    {day.isFlightDay ? <Plane size={20} strokeWidth={1.75} className="shrink-0 text-plan" aria-hidden="true" /> : null}
                  </div>
                  <p className="mt-2 text-[14px] text-ink-soft">{day.notes}</p>
                  {segments.length > 0 ? (
                    <div className="mt-3">
                      <Tape segments={segments} />
                    </div>
                  ) : null}
                </div>
                <div className="mt-3 border-t border-line-soft px-4">
                  <Row icon={Moon} label="Bedtime" value={day.bedtime} />
                  <Row icon={Sun} label="Wake time" value={day.waketime} />
                  <Row icon={Lightbulb} label="Light exposure" value={day.lightExposure} />
                  <Row icon={Utensils} label="Meal times">
                    <div className="tabular min-w-0 text-right text-[14px] text-ink">
                      {day.mealTimes.map((meal) => (
                        <p key={meal}>{meal}</p>
                      ))}
                    </div>
                  </Row>
                </div>
              </Panel>
            );
          })}
        </div>
      </Section>

      <Section title="Adjustment techniques">
        <RowList>
          {adjustmentTechniques.map((technique) => (
            <Row key={technique.title} icon={technique.icon} label={<span className="font-medium">{technique.title}</span>} hint={technique.description}>
              <span className="shrink-0 text-[13px] text-ink-soft">{technique.timing}</span>
            </Row>
          ))}
        </RowList>
      </Section>

      <Section title="In-flight tips">
        <RowList>
          {flightTips.map((item) => (
            <Row key={item.tip} icon={item.icon} label={item.tip} />
          ))}
        </RowList>
      </Section>
    </div>
  );
}
