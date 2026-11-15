'use client';

import { useState } from 'react';
import { LoaderCircle, RefreshCw, TriangleAlert } from 'lucide-react';
import { Button, Meter, Notice, PageHeader, Panel, RowList, Section, Status, type Tone } from '@/components/ui';

type SyncStatus = 'success' | 'error' | 'pending';
type DutyLimitation = { label: string; current: number; limit: number; unit: string; warning?: boolean };

export default function ApiSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('2 min ago');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('success');

  const dutyLimitations: DutyLimitation[] = [
    { label: 'Flight duty', current: 42.5, limit: 100, unit: 'hrs/month' },
    { label: 'Daily time', current: 6.2, limit: 8, unit: 'hrs/day' },
    { label: 'Rest required', current: 11, limit: 12, unit: 'hours', warning: true },
    { label: 'Consecutive days', current: 5, limit: 6, unit: 'days' },
  ];

  const flightData = [
    { id: 'BA123', route: 'LHR-JFK', date: 'Oct 18', hours: 8.5, status: 'Synced' },
    { id: 'BA124', route: 'JFK-LHR', date: 'Oct 19', hours: 7.2, status: 'Synced' },
    { id: 'BA456', route: 'LHR-DXB', date: 'Oct 21', hours: 6.8, status: 'Pending' },
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setSyncStatus('pending');

    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('success');
      setLastSync('Just now');
    }, 2000);
  };

  // Connection state: green when linked, red when the sync failed, teal while it runs.
  const syncTone: Record<SyncStatus, Tone> = { success: 'ok', error: 'warning', pending: 'info' };
  const syncLabel: Record<SyncStatus, string> = { success: 'Connected', error: 'Failed', pending: 'Syncing' };

  return (
    <div>
      <PageHeader title="Airline sync" lead="Flight duty tracking" story={1} />

      <Section title="Sync status">
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] text-ink-soft">Last synced</p>
              <p className="tabular font-display text-[22px] font-semibold leading-tight text-ink">{lastSync}</p>
            </div>
            <span aria-live="polite">
              <Status tone={syncTone[syncStatus]}>{syncLabel[syncStatus]}</Status>
            </span>
          </div>
          <div className="mt-4">
            <Button onClick={handleSync} disabled={isSyncing} icon={isSyncing ? undefined : RefreshCw} full>
              {isSyncing ? (
                <>
                  <LoaderCircle size={17} strokeWidth={1.75} className="animate-spin" aria-hidden="true" />
                  Syncing...
                </>
              ) : (
                'Sync now'
              )}
            </Button>
          </div>
        </Panel>
      </Section>

      <Section title="Flight limitations">
        <Notice tone="warning" icon={TriangleAlert} title="Limitation alert">
          You have <strong className="tabular font-semibold text-ink">57.5 hours remaining</strong> this month. Rest period is below minimum.
        </Notice>
        <RowList className="mt-3">
          {dutyLimitations.map((limit) => {
            const percentage = (limit.current / limit.limit) * 100;
            // Red when the limit is already broken, amber above 80% of it, green otherwise.
            const tone: Tone = limit.warning ? 'warning' : percentage > 80 ? 'caution' : 'ok';

            return (
              <div key={limit.label} className="border-b border-line-soft py-4 last:border-b-0">
                <Meter
                  label={limit.label}
                  valueLabel={`${limit.current} / ${limit.limit} ${limit.unit}`}
                  value={limit.current}
                  max={limit.limit}
                  tone={tone}
                  note={limit.warning ? <span className="font-medium text-warning">Below minimum</span> : undefined}
                />
              </div>
            );
          })}
        </RowList>
      </Section>

      <Section title="Synced flights">
        <RowList>
          {flightData.map((flight) => (
            <div key={flight.id} className="flex items-center justify-between gap-3 border-b border-line-soft py-3.5 last:border-b-0">
              <div className="min-w-0">
                <p className="tabular text-[15px] font-medium text-ink">
                  {flight.id} {flight.route}
                </p>
                <p className="tabular text-[13px] text-ink-faint">
                  {flight.date}, {flight.hours} h duty time
                </p>
              </div>
              <Status tone={flight.status === 'Synced' ? 'ok' : 'neutral'}>{flight.status}</Status>
            </div>
          ))}
        </RowList>
      </Section>
    </div>
  );
}
