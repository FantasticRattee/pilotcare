import { ClipboardCheck, Gauge, Languages, MonitorSmartphone, RefreshCw, ScanHeart, CircleCheck, type LucideIcon } from "lucide-react";
import { ButtonLink, LinkRow, Notice, PageHeader, RowList, Section, Stat, StatGrid } from "@/components/ui";

type Feature = { id: number; title: string; description: string; href: string; icon: LucideIcon };

export default function Home() {
  const features: Feature[] = [
    { id: 1, title: "Airline Sync", description: "Track flight duty limits", href: "/api-sync", icon: RefreshCw },
    { id: 7, title: "Compliance", description: "Safety reports", href: "/compliance-report", icon: ClipboardCheck },
    { id: 9, title: "Languages", description: "Multi-language support", href: "/settings", icon: Languages },
    { id: 10, title: "Dashboard", description: "Health overview", href: "/dashboard", icon: Gauge },
    { id: 11, title: "Device Sync", description: "Multi-device support", href: "/device-sync", icon: MonitorSmartphone },
    { id: 12, title: "AI Prediction", description: "Fatigue forecasting", href: "/fatigue-prediction", icon: ScanHeart },
  ];

  return (
    <div>
      <PageHeader title="Welcome to PilotCare" lead="Your complete flight health companion" />

      {/* Today's status: the answer first, then the three numbers behind it */}
      <Section>
        <Notice tone="ok" icon={CircleCheck} title="All systems ready">
          Today&apos;s status
        </Notice>
        <div className="mt-3">
          <StatGrid columns={3}>
            <Stat label="Sleep score" value="78" unit="/100" />
            <Stat label="Flights" value="2" unit="today" />
            <Stat label="Rest" value="11" unit="h" />
          </StatGrid>
        </div>
      </Section>

      <Section title="Quick actions">
        <div className="grid gap-2">
          <ButtonLink href="/dashboard" icon={Gauge} full>
            View dashboard
          </ButtonLink>
          <div className="grid grid-cols-2 gap-2">
            <ButtonLink href="/api-sync" variant="secondary" icon={RefreshCw} full>
              Sync flights
            </ButtonLink>
            <ButtonLink href="/fatigue-prediction" variant="secondary" icon={ScanHeart} full>
              Fatigue check
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section title="Features">
        <RowList>
          {features.map((feature) => (
            <LinkRow key={feature.id} href={feature.href} title={feature.title} hint={feature.description} icon={feature.icon} />
          ))}
        </RowList>
      </Section>
    </div>
  );
}
