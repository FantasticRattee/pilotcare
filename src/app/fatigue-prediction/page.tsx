'use client';

import { useState } from 'react';
import { BedDouble, CircleCheck, Coffee, Footprints, Lightbulb, LoaderCircle, RefreshCw, Salad, TriangleAlert, type LucideIcon } from 'lucide-react';
import { Button, Meter, Notice, PageHeader, Panel, Row, RowList, Section, Status, type Tone } from '@/components/ui';

type Recommendation = { icon: LucideIcon; title: string; description: string; priority: string };

export default function FatiguePrediction() {
  const [analyzing, setAnalyzing] = useState(false);

  const fatigueAnalysis = {
    overallRisk: 'Medium',
    riskScore: 65,
    factors: [
      { name: 'Sleep quality', value: 72, status: 'warning', impact: 'Medium' },
      { name: 'Flight schedule density', value: 68, status: 'warning', impact: 'Medium' },
      { name: 'Recovery time', value: 58, status: 'danger', impact: 'High' },
      { name: 'Circadian rhythm alignment', value: 75, status: 'good', impact: 'Low' },
      { name: 'Recent rest periods', value: 62, status: 'warning', impact: 'Medium' },
    ],
  };

  const predictions = [
    {
      date: '2025-10-19',
      flight: 'BA124 JFK-LHR',
      predictedFatigue: 68,
      riskLevel: 'Medium',
      confidence: 87,
      recommendation: 'Schedule adequate rest before flight',
    },
    {
      date: '2025-10-21',
      flight: 'BA456 LHR-DXB',
      predictedFatigue: 72,
      riskLevel: 'Medium-High',
      confidence: 82,
      recommendation: 'Consider extended rest period',
    },
    {
      date: '2025-10-23',
      flight: 'BA789 DXB-SYD',
      predictedFatigue: 78,
      riskLevel: 'High',
      confidence: 79,
      recommendation: 'Strongly recommend additional rest',
    },
  ];

  const recommendations: Recommendation[] = [
    {
      icon: BedDouble,
      title: 'Optimize sleep schedule',
      description: 'Get 8-9 hours of quality sleep before your next flight. Consider going to bed at 22:00.',
      priority: 'High',
    },
    {
      icon: Footprints,
      title: 'Light exercise',
      description: 'Engage in 20-30 minutes of light exercise to improve recovery and reduce fatigue.',
      priority: 'Medium',
    },
    {
      icon: Salad,
      title: 'Nutrition and hydration',
      description: 'Maintain proper hydration and avoid heavy meals 3 hours before duty.',
      priority: 'Medium',
    },
    {
      icon: Coffee,
      title: 'Strategic caffeine use',
      description: 'Limit caffeine intake to morning hours. Avoid 6 hours before planned sleep.',
      priority: 'Low',
    },
  ];

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 2000);
  };

  // Colour carries the status: red for high risk, amber for medium, green for low.
  const riskTone = (level: string): Tone => (level === 'High' ? 'warning' : level.includes('Medium') ? 'caution' : 'ok');
  const factorTone: Record<string, Tone> = { good: 'ok', warning: 'caution', danger: 'warning' };
  // Only the high-priority advice is flagged; the rest stays neutral.
  const priorityTone = (priority: string): Tone => (priority === 'High' ? 'caution' : 'neutral');

  const overallTone = riskTone(fatigueAnalysis.overallRisk);

  return (
    <div>
      <PageHeader title="AI fatigue prediction" lead="AI-powered fatigue risk prediction based on your schedule and sleep patterns" story={12} />

      {/* The answer first: the overall risk, then the score behind it */}
      <Section>
        <Notice tone={overallTone} icon={overallTone === 'ok' ? CircleCheck : TriangleAlert} title={`Overall fatigue risk: ${fatigueAnalysis.overallRisk}`}>
          Based on AI analysis of your data
        </Notice>
        <div className="mt-3">
          <Panel>
            <p className="text-[13px] text-ink-soft">Risk score</p>
            <p className="tabular mt-1.5 font-display text-[44px] font-semibold leading-none text-ink">
              {fatigueAnalysis.riskScore}
              <span className="ml-1 text-[18px] font-medium text-ink-faint">/100</span>
            </p>
            <div className="mt-4">
              <Meter value={fatigueAnalysis.riskScore} tone={overallTone} label="Risk level" valueLabel={fatigueAnalysis.overallRisk} />
            </div>
            <div className="mt-4">
              <Button variant="secondary" onClick={handleAnalyze} disabled={analyzing} icon={analyzing ? undefined : RefreshCw} full>
                {analyzing ? (
                  <>
                    <LoaderCircle size={17} strokeWidth={2} className="animate-spin" aria-hidden="true" />
                    Analyzing...
                  </>
                ) : (
                  'Re-analyze'
                )}
              </Button>
            </div>
          </Panel>
        </div>
      </Section>

      <Section title="Risk factors analysis">
        <RowList>
          {fatigueAnalysis.factors.map((factor) => {
            const tone = factorTone[factor.status] ?? 'neutral';
            return (
              <div key={factor.name} className="border-b border-line-soft py-3.5 last:border-b-0">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="min-w-0 text-[15px] text-ink">{factor.name}</p>
                  <Status tone={tone}>{factor.impact} impact</Status>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Meter value={factor.value} tone={tone} />
                  </div>
                  <span className="tabular w-10 shrink-0 text-right text-[14px] font-medium text-ink">{factor.value}%</span>
                </div>
              </div>
            );
          })}
        </RowList>
      </Section>

      <Section title="Upcoming flight predictions">
        <RowList>
          {predictions.map((prediction) => (
            <div key={`${prediction.date}-${prediction.flight}`} className="border-b border-line-soft py-3.5 last:border-b-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="tabular text-[15px] font-medium text-ink">{prediction.flight}</p>
                  <p className="tabular text-[13px] text-ink-faint">{prediction.date}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="tabular font-display text-[26px] font-semibold leading-none text-ink">{prediction.predictedFatigue}</p>
                  <p className="mt-1 text-[12.5px] text-ink-faint">Fatigue score</p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between gap-3">
                <Status tone={riskTone(prediction.riskLevel)}>{prediction.riskLevel} risk</Status>
                <p className="tabular text-[13px] text-ink-faint">{prediction.confidence}% confidence</p>
              </div>
              <p className="mt-2.5 flex items-start gap-2 text-[14px] text-ink-soft">
                <Lightbulb size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-ink-faint" aria-hidden="true" />
                {prediction.recommendation}
              </p>
            </div>
          ))}
        </RowList>
      </Section>

      <Section title="AI-powered recommendations">
        <RowList>
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <div key={rec.title} className="flex items-start gap-3 border-b border-line-soft py-3.5 last:border-b-0">
                <Icon size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-ink-faint" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[15px] font-medium text-ink">{rec.title}</p>
                    <Status tone={priorityTone(rec.priority)}>{rec.priority} priority</Status>
                  </div>
                  <p className="mt-1 text-[14px] text-ink-soft">{rec.description}</p>
                </div>
              </div>
            );
          })}
        </RowList>
      </Section>

      <Section title="AI model information">
        <RowList>
          <Row label="Model version" value="FatiguePredict v2.1.0" />
          <Row label="Training data" value="10,000+ pilot records" />
          <Row label="Accuracy rate" value="89.3% prediction accuracy" />
        </RowList>
        <p className="mt-3 text-[14px] text-ink-soft">
          Our AI analyzes your sleep patterns, duty schedule, recovery time, and circadian rhythm to provide personalized fatigue predictions. The model
          continuously learns and improves with more data.
        </p>
      </Section>
    </div>
  );
}
