'use client';

import { useState } from 'react';
import { Activity, Circle, CircleCheck, Lightbulb, LoaderCircle, RefreshCw, TriangleAlert, Watch, type LucideIcon } from 'lucide-react';
import { Button, Meter, Notice, PageHeader, Panel, RowList, Section, Stat, StatGrid, Status, Tape, toneSolid, toneText, type TapeSegment, type Tone } from '@/components/ui';

type Device = { name: string; status: string; battery: number | null; lastSync: string; icon: LucideIcon };

export default function SleepTrackingPage() {
  const [selectedDate, setSelectedDate] = useState('2025-11-06');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');

  // Mock sleep data
  const sleepData = {
    lastNight: {
      totalSleep: 7.5,
      deepSleep: 2.1,
      lightSleep: 4.2,
      remSleep: 1.2,
      awake: 0.5,
      sleepScore: 82,
      bedTime: '22:30',
      wakeTime: '06:00',
      heartRate: {
        avg: 58,
        min: 52,
        max: 64,
      },
      hrv: 65,
      respiratoryRate: 14,
    },
    weeklyData: [
      { date: 'Mon', hours: 6.5, score: 68 },
      { date: 'Tue', hours: 7.2, score: 75 },
      { date: 'Wed', hours: 8.0, score: 85 },
      { date: 'Thu', hours: 7.5, score: 82 },
      { date: 'Fri', hours: 6.8, score: 72 },
      { date: 'Sat', hours: 8.5, score: 90 },
      { date: 'Sun', hours: 7.5, score: 82 },
    ],
    insights: [
      { text: 'Consistent sleep schedule this week', type: 'positive' },
      { text: 'Deep sleep below optimal on weekdays', type: 'warning' },
      { text: 'Best sleep quality on weekends', type: 'info' },
    ],
  };

  const devices: Device[] = [
    { name: 'Apple Watch Series 9', status: 'connected', battery: 78, lastSync: '2 min ago', icon: Watch },
    { name: 'Fitbit Charge 6', status: 'disconnected', battery: null, lastSync: '2 days ago', icon: Activity },
    { name: 'Oura Ring Gen 3', status: 'connected', battery: 45, lastSync: '5 min ago', icon: Circle },
  ];

  const recoveryScore = 85;

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }, 1500);
  };

  // Colour carries the status: green from 80, amber from 60, red below.
  const scoreTone = (score: number): Tone => {
    if (score >= 80) return 'ok';
    if (score >= 60) return 'caution';
    return 'warning';
  };

  const batteryTone = (battery: number): Tone => (battery > 50 ? 'ok' : battery > 20 ? 'caution' : 'warning');

  const insightStyle: Record<string, { icon: LucideIcon; tone: Tone }> = {
    positive: { icon: CircleCheck, tone: 'ok' },
    warning: { icon: TriangleAlert, tone: 'caution' },
    info: { icon: Lightbulb, tone: 'info' },
  };

  const { lastNight } = sleepData;
  const lastNightTone = scoreTone(lastNight.sleepScore);
  const recoveryTone = scoreTone(recoveryScore);

  // Last night on a 24-hour strip. A night that crosses midnight is drawn as two blocks.
  const toHour = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  };
  const bedHour = toHour(lastNight.bedTime);
  const wakeHour = toHour(lastNight.wakeTime);
  const sleepWindow: TapeSegment[] =
    bedHour > wakeHour
      ? [
          { from: bedHour, to: 24, tone: 'info', label: 'Sleep' },
          { from: 0, to: wakeHour, tone: 'info', label: 'Sleep' },
        ]
      : [{ from: bedHour, to: wakeHour, tone: 'info', label: 'Sleep' }];

  // The stages are told apart by tone and always named in the rows below the bar.
  const sleepStages: { name: string; hours: number; share: number; tone: Tone; asleep: boolean }[] = [
    { name: 'Deep sleep', hours: lastNight.deepSleep, share: 28, tone: 'info', asleep: true },
    { name: 'Light sleep', hours: lastNight.lightSleep, share: 56, tone: 'ok', asleep: true },
    { name: 'REM sleep', hours: lastNight.remSleep, share: 16, tone: 'plan', asleep: true },
    { name: 'Awake', hours: lastNight.awake, share: 7, tone: 'neutral', asleep: false },
  ];

  const maxHours = 9;
  const scoreBands: { tone: Tone; label: string }[] = [
    { tone: 'ok', label: 'Score 80 or above' },
    { tone: 'caution', label: 'Score 60 to 79' },
    { tone: 'warning', label: 'Score below 60' },
  ];

  return (
    <div>
      <PageHeader title="Sleep and recovery" lead="Track your rest with wearable devices" story={4} />

      {/* Readiness first: the one thing to know before duty */}
      <Section>
        <Notice
          tone={recoveryTone}
          icon={recoveryTone === 'ok' ? CircleCheck : TriangleAlert}
          title={
            <>
              Recovery score: <span className="tabular">{recoveryScore}/100</span>
            </>
          }
        >
          Your body is well recovered and ready for duty. Maintain good sleep habits.
        </Notice>
      </Section>

      <Section title="Last night's sleep score">
        <Panel>
          <p className="tabular font-display text-[44px] font-semibold leading-none text-ink">
            {lastNight.sleepScore}
            <span className="ml-1 text-[18px] font-medium text-ink-faint">/100</span>
          </p>
          <div className="mt-4">
            <Meter value={lastNight.sleepScore} tone={lastNightTone} label="Sleep score" valueLabel={`${lastNight.sleepScore}%`} />
          </div>
          <div className="mt-5">
            <Tape title="Sleep window" segments={sleepWindow} />
          </div>
        </Panel>
        <div className="mt-3">
          <StatGrid columns={3}>
            <Stat label="Bedtime" value={lastNight.bedTime} />
            <Stat label="Wake time" value={lastNight.wakeTime} />
            <Stat label="Total sleep" value={lastNight.totalSleep} unit="h" />
          </StatGrid>
        </div>
      </Section>

      <Section title="Sleep stages">
        <Panel padded={false}>
          <div className="px-4 pt-4">
            <div className="flex h-3 gap-0.5 overflow-hidden rounded-full" role="img" aria-label="Share of sleep time: deep sleep 28%, light sleep 56%, REM sleep 16%">
              {sleepStages
                .filter((stage) => stage.asleep)
                .map((stage) => (
                  <div key={stage.name} className={toneSolid[stage.tone]} style={{ width: `${stage.share}%` }} title={stage.name} />
                ))}
            </div>
          </div>
          <div className="px-4 pt-1">
            {sleepStages.map((stage) => (
              <div key={stage.name} className="flex items-center justify-between gap-4 border-b border-line-soft py-3 last:border-b-0">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`h-3 w-3 shrink-0 rounded-sm ${toneSolid[stage.tone]}`} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-[15px] text-ink">{stage.name}</p>
                    <p className="tabular text-[13px] text-ink-faint">{stage.share}% of total</p>
                  </div>
                </div>
                <p className="tabular shrink-0 text-right text-[15px] font-medium text-ink">{stage.hours} h</p>
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      <Section title="Health metrics">
        <StatGrid columns={3}>
          <Stat label="Heart rate" value={lastNight.heartRate.avg} unit="bpm" note="Average" />
          <Stat label="HRV" value={lastNight.hrv} unit="ms" />
          <Stat label="Resp. rate" value={lastNight.respiratoryRate} unit="brpm" />
        </StatGrid>
      </Section>

      <Section title="Weekly trend">
        <Panel>
          <div className="flex items-end justify-between gap-2">
            {sleepData.weeklyData.map((day) => (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="tabular text-[12px] font-medium text-ink">{day.hours.toFixed(1)} h</span>
                <div
                  className={`w-full rounded-t-md ${toneSolid[scoreTone(day.score)]}`}
                  style={{ height: `${(day.hours / maxHours) * 104}px` }}
                  title={`${day.date}: ${day.hours} h, score ${day.score}`}
                />
                <span className="text-[12.5px] text-ink-soft">{day.date}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-line-soft pt-3 text-[12.5px] text-ink-soft">
            {scoreBands.map((band) => (
              <span key={band.label} className="inline-flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-sm ${toneSolid[band.tone]}`} aria-hidden="true" />
                {band.label}
              </span>
            ))}
          </div>
        </Panel>
        <div className="mt-3">
          <StatGrid>
            <Stat label="Weekly average" value="7.4" unit="h" />
            <Stat label="Average score" value="79" tone={scoreTone(79)} />
          </StatGrid>
        </div>
      </Section>

      <Section
        title="Connected devices"
        aside={
          <span aria-live="polite">
            {syncStatus === 'idle' ? (
              <Button variant="quiet" icon={RefreshCw} onClick={handleSync}>
                Sync all
              </Button>
            ) : null}
            {syncStatus === 'syncing' ? (
              <Button variant="quiet" disabled>
                <LoaderCircle size={17} strokeWidth={2} className="animate-spin" aria-hidden="true" />
                Syncing...
              </Button>
            ) : null}
            {syncStatus === 'success' ? <Status tone="ok">Synced</Status> : null}
          </span>
        }
      >
        <RowList>
          {devices.map((device) => {
            const Icon = device.icon;
            const connected = device.status === 'connected';
            return (
              <div key={device.name} className="border-b border-line-soft py-3.5 last:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon size={18} strokeWidth={1.75} className="shrink-0 text-ink-faint" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-ink">{device.name}</p>
                      <p className="tabular text-[13px] text-ink-faint">Last sync: {device.lastSync}</p>
                    </div>
                  </div>
                  <Status tone={connected ? 'ok' : 'neutral'}>{connected ? 'Connected' : 'Disconnected'}</Status>
                </div>
                {device.battery !== null && (
                  <div className="mt-3">
                    <Meter value={device.battery} tone={batteryTone(device.battery)} label="Battery" valueLabel={`${device.battery}%`} />
                  </div>
                )}
              </div>
            );
          })}
        </RowList>
      </Section>

      <Section title="Insights and recommendations">
        <RowList>
          {sleepData.insights.map((insight) => {
            const style = insightStyle[insight.type] ?? insightStyle.info;
            const Icon = style.icon;
            return (
              <div key={insight.text} className="flex items-start gap-3 border-b border-line-soft py-3 last:border-b-0">
                <Icon size={18} strokeWidth={1.75} className={`mt-0.5 shrink-0 ${toneText[style.tone]}`} aria-hidden="true" />
                <p className="text-[15px] text-ink">{insight.text}</p>
              </div>
            );
          })}
        </RowList>
      </Section>
    </div>
  );
}
