import {
  BedDouble,
  Bell,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Flower2,
  Info,
  LifeBuoy,
  Lock,
  MessageSquare,
  MonitorSmartphone,
  RefreshCw,
  ScanHeart,
  Settings,
  Upload,
  type LucideIcon,
} from 'lucide-react';
import { Button, LinkRow, PageHeader, Row, RowList, Section } from '@/components/ui';

type MenuItem = { href: string; icon: LucideIcon; label: string; description: string; category: string };

export default function MorePage() {
  const menuItems: MenuItem[] = [
    {
      href: '/meditation',
      icon: Flower2,
      label: 'Meditation and mindfulness',
      description: 'Reduce stress with guided sessions',
      category: 'Wellness and analytics',
    },
    {
      href: '/sleep-tracking',
      icon: BedDouble,
      label: 'Sleep tracking',
      description: 'Monitor sleep quality with wearables',
      category: 'Wellness and analytics',
    },
    {
      href: '/fatigue-prediction',
      icon: ScanHeart,
      label: 'AI fatigue prediction',
      description: 'Get AI-powered fatigue insights',
      category: 'Wellness and analytics',
    },
    {
      href: '/compliance-report',
      icon: ClipboardCheck,
      label: 'Compliance report',
      description: 'View flight duty and rest compliance',
      category: 'Reports, data and settings',
    },
    {
      href: '/api-sync',
      icon: RefreshCw,
      label: 'API sync',
      description: 'Sync with external systems',
      category: 'Reports, data and settings',
    },
    {
      href: '/device-sync',
      icon: MonitorSmartphone,
      label: 'Device sync',
      description: 'Connect wearable devices',
      category: 'Reports, data and settings',
    },
    {
      href: '/settings',
      icon: Settings,
      label: 'Settings',
      description: 'App preferences and configuration',
      category: 'Reports, data and settings',
    },
  ];

  // Group items by category
  const groupedItems = menuItems.reduce(
    (acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>,
  );

  const infoItems: { icon: LucideIcon; label: string }[] = [
    { icon: LifeBuoy, label: 'Help and support' },
    { icon: FileText, label: 'Privacy policy' },
    { icon: Info, label: 'About PilotCare' },
  ];

  const quickActions: { icon: LucideIcon; label: string }[] = [
    { icon: Bell, label: 'Notifications' },
    { icon: Upload, label: 'Export data' },
    { icon: Lock, label: 'Security' },
    { icon: MessageSquare, label: 'Feedback' },
  ];

  return (
    <div>
      <PageHeader title="More" lead="Additional features and settings" />

      {/* The menu: every other screen, in two groups */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <Section key={category} title={category}>
          <RowList>
            {items.map((item) => (
              <LinkRow key={item.href} href={item.href} title={item.label} hint={item.description} icon={item.icon} />
            ))}
          </RowList>
        </Section>
      ))}

      <Section title="Quick actions">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button key={action.label} variant="secondary" icon={action.icon} full>
              {action.label}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Information">
        <RowList>
          {infoItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className="-mx-4 flex w-[calc(100%+2rem)] items-center gap-3.5 border-b border-line-soft px-4 py-3.5 text-left last:border-b-0 hover:bg-panel"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-panel text-ink">
                  <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 text-[15px] font-medium text-ink">{item.label}</span>
                <ChevronRight size={18} className="shrink-0 text-ink-faint" aria-hidden="true" />
              </button>
            );
          })}
        </RowList>
      </Section>

      <Section title="PilotCare" aside="Health and wellness">
        <RowList>
          <Row label="Version" value="1.0.0" />
          <Row label="Build" value="2025.11.06" />
        </RowList>
      </Section>
    </div>
  );
}
