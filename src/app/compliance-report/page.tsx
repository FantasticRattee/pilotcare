'use client';

import { useState } from 'react';
import { BedDouble, CircleCheck, FileText, Info, LoaderCircle, Plane, PlaneTakeoff, TriangleAlert, type LucideIcon } from 'lucide-react';
import { Button, Meter, Notice, PageHeader, Panel, Row, RowList, Section, Stat, StatGrid, Status } from '@/components/ui';

export default function ComplianceReport() {
  const [selectedDateRange, setSelectedDateRange] = useState('last30days');
  const [startDate, setStartDate] = useState('2025-10-07');
  const [endDate, setEndDate] = useState('2025-11-06');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  // Shows the confirmation on the page once a report has been generated.
  const [reportReady, setReportReady] = useState(false);

  const reportData = {
    totalFlightHours: 156.8,
    totalDutyDays: 18,
    restDays: 12,
    averageRestPeriod: 12.3,
    minimumRestPeriod: 10.0,
    complianceStatus: 'Compliant',
    violations: 0,
    monthlyLimit: 100,
    yearlyLimit: 1000,
  };

  const detailedLogs = [
    { date: '2025-11-06', activity: 'Flight BA890', route: 'LHR-JFK', hours: 8.2, rest: 12.0, compliant: true, type: 'long-haul' },
    { date: '2025-11-05', activity: 'Rest day', route: '-', hours: 0, rest: 24.0, compliant: true, type: 'rest' },
    { date: '2025-11-04', activity: 'Flight BA234', route: 'LHR-DXB', hours: 7.5, rest: 11.5, compliant: true, type: 'long-haul' },
    { date: '2025-11-03', activity: 'Flight BA567', route: 'LHR-CDG', hours: 3.2, rest: 10.0, compliant: true, type: 'short-haul' },
    { date: '2025-11-02', activity: 'Rest day', route: '-', hours: 0, rest: 24.0, compliant: true, type: 'rest' },
    { date: '2025-11-01', activity: 'Flight BA123', route: 'LHR-SIN', hours: 9.5, rest: 14.0, compliant: true, type: 'long-haul' },
    { date: '2025-10-31', activity: 'Rest day', route: '-', hours: 0, rest: 24.0, compliant: true, type: 'rest' },
    { date: '2025-10-30', activity: 'Flight BA456', route: 'LHR-LAX', hours: 8.8, rest: 13.0, compliant: true, type: 'long-haul' },
    { date: '2025-10-29', activity: 'Flight BA789', route: 'LHR-AMS', hours: 2.5, rest: 11.0, compliant: true, type: 'short-haul' },
    { date: '2025-10-28', activity: 'Rest day', route: '-', hours: 0, rest: 24.0, compliant: true, type: 'rest' },
  ];

  const regulations = [
    { rule: 'Flight duty period limits', status: 'met' },
    { rule: 'Minimum rest requirements', status: 'met' },
    { rule: 'Maximum consecutive days', status: 'met' },
    { rule: 'Monthly hour limits', status: 'met' },
    { rule: 'Annual hour limits', status: 'met' },
  ];

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'long-haul', label: 'Long haul' },
    { value: 'short-haul', label: 'Short haul' },
    { value: 'rest', label: 'Rest days' },
  ];

  const activityTypes: Record<string, { label: string; icon: LucideIcon }> = {
    'long-haul': { label: 'long haul', icon: Plane },
    'short-haul': { label: 'short haul', icon: PlaneTakeoff },
    rest: { label: 'rest day', icon: BedDouble },
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setReportReady(false);
    setTimeout(() => {
      setIsGenerating(false);
      setReportReady(true);
    }, 1500);
  };

  const today = new Date().toISOString().split('T')[0];

  // The date fields stop at today; a typed future date still gets a warning.
  const hasFutureDate = startDate > today || endDate > today;

  const filteredLogs = detailedLogs.filter((log) => {
    if (selectedFilter === 'all') return true;
    return log.type === selectedFilter;
  });

  const isCompliant = reportData.complianceStatus === 'Compliant';

  return (
    <div>
      <PageHeader title="Compliance report" lead="Flight duty and rest compliance tracking" story={7} />

      {/* The verdict first, then the three totals behind it */}
      <Section>
        <Notice tone={isCompliant ? 'ok' : 'warning'} icon={isCompliant ? CircleCheck : TriangleAlert} title={reportData.complianceStatus}>
          Compliance status
        </Notice>
        <div className="mt-3">
          <StatGrid columns={3}>
            <Stat label="Flight hours" value={reportData.totalFlightHours} unit="h" />
            <Stat label="Duty days" value={reportData.totalDutyDays} />
            <Stat label="Rest days" value={reportData.restDays} />
          </StatGrid>
        </div>
      </Section>

      <Section title="Report period">
        <Panel>
          <div>
            <label htmlFor="report-quick-select" className="mb-1.5 block text-[14px] text-ink-soft">
              Quick select
            </label>
            <select
              id="report-quick-select"
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full rounded-md border border-line bg-surface px-3 py-2.5 text-[15px] text-ink"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <label htmlFor="report-start-date" className="mb-1.5 block text-[14px] text-ink-soft">
                Start date
              </label>
              <input
                id="report-start-date"
                type="date"
                value={startDate}
                max={today}
                onChange={(e) => setStartDate(e.target.value)}
                className="tabular w-full min-w-0 rounded-md border border-line bg-surface px-3 py-2.5 text-[15px] text-ink"
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="report-end-date" className="mb-1.5 block text-[14px] text-ink-soft">
                End date
              </label>
              <input
                id="report-end-date"
                type="date"
                value={endDate}
                max={today}
                onChange={(e) => setEndDate(e.target.value)}
                className="tabular w-full min-w-0 rounded-md border border-line bg-surface px-3 py-2.5 text-[15px] text-ink"
              />
            </div>
          </div>
          <p className="mt-3 text-[13px] text-ink-faint">Only today and past dates can be selected.</p>
        </Panel>

        {hasFutureDate ? (
          <div className="mt-3" role="alert">
            <Notice tone="warning" icon={TriangleAlert} title="Future dates are not available">
              Choose today or an earlier date for the start and end of the report.
            </Notice>
          </div>
        ) : null}
      </Section>

      <Section title="Key metrics">
        <RowList>
          <div className="border-b border-line-soft py-4 last:border-b-0">
            <Meter label="Average rest period" valueLabel={`${reportData.averageRestPeriod.toFixed(1)} h`} value={80} />
          </div>
          <div className="border-b border-line-soft py-4 last:border-b-0">
            <Meter
              label="Minimum rest period"
              valueLabel={`${reportData.minimumRestPeriod.toFixed(1)} h`}
              value={100}
              tone="ok"
              note="Above regulatory minimum (9 h)"
            />
          </div>
          <div className="border-b border-line-soft py-4 last:border-b-0">
            <Meter label="Compliance rate" valueLabel="100%" value={100} tone="ok" />
          </div>
        </RowList>
      </Section>

      <Section
        title="Activity log"
        aside={
          <span className="tabular">
            {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
          </span>
        }
      >
        <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filter activity by type">
          {filters.map((filter) => {
            const selected = selectedFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedFilter(filter.value)}
                className={`rounded-md border px-3 py-2.5 text-[14px] font-semibold leading-none ${
                  selected ? 'border-info bg-info-soft text-info' : 'border-line bg-surface text-ink-soft hover:bg-panel'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <RowList>
          {filteredLogs.map((log) => {
            const activityType = activityTypes[log.type];
            const Icon = activityType.icon;
            return (
              <div key={log.date} className="border-b border-line-soft py-3.5 last:border-b-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <Icon size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-ink-faint" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="tabular text-[15px] font-medium text-ink">{log.activity}</p>
                      <p className="tabular text-[13px] text-ink-faint">
                        {log.date}
                        {log.type === 'rest' ? '' : `, ${log.route}, ${activityType.label}`}
                      </p>
                    </div>
                  </div>
                  <Status tone={log.compliant ? 'ok' : 'warning'}>{log.compliant ? 'Compliant' : 'Not compliant'}</Status>
                </div>
                <dl className="mt-2 flex gap-6 pl-[30px] text-[13px]">
                  <div className="flex items-baseline gap-1.5">
                    <dt className="text-ink-faint">Duty hours</dt>
                    <dd className="tabular text-[14px] font-medium text-ink">{log.hours.toFixed(1)} h</dd>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <dt className="text-ink-faint">Rest period</dt>
                    <dd className="tabular text-[14px] font-medium text-ink">{log.rest.toFixed(1)} h</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </RowList>
      </Section>

      <Section title="Regulatory compliance">
        <RowList>
          {regulations.map((item) => (
            <Row key={item.rule} label={item.rule}>
              <Status tone={item.status === 'met' ? 'ok' : 'warning'}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Status>
            </Row>
          ))}
        </RowList>
      </Section>

      <Section>
        <Button onClick={handleGenerateReport} disabled={isGenerating} icon={isGenerating ? undefined : FileText} full>
          {isGenerating ? (
            <>
              <LoaderCircle size={17} strokeWidth={1.75} className="animate-spin" aria-hidden="true" />
              Generating report...
            </>
          ) : (
            'Generate PDF report'
          )}
        </Button>

        <div role="status" aria-live="polite" className={reportReady ? 'mt-3' : undefined}>
          {reportReady ? (
            <Notice tone="ok" icon={CircleCheck} title="Compliance report generated">
              <p>In a production app, this would:</p>
              <ul className="mt-1 list-disc pl-5">
                <li>Generate a detailed PDF report</li>
                <li>Include all regulatory compliance data</li>
                <li>Export to aviation authority format</li>
                <li>Email to flight operations</li>
              </ul>
            </Notice>
          ) : null}
        </div>

        <div className="mt-3">
          <Notice tone="info" icon={Info} title="Important notice">
            This report is generated for compliance tracking purposes only. Only current and past dates are available for selection.
          </Notice>
        </div>
      </Section>
    </div>
  );
}
