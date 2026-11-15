'use client';

import { useState } from 'react';
import {
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  HeartPulse,
  LoaderCircle,
  Moon,
  RefreshCw,
  Settings2,
  Smartphone,
  Tablet,
  TabletSmartphone,
  Watch,
  type LucideIcon,
} from 'lucide-react';
import { Button, PageHeader, Panel, Row, RowList, Section, Status, Toggle } from '@/components/ui';

type Device = { id: number; name: string; type: string; icon: LucideIcon; status: string; lastSync: string; dataSize: string };
type SyncSettingKey = 'automatic' | 'wifiOnly' | 'background' | 'conflictResolution';

export default function DeviceSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('2025-10-18 18:45:00');
  // The four switches start as the prototype showed them: three on, conflict resolution off.
  const [syncSettings, setSyncSettings] = useState<Record<SyncSettingKey, boolean>>({
    automatic: true,
    wifiOnly: true,
    background: true,
    conflictResolution: false,
  });

  const devices: Device[] = [
    { id: 1, name: 'iPhone 15 Pro', type: 'iOS', icon: Smartphone, status: 'Connected', lastSync: '2 minutes ago', dataSize: '45.2 MB' },
    { id: 2, name: 'Samsung Galaxy S24', type: 'Android', icon: Smartphone, status: 'Connected', lastSync: '5 minutes ago', dataSize: '42.8 MB' },
    { id: 3, name: 'Apple Watch Series 9', type: 'Smart watch', icon: Watch, status: 'Connected', lastSync: '1 minute ago', dataSize: '12.5 MB' },
    { id: 4, name: 'iPad Air', type: 'iOS', icon: Tablet, status: 'Offline', lastSync: '2 hours ago', dataSize: '38.1 MB' },
  ];

  const syncedData = [
    { category: 'Sleep data', icon: Moon, records: 1245, lastUpdate: '2 min ago', synced: true },
    { category: 'Flight schedule', icon: CalendarDays, records: 87, lastUpdate: '5 min ago', synced: true },
    { category: 'Health metrics', icon: HeartPulse, records: 3421, lastUpdate: '1 min ago', synced: true },
    { category: 'Duty logs', icon: ClipboardList, records: 156, lastUpdate: '3 min ago', synced: true },
    { category: 'Compliance reports', icon: ClipboardCheck, records: 24, lastUpdate: '10 min ago', synced: true },
  ];

  const platforms = [
    { name: 'iOS support', icon: Smartphone, description: 'Full support for iPhone and iPad devices with real-time sync' },
    { name: 'Android support', icon: TabletSmartphone, description: 'Compatible with all Android devices running version 8.0+' },
    { name: 'Smart watch', icon: Watch, description: 'Track health metrics directly from Apple Watch and Wear OS' },
  ];

  const settingRows: { key: SyncSettingKey; label: string; hint: string }[] = [
    { key: 'automatic', label: 'Automatic sync', hint: 'Sync data automatically when online' },
    { key: 'wifiOnly', label: 'Sync on Wi-Fi only', hint: 'Save mobile data by syncing on Wi-Fi' },
    { key: 'background', label: 'Background sync', hint: 'Keep data synced in background' },
    { key: 'conflictResolution', label: 'Conflict resolution', hint: 'Automatically resolve data conflicts' },
  ];

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleString());
    }, 2000);
  };

  const connectedCount = devices.filter((device) => device.status === 'Connected').length;

  return (
    <div>
      <PageHeader title="Device sync" lead="Sync data across iOS, Android and smart watch devices" story={11} />

      <Section title="Multi-device synchronization">
        <Panel>
          <p className="text-[14px] text-ink-soft">All your health and flight data synced across all devices</p>
          <div className="mt-3" aria-live="polite">
            <p className="text-[13px] text-ink-soft">Last sync</p>
            <p className="tabular font-display text-[22px] font-semibold leading-tight text-ink">{lastSync}</p>
          </div>
          <div className="mt-4">
            <Button onClick={handleSyncAll} disabled={isSyncing} icon={isSyncing ? undefined : RefreshCw} full>
              {isSyncing ? (
                <>
                  <LoaderCircle size={17} strokeWidth={1.75} className="animate-spin" aria-hidden="true" />
                  Syncing...
                </>
              ) : (
                'Sync all devices'
              )}
            </Button>
          </div>
        </Panel>
      </Section>

      <Section
        title="Connected devices"
        aside={
          <span className="tabular">
            {connectedCount} of {devices.length} connected
          </span>
        }
      >
        <RowList>
          {devices.map((device) => {
            const Icon = device.icon;
            const connected = device.status === 'Connected';
            return (
              <div key={device.id} className="border-b border-line-soft py-3.5 last:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-panel text-ink">
                      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-ink">{device.name}</p>
                      <p className="text-[13px] text-ink-faint">{device.type}</p>
                    </div>
                  </div>
                  <Status tone={connected ? 'ok' : 'neutral'}>{device.status}</Status>
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-3 pl-12">
                  <div>
                    <dt className="text-[12.5px] text-ink-faint">Last sync</dt>
                    <dd className="tabular text-[14px] font-medium text-ink">{device.lastSync}</dd>
                  </div>
                  <div>
                    <dt className="text-[12.5px] text-ink-faint">Data size</dt>
                    <dd className="tabular text-[14px] font-medium text-ink">{device.dataSize}</dd>
                  </div>
                </dl>

                <div className="mt-2.5 flex gap-6 pl-12">
                  <Button variant="quiet" icon={RefreshCw} disabled={!connected} ariaLabel={`Sync ${device.name} now`}>
                    Sync now
                  </Button>
                  <Button variant="quiet" icon={Settings2} ariaLabel={`${device.name} settings`}>
                    Settings
                  </Button>
                </div>
              </div>
            );
          })}
        </RowList>
      </Section>

      <Section title="Synced data overview">
        <RowList>
          {syncedData.map((data) => (
            <Row
              key={data.category}
              icon={data.icon}
              label={data.category}
              hint={<span className="tabular">{`${data.records.toLocaleString('en-US')} records, updated ${data.lastUpdate}`}</span>}
            >
              <Status tone="ok">Synced</Status>
            </Row>
          ))}
        </RowList>
      </Section>

      <Section title="Platform support">
        <RowList>
          {platforms.map((platform) => (
            <Row key={platform.name} icon={platform.icon} label={platform.name} hint={platform.description}>
              <Status tone="ok">Supported</Status>
            </Row>
          ))}
        </RowList>
      </Section>

      <Section title="Sync settings">
        <RowList>
          {settingRows.map((setting) => (
            <Row key={setting.key} label={setting.label} hint={setting.hint}>
              <Toggle
                label={setting.label}
                checked={syncSettings[setting.key]}
                onChange={(checked) => setSyncSettings((current) => ({ ...current, [setting.key]: checked }))}
              />
            </Row>
          ))}
        </RowList>
      </Section>
    </div>
  );
}
