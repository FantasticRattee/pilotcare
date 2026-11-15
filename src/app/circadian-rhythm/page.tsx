'use client';

import { useState } from 'react';
import { ArrowRight, Coffee, Dumbbell, Globe, Info, Moon, Pill, Sun, Thermometer, Timer, TriangleAlert, Utensils, type LucideIcon } from 'lucide-react';
import { Meter, Notice, PageHeader, Panel, RouteStrip, Row, RowList, Section, Segmented, Stat, StatGrid, Status, Tape, type TapeSegment, type Tone } from '@/components/ui';

/** Reads a clock time such as "17:30" as hours (17.5). Text that does not start with a clock time gives null. */
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

const twoDigits = (hour: number) => String(hour).padStart(2, '0');

/** Where an hour sits on a 24-hour axis, the same way the kit's tape places its ticks. */
const tickStyle = (hour: number) => ({
  left: `${(hour / 24) * 100}%`,
  transform: hour === 0 ? 'none' : hour === 24 ? 'translateX(-100%)' : 'translateX(-50%)',
});

type View = 'current' | 'history';
type Tip = { icon: LucideIcon; title: string; description: string; phase: string };
type Fact = { icon: LucideIcon; lead: string; text: string };

export default function CircadianRhythmPage() {
  const [selectedView, setSelectedView] = useState<'current' | 'history'>('current');

  const views: { value: View; label: string }[] = [
    { value: 'current', label: 'Current status' },
    { value: 'history', label: 'Flight history' },
  ];

  const currentFlight = {
    departure: { city: 'London', code: 'LHR', time: '22:00', timezone: 'GMT (UTC+0)' },
    arrival: { city: 'Singapore', code: 'SIN', time: '17:30+1', timezone: 'SGT (UTC+8)' },
    duration: '13h 30m',
    timeDifference: '+8 hours',
  };

  const circadianData = {
    homeTimezone: 'GMT (UTC+0)',
    currentTimezone: 'SGT (UTC+8)',
    bodyClockTime: '09:30',
    localTime: '17:30',
    jetLagLevel: 'Moderate',
    daysToAdjust: 4,
    currentPhase: 'Alert phase',
    recommendation: 'Your body thinks it\'s morning. Avoid heavy meals and bright light exposure until evening.',
  };

  // Hourly rhythm data for visualization
  const rhythmHours = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const bodyHour = (hour - 8 + 24) % 24; // 8 hour difference

    // Energy levels based on circadian rhythm
    let energyLevel = 50;
    if (bodyHour >= 6 && bodyHour < 10) energyLevel = 75; // Morning peak
    else if (bodyHour >= 10 && bodyHour < 14) energyLevel = 85; // Mid-morning peak
    else if (bodyHour >= 14 && bodyHour < 16) energyLevel = 60; // Post-lunch dip
    else if (bodyHour >= 16 && bodyHour < 19) energyLevel = 70; // Evening recovery
    else if (bodyHour >= 19 && bodyHour < 22) energyLevel = 50; // Evening wind down
    else energyLevel = 20; // Night/sleep

    return {
      localHour: hour,
      bodyHour: bodyHour,
      energyLevel: energyLevel,
      isCurrentHour: hour === 17,
    };
  });

  const flightHistory = [
    { date: 'Nov 15', from: 'LHR', to: 'SIN', shift: '+8h', impact: 'High' },
    { date: 'Nov 10', from: 'SIN', to: 'LHR', shift: '-8h', impact: 'High' },
    { date: 'Nov 5', from: 'LHR', to: 'JFK', shift: '-5h', impact: 'Medium' },
    { date: 'Nov 1', from: 'JFK', to: 'LHR', shift: '+5h', impact: 'Medium' },
  ];

  const adjustmentTips: Tip[] = [
    { icon: Sun, title: 'Light exposure', description: 'Seek bright light in the morning, avoid in the evening', phase: 'Morning' },
    { icon: Utensils, title: 'Meal timing', description: 'Eat according to local time to reset your clock', phase: 'All day' },
    { icon: Pill, title: 'Melatonin', description: 'Consider 0.5-3 mg, 30 min before local bedtime', phase: 'Evening' },
    { icon: Coffee, title: 'Caffeine strategy', description: 'Limit after 2 PM local time', phase: 'Morning/afternoon' },
    { icon: Dumbbell, title: 'Exercise', description: 'Light exercise in the morning helps adjustment', phase: 'Morning' },
    { icon: Thermometer, title: 'Temperature', description: 'Keep bedroom cool (16-19°C) for better sleep', phase: 'Night' },
  ];

  // Sleep windows, each on its own clock: the body's on home time, the recommended one on local time.
  const sleepWindows = {
    bodyClock: { from: '01:30', to: '09:30' },
    local: { from: '22:00', to: '06:00' },
  };

  const howItWorks: Fact[] = [
    { icon: Sun, lead: 'Morning light', text: 'signals your brain to stop producing melatonin (sleep hormone) and increase cortisol (alertness hormone)' },
    { icon: Moon, lead: 'Darkness at night', text: 'triggers melatonin production, making you feel drowsy' },
    { icon: Thermometer, lead: 'Body temperature', text: 'drops at night and rises in the morning' },
  ];

  const jetLagEffects = [
    { lead: 'Reduced alertness', text: 'when your body thinks it should be sleeping' },
    { lead: 'Poor sleep quality', text: 'when trying to sleep at unusual times for your body' },
    { lead: 'Decreased performance', text: 'and slower reaction times' },
    { lead: 'Digestive issues', text: 'and mood changes' },
  ];

  // Colour carries the status: amber for a moderate or medium effect, red for a high one.
  const jetLagTone: Record<string, Tone> = { Low: 'ok', Moderate: 'caution', High: 'warning' };
  const impactTone: Record<string, Tone> = { Low: 'ok', Medium: 'caution', High: 'warning' };

  const currentHour = rhythmHours.find((hour) => hour.isCurrentHour);
  const axisTicks = [0, 6, 12, 18, 24];

  return (
    <div>
      <PageHeader title="Circadian rhythm" lead="Track your body clock across time zones" story={8} />

      <Section>
        <Segmented label="View" options={views} value={selectedView} onChange={setSelectedView} />
      </Section>

      {selectedView === 'current' ? (
        <>
          <Section title="Latest flight">
            <Panel padded={false}>
              <div className="p-4">
                <RouteStrip
                  from={currentFlight.departure.code}
                  fromName={currentFlight.departure.city}
                  fromTime={currentFlight.departure.time}
                  to={currentFlight.arrival.code}
                  toName={currentFlight.arrival.city}
                  toTime={currentFlight.arrival.time}
                  duration={currentFlight.duration}
                />
              </div>
              <div className="border-t border-line-soft px-4">
                <Row icon={Globe} label="Time shift" hint={`${currentFlight.departure.timezone} to ${currentFlight.arrival.timezone}`} value={currentFlight.timeDifference} />
              </div>
            </Panel>
          </Section>

          {/* Body-clock time against local time: the gap between the two is the jet lag */}
          <Section title="Your body clock">
            <StatGrid>
              <Stat label="Body clock" value={circadianData.bodyClockTime} note={circadianData.homeTimezone} />
              <Stat label="Local time" value={circadianData.localTime} note={circadianData.currentTimezone} />
              <Stat label="Jet lag" value={circadianData.jetLagLevel} tone={jetLagTone[circadianData.jetLagLevel] ?? 'neutral'} />
              <Stat label="Time to adjust" value={circadianData.daysToAdjust} unit="days" />
            </StatGrid>
          </Section>

          <Section title="Optimal sleep windows">
            <Panel padded={false}>
              <div className="grid gap-5 p-4">
                <Tape
                  title={`Body clock, ${circadianData.homeTimezone}`}
                  segments={timeBlock(sleepWindows.bodyClock.from, sleepWindows.bodyClock.to, 'info', 'Body clock sleep time')}
                  now={toHour(circadianData.bodyClockTime) ?? undefined}
                />
                <Tape
                  title={`Local time, ${circadianData.currentTimezone}`}
                  segments={timeBlock(sleepWindows.local.from, sleepWindows.local.to, 'plan', 'Recommended sleep')}
                  now={toHour(circadianData.localTime) ?? undefined}
                />
                <p className="tabular text-[12.5px] text-ink-faint">
                  The line on each strip marks the time now: {circadianData.bodyClockTime} on your body clock, {circadianData.localTime} local.
                </p>
              </div>
              <div className="border-t border-line-soft px-4">
                <Row label="Body clock sleep time" hint="Based on home time zone" value={`${sleepWindows.bodyClock.from} to ${sleepWindows.bodyClock.to}`} tone="info" />
                <Row label="Recommended local time" hint="For faster adjustment" value={`${sleepWindows.local.from} to ${sleepWindows.local.to}`} tone="plan" />
              </div>
            </Panel>
          </Section>

          <Section title="24-hour energy rhythm">
            <Panel>
              {/* One bar per local hour; the two axes below read the same hour on the local and the body clock */}
              <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2.5">
                <span aria-hidden="true" />
                <div
                  role="img"
                  aria-label={`Energy level for each hour of the day.${currentHour ? ` The current hour is ${twoDigits(currentHour.localHour)}:00, with energy at ${currentHour.energyLevel}%.` : ''}`}
                  className="flex h-32 items-end gap-0.5 border-b border-line"
                >
                  {rhythmHours.map((hour) => (
                    <div key={hour.localHour} className={`flex-1 rounded-t-sm ${hour.isCurrentHour ? 'bg-info' : 'bg-ink-faint'}`} style={{ height: `${hour.energyLevel}%` }} />
                  ))}
                </div>

                <span className="mt-1 text-[11.5px] text-ink-faint">Local</span>
                <div className="tabular relative mt-1 h-4 text-[11.5px] text-ink-faint">
                  {axisTicks.map((tick) => (
                    <span key={tick} className="absolute" style={tickStyle(tick)}>
                      {twoDigits(tick)}
                    </span>
                  ))}
                </div>

                <span className="text-[11.5px] text-ink-faint">Body</span>
                <div className="tabular relative h-4 text-[11.5px] text-ink-faint">
                  {axisTicks.map((tick) => (
                    <span key={tick} className="absolute" style={tickStyle(tick)}>
                      {twoDigits(rhythmHours[tick % 24].bodyHour)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-ink-faint" aria-hidden="true" />
                  Your energy level
                </span>
                <span className="tabular inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-info" aria-hidden="true" />
                  Current hour{currentHour ? `, ${twoDigits(currentHour.localHour)}:00 local` : ''}
                </span>
              </div>
              <p className="mt-1.5 text-[12.5px] text-ink-faint">
                Local hours are {circadianData.currentTimezone}. Body hours are your body clock, still on {circadianData.homeTimezone}.
              </p>
            </Panel>
            <div className="mt-3">
              <Notice tone="info" icon={Info} title={`Current phase: ${circadianData.currentPhase}`}>
                {circadianData.recommendation}
              </Notice>
            </div>
          </Section>

          <Section title="Adjustment tips">
            <RowList>
              {adjustmentTips.map((tip) => (
                <Row key={tip.title} icon={tip.icon} label={<span className="font-medium">{tip.title}</span>} hint={tip.description}>
                  <span className="shrink-0 text-[13px] text-ink-soft">{tip.phase}</span>
                </Row>
              ))}
            </RowList>
          </Section>
        </>
      ) : (
        <>
          <Section title="Recent flights">
            <RowList>
              {flightHistory.map((flight) => {
                const tone = impactTone[flight.impact] ?? 'neutral';
                return (
                  <div key={`${flight.date}-${flight.from}-${flight.to}`} className="border-b border-line-soft py-3.5 last:border-b-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-[15px] font-medium text-ink">
                          {flight.from}
                          <ArrowRight size={15} strokeWidth={1.75} className="shrink-0 text-ink-faint" aria-hidden="true" />
                          <span className="sr-only">to</span>
                          {flight.to}
                        </p>
                        <p className="tabular text-[13px] text-ink-faint">{flight.date}</p>
                      </div>
                      <Status tone={tone}>{flight.impact} impact</Status>
                    </div>
                    <div className="mt-2.5">
                      <Meter label="Time zone shift" valueLabel={flight.shift} value={flight.impact === 'High' ? 100 : 60} tone={tone} />
                    </div>
                  </div>
                );
              })}
            </RowList>
          </Section>

          <Section title="Cumulative jet lag">
            <Notice tone="caution" icon={TriangleAlert}>
              Multiple time zone shifts in short succession can compound jet lag effects. Your body needs adequate recovery time.
            </Notice>
            <div className="mt-3">
              <Panel>
                <Meter label="Recovery status" valueLabel="65%" value={65} tone="caution" note="Estimated 2 more days for full recovery" />
              </Panel>
            </div>
          </Section>
        </>
      )}

      {/* Background reading, shown under both views */}
      <Section title="What is circadian rhythm?">
        <p className="text-[15px] text-ink-soft">
          Your <strong className="font-semibold text-ink">circadian rhythm</strong> is your body&apos;s internal 24-hour clock that regulates when you feel awake and when you feel sleepy. It&apos;s controlled by a tiny region in your brain that responds to light and darkness.
        </p>

        <h3 className="mb-2 mt-5 text-[16px] font-semibold text-ink">How it works</h3>
        <RowList>
          {howItWorks.map(({ icon: Icon, lead, text }) => (
            <div key={lead} className="flex items-start gap-3 border-b border-line-soft py-3 last:border-b-0">
              <Icon size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-ink-faint" aria-hidden="true" />
              <p className="text-[14px] text-ink-soft">
                <strong className="font-semibold text-ink">{lead}</strong> {text}
              </p>
            </div>
          ))}
        </RowList>

        <h3 className="mb-2 mt-5 text-[16px] font-semibold text-ink">Why it matters for pilots</h3>
        <p className="mb-3 text-[14px] text-ink-soft">
          When you fly across time zones, your circadian rhythm doesn&apos;t instantly adjust. This mismatch causes <strong className="font-semibold text-ink">jet lag</strong>:
        </p>
        <RowList>
          {jetLagEffects.map(({ lead, text }) => (
            <div key={lead} className="flex items-start gap-3 border-b border-line-soft py-3 last:border-b-0">
              <TriangleAlert size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-caution" aria-hidden="true" />
              <p className="text-[14px] text-ink-soft">
                <strong className="font-semibold text-ink">{lead}</strong> {text}
              </p>
            </div>
          ))}
        </RowList>

        <div className="mt-5">
          <Notice tone="info" icon={Timer} title="Adjustment time">
            Your body can typically adjust about <strong className="font-semibold text-ink">1-1.5 hours per day</strong>. So after an 8-hour time zone shift, expect <strong className="font-semibold text-ink">5-8 days</strong> for full adaptation. This tracker helps you manage this transition.
          </Notice>
        </div>
      </Section>
    </div>
  );
}
