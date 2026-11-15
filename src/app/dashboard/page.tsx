'use client';

import { useState } from 'react';
import { Activity, BedDouble, Clock, HeartPulse, Info, TriangleAlert, CircleCheck } from 'lucide-react';
import { Meter, Notice, PageHeader, Panel, RowList, Section, Stat, StatGrid, Status, type Tone } from '@/components/ui';

export default function Dashboard() {
  const [sleepScore] = useState(78);
  const [fatigueRisk] = useState('Medium');

  const dutySchedule = [
    { date: 'Oct 18', flight: 'BA123 LHR-JFK', hours: 8.5, status: 'Completed' },
    { date: 'Oct 19', flight: 'BA124 JFK-LHR', hours: 7.2, status: 'Scheduled' },
    { date: 'Oct 20', flight: 'Rest Day', hours: 0, status: 'Rest' },
    { date: 'Oct 21', flight: 'BA456 LHR-DXB', hours: 6.8, status: 'Scheduled' },
  ];

  // Colour carries the status: red for high risk, amber for medium, green for low.
  const riskTone: Tone = fatigueRisk === 'High' ? 'warning' : fatigueRisk === 'Medium' ? 'caution' : 'ok';
  const sleepTone: Tone = sleepScore >= 70 ? 'ok' : 'caution';
  const statusTone: Record<string, Tone> = { Completed: 'ok', Scheduled: 'info', Rest: 'neutral' };

  const sleepMessage =
    sleepScore >= 80 ? 'Excellent. You are well rested.' : sleepScore >= 70 ? 'Good quality. Keep it up.' : 'Below optimal. Consider more rest.';

  return (
    <div>
      <PageHeader title="Dashboard" lead="Your health overview" story={10} />

      {/* Fatigue risk comes first: it is the one thing to know before a flight */}
      <Section>
        <Notice tone={riskTone} icon={fatigueRisk === 'Low' ? CircleCheck : TriangleAlert} title={`Fatigue risk level: ${fatigueRisk}`}>
          Based on your sleep and duty schedule
        </Notice>
      </Section>

      <Section title="Sleep score">
        <Panel>
          <p className="tabular font-display text-[44px] font-semibold leading-none text-ink">
            {sleepScore}
            <span className="ml-1 text-[18px] font-medium text-ink-faint">/100</span>
          </p>
          <div className="mt-4">
            <Meter value={sleepScore} tone={sleepTone} label="Sleep score" valueLabel={`${sleepScore}%`} note={sleepMessage} />
          </div>
        </Panel>
      </Section>

      <Section title="Health metrics">
        <StatGrid>
          <Stat label="Sleep" value={sleepScore} unit="/100" icon={BedDouble} tone={sleepTone} />
          <Stat label="Sleep hours" value="6.5" unit="hrs" icon={Clock} />
          <Stat label="Heart rate" value="68" unit="bpm" icon={HeartPulse} />
          <Stat label="Recovery" value="82" unit="%" icon={Activity} />
        </StatGrid>
      </Section>

      <Section title="Duty schedule">
        <RowList>
          {dutySchedule.map((duty) => (
            <div key={`${duty.date}-${duty.flight}`} className="flex items-center justify-between gap-3 border-b border-line-soft py-3.5 last:border-b-0">
              <div className="min-w-0">
                <p className="tabular text-[15px] font-medium text-ink">{duty.flight}</p>
                <p className="tabular text-[13px] text-ink-faint">
                  {duty.date}
                  {duty.hours > 0 ? `, ${duty.hours} h duty time` : ''}
                </p>
              </div>
              <Status tone={statusTone[duty.status] ?? 'neutral'}>{duty.status}</Status>
            </div>
          ))}
        </RowList>
      </Section>

      <Section title="Overall condition">
        <Notice tone="info" icon={Info}>
          Your health status is <strong className="font-semibold text-ink">Good</strong>. Sleep quality is acceptable. Monitor fatigue levels before your next flight.
        </Notice>
      </Section>
    </div>
  );
}
