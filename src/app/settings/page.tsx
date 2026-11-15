'use client';

import { useState } from 'react';
import { Bell, Check, CircleCheck, Languages, LoaderCircle, Save } from 'lucide-react';
import { Button, Notice, PageHeader, Panel, Row, RowList, Section, Segmented, Toggle } from '@/components/ui';

export default function Settings() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [notifications, setNotifications] = useState(true);
  // Shown switched on in the prototype; kept on by default.
  const [languageAlerts, setLanguageAlerts] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
    { code: 'ko', name: '한국어' },
    { code: 'ar', name: 'العربية' },
    { code: 'ru', name: 'Русский' },
    { code: 'th', name: 'ไทย' },
  ];

  // Sample screen text for the languages that already have a translation.
  const previews: Record<string, { welcome: string; dutyHours: string; sleepScore: string }> = {
    en: { welcome: 'Welcome to PilotCare', dutyHours: 'Your flight duty hours: 45.2 hours', sleepScore: 'Sleep score: 78/100' },
    es: { welcome: 'Bienvenido a PilotCare', dutyHours: 'Sus horas de vuelo: 45.2 horas', sleepScore: 'Puntuación de sueño: 78/100' },
    fr: { welcome: 'Bienvenue sur PilotCare', dutyHours: 'Vos heures de vol: 45.2 heures', sleepScore: 'Score de sommeil: 78/100' },
    de: { welcome: 'Willkommen bei PilotCare', dutyHours: 'Ihre Flugstunden: 45.2 Stunden', sleepScore: 'Schlafwert: 78/100' },
    ja: { welcome: 'PilotCareへようこそ', dutyHours: 'フライト時間: 45.2時間', sleepScore: '睡眠スコア: 78/100' },
    zh: { welcome: '欢迎使用PilotCare', dutyHours: '飞行时间: 45.2小时', sleepScore: '睡眠评分: 78/100' },
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const selectedName = languages.find((l) => l.code === selectedLanguage)?.name;
  const preview = previews[selectedLanguage];

  return (
    <div>
      <PageHeader title="Settings" lead="Multi-language support for pilot preferences" story={9} />

      <Section title="Language preferences">
        <p className="mb-3 text-[14px] text-ink-soft">Select your preferred language for the application interface</p>

        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Language">
          {languages.map((lang) => {
            const selected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`flex min-w-0 items-center gap-2.5 rounded-md border px-3 py-2.5 text-left ${
                  selected ? 'border-info bg-info-soft' : 'border-line bg-surface hover:bg-panel'
                }`}
              >
                <span
                  className={`flex h-6 w-9 shrink-0 items-center justify-center rounded-md border text-[12px] font-semibold leading-none ${
                    selected ? 'border-info text-info' : 'border-line text-ink-soft'
                  }`}
                >
                  {lang.code.toUpperCase()}
                </span>
                <span lang={lang.code} className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink">
                  {lang.name}
                </span>
                {selected ? <Check size={17} strokeWidth={1.75} className="shrink-0 text-info" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-[14px] text-ink-soft">
          Currently selected: <strong className="font-semibold text-ink">{selectedName}</strong>
        </p>
      </Section>

      <Section title="Regional settings">
        <Panel>
          <div>
            <p className="mb-1.5 text-[14px] text-ink-soft">Time format</p>
            <Segmented
              label="Time format"
              value={timeFormat}
              onChange={setTimeFormat}
              options={[
                { value: '12h', label: '12-hour (2:30 PM)' },
                { value: '24h', label: '24-hour (14:30)' },
              ]}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="settings-date-format" className="mb-1.5 block text-[14px] text-ink-soft">
              Date format
            </label>
            <select id="settings-date-format" className="w-full rounded-md border border-line bg-surface px-3 py-2.5 text-[15px] text-ink">
              <option>DD/MM/YYYY (18/10/2025)</option>
              <option>MM/DD/YYYY (10/18/2025)</option>
              <option>YYYY-MM-DD (2025-10-18)</option>
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="settings-timezone" className="mb-1.5 block text-[14px] text-ink-soft">
              Timezone
            </label>
            <select id="settings-timezone" className="w-full rounded-md border border-line bg-surface px-3 py-2.5 text-[15px] text-ink">
              <option>UTC (Coordinated Universal Time)</option>
              <option>GMT (Greenwich Mean Time)</option>
              <option>EST (Eastern Standard Time)</option>
              <option>PST (Pacific Standard Time)</option>
              <option>CET (Central European Time)</option>
              <option>JST (Japan Standard Time)</option>
            </select>
          </div>
        </Panel>
      </Section>

      <Section title="Notification settings">
        <RowList>
          <Row icon={Bell} label="Enable notifications" hint="Receive alerts and reminders">
            <Toggle label="Enable notifications" checked={notifications} onChange={setNotifications} />
          </Row>
          <Row icon={Languages} label="Language-specific alerts" hint="Receive alerts in selected language">
            <Toggle label="Language-specific alerts" checked={languageAlerts} onChange={setLanguageAlerts} />
          </Row>
        </RowList>
      </Section>

      <Section title="Preview">
        <p className="mb-3 text-[14px] text-ink-soft">How the app would appear in your selected language:</p>
        <Panel>
          {preview ? (
            <div lang={selectedLanguage}>
              <p className="font-display text-[18px] font-semibold leading-snug text-ink">{preview.welcome}</p>
              <p className="tabular mt-1 text-[14px] text-ink-soft">{preview.dutyHours}</p>
              <p className="tabular text-[14px] text-ink-soft">{preview.sleepScore}</p>
            </div>
          ) : (
            <div>
              <p className="font-display text-[18px] font-semibold leading-snug text-ink">Language preview coming soon</p>
              <p className="mt-1 text-[14px] text-ink-soft">Translation for {selectedName} will be displayed here</p>
            </div>
          )}
        </Panel>
      </Section>

      <Section>
        <Button onClick={handleSaveSettings} disabled={saveStatus === 'saving'} icon={saveStatus === 'saving' ? undefined : Save} full>
          {saveStatus === 'saving' ? (
            <>
              <LoaderCircle size={17} strokeWidth={1.75} className="animate-spin" aria-hidden="true" />
              Saving...
            </>
          ) : (
            'Save settings'
          )}
        </Button>

        <div role="status" aria-live="polite" className={saveStatus === 'saved' ? 'mt-3' : undefined}>
          {saveStatus === 'saved' ? <Notice tone="ok" icon={CircleCheck} title="Settings saved" /> : null}
        </div>
      </Section>
    </div>
  );
}
