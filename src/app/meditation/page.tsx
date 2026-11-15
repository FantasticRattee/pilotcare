'use client';

import { useEffect, useRef, useState } from 'react';
import { BedDouble, Brain, HeartPulse, Leaf, Lightbulb, Moon, PersonStanding, PlaneTakeoff, Play, Smile, Square, Wind, type LucideIcon } from 'lucide-react';
import { Button, Meter, Notice, PageHeader, Panel, Row, RowList, Section, Stat, StatGrid, Status } from '@/components/ui';

type MeditationSession = { id: number; title: string; duration: string; description: string; icon: LucideIcon; category: string };

export default function MeditationPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [completedSessions, setCompletedSessions] = useState<number[]>([]);

  const meditationSessions: MeditationSession[] = [
    {
      id: 1,
      title: 'Quick relaxation',
      duration: '5 min',
      description: 'Perfect for a quick break between flights',
      icon: Leaf,
      category: 'Quick',
    },
    {
      id: 2,
      title: 'Deep breathing',
      duration: '10 min',
      description: 'Reduce stress and anxiety with focused breathing',
      icon: Wind,
      category: 'Breathing',
    },
    {
      id: 3,
      title: 'Pre-flight calm',
      duration: '8 min',
      description: 'Prepare mentally before your next flight',
      icon: PlaneTakeoff,
      category: 'Focus',
    },
    {
      id: 4,
      title: 'Sleep preparation',
      duration: '15 min',
      description: 'Wind down and prepare for quality rest',
      icon: Moon,
      category: 'Sleep',
    },
    {
      id: 5,
      title: 'Body scan',
      duration: '12 min',
      description: 'Release tension and improve awareness',
      icon: PersonStanding,
      category: 'Mindfulness',
    },
    {
      id: 6,
      title: 'Stress relief',
      duration: '10 min',
      description: 'Let go of work-related stress and tension',
      icon: Smile,
      category: 'Stress',
    },
  ];

  const stats = {
    totalSessions: completedSessions.length,
    totalMinutes: completedSessions.length * 10, // Simplified calculation
    streak: 3,
    thisWeek: 5,
  };

  // The running timer is kept here so Stop, a new session, or leaving the screen can end it.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  const handlePlaySession = (sessionId: number) => {
    clearTimer();
    setSelectedSession(sessionId);
    setIsPlaying(true);
    setProgress(0);

    // Simulate progress
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearTimer();
          setIsPlaying(false);
          setCompletedSessions((done) => (done.includes(sessionId) ? done : [...done, sessionId]));
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  const handleStopSession = () => {
    clearTimer();
    setIsPlaying(false);
    setProgress(0);
    setSelectedSession(null);
  };

  const currentSession = meditationSessions.find((s) => s.id === selectedSession);

  return (
    <div>
      <PageHeader title="Meditation and mindfulness" lead="Find your calm, reduce stress" story={2} />

      <Section>
        <StatGrid>
          <Stat label="Sessions" value={stats.totalSessions} />
          <Stat label="Minutes" value={stats.totalMinutes} />
          <Stat label="Day streak" value={stats.streak} unit="days" />
          <Stat label="This week" value={stats.thisWeek} />
        </StatGrid>
      </Section>

      {/* The session in progress: magenta marks the active plan */}
      {isPlaying && currentSession && (
        <Section title="Now playing">
          <Panel>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-[20px] font-semibold leading-snug text-ink">{currentSession.title}</p>
                <p className="mt-0.5 text-[14px] text-ink-soft">{currentSession.description}</p>
              </div>
              <Status tone="plan">Playing</Status>
            </div>
            <p className="tabular mt-4 font-display text-[44px] font-semibold leading-none text-ink">
              {progress}
              <span className="ml-1 text-[18px] font-medium text-ink-faint">%</span>
            </p>
            <div className="mt-3">
              <Meter value={progress} tone="plan" label="Session progress" valueLabel={currentSession.duration} />
            </div>
            <div className="mt-4">
              <Button variant="secondary" icon={Square} onClick={handleStopSession} full>
                Stop
              </Button>
            </div>
          </Panel>
        </Section>
      )}

      <Section title="Available sessions">
        <RowList>
          {meditationSessions.map((session) => {
            const isCompleted = completedSessions.includes(session.id);
            const isActive = selectedSession === session.id;
            const Icon = session.icon;

            return (
              <div key={session.id} className="flex items-start gap-3.5 border-b border-line-soft py-3.5 last:border-b-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-panel text-ink">
                  <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] font-medium text-ink">
                    {session.title}
                    {isActive && isPlaying ? <Status tone="plan">Playing</Status> : null}
                    {isCompleted ? <Status tone="ok">Done</Status> : null}
                  </p>
                  <p className="tabular text-[13px] text-ink-faint">
                    {session.duration}, {session.category}
                  </p>
                  <p className="mt-1 text-[14px] text-ink-soft">{session.description}</p>
                </div>
                <div className="shrink-0 pt-1">
                  <Button
                    variant="quiet"
                    icon={Play}
                    onClick={() => handlePlaySession(session.id)}
                    disabled={isPlaying}
                    ariaLabel={isActive && isPlaying ? `Playing ${session.title}` : `Start session: ${session.title}`}
                  >
                    {isActive && isPlaying ? 'Playing' : 'Start'}
                  </Button>
                </div>
              </div>
            );
          })}
        </RowList>
      </Section>

      <Section title="Benefits of meditation">
        <RowList>
          <Row icon={Brain} label="Improved focus" hint="Enhance concentration for critical flight tasks" />
          <Row icon={Smile} label="Stress reduction" hint="Lower cortisol levels and anxiety" />
          <Row icon={BedDouble} label="Better sleep" hint="Improve sleep quality and recovery" />
          <Row icon={HeartPulse} label="Heart health" hint="Support cardiovascular wellness" />
        </RowList>
      </Section>

      <Section>
        <Notice tone="info" icon={Lightbulb} title="Tip">
          Try meditating at the same time each day to build a consistent habit. Even 5 minutes can make a difference.
        </Notice>
      </Section>
    </div>
  );
}
