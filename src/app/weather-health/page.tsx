'use client';

import { useState } from 'react';
import {
  Bug,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Dumbbell,
  Eye,
  Gauge,
  GlassWater,
  Haze,
  Moon,
  ShieldCheck,
  Stethoscope,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  ThermometerSnowflake,
  ThermometerSun,
  Umbrella,
  Utensils,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import { Meter, Notice, PageHeader, Panel, Row, RowList, Section, Stat, StatGrid, Tape, type TapeSegment, type Tone } from '@/components/ui';

/** Reads a clock time such as "06:45" as hours (6.75). Text that does not start with a clock time gives null. */
function toHour(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})/.exec(time.trim());
  return match ? Number(match[1]) + Number(match[2]) / 60 : null;
}

/** A block of time for the 24-hour tape. A block that crosses midnight is split in two. */
function timeBlock(from: string, to: string, tone: Tone, label: string): TapeSegment[] {
  const start = toHour(from);
  const end = toHour(to);
  if (start === null || end === null) return [];
  if (start <= end) return [{ from: start, to: end, tone, label }];
  return [
    { from: start, to: 24, tone, label },
    { from: 0, to: end, tone, label },
  ];
}

type Condition = 'sunny' | 'partlyCloudy' | 'rain' | 'thunderstorms';

// Each sky condition has one icon and one name, so the forecast never depends on the picture alone.
const conditions: Record<Condition, { label: string; icon: LucideIcon }> = {
  sunny: { label: 'Sunny', icon: Sun },
  partlyCloudy: { label: 'Partly cloudy', icon: CloudSun },
  rain: { label: 'Rain', icon: CloudRain },
  thunderstorms: { label: 'Thunderstorms', icon: CloudLightning },
};

type Advisory = { type: 'info' | 'warning' | 'success'; icon: LucideIcon; title: string; description: string };

type CityWeather = {
  name: string;
  country: string;
  timezone: string;
  currentWeather: {
    temp: number;
    condition: string;
    icon: LucideIcon;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    visibility: number;
    pressure: number;
    uvIndex: number;
    feelsLike: number;
  };
  forecast: { day: string; high: number; low: number; condition: Condition; precipitation: number }[];
  healthAdvisories: Advisory[];
  localInfo: { timeNow: string; sunrise: string; sunset: string; moonPhase: string };
};

type LayoverTip = { icon: LucideIcon; tip: string };

export default function WeatherHealthPage() {
  const [selectedLocation, setSelectedLocation] = useState('destination');
  const [selectedCity, setSelectedCity] = useState('jfk');

  const locations: Record<'jfk' | 'dxb' | 'sin', CityWeather> = {
    jfk: {
      name: 'New York (JFK)',
      country: 'United States',
      timezone: 'EST (UTC-5)',
      currentWeather: {
        temp: 12,
        condition: 'Partly cloudy',
        icon: CloudSun,
        humidity: 65,
        windSpeed: 18,
        windDirection: 'NW',
        visibility: 10,
        pressure: 1013,
        uvIndex: 3,
        feelsLike: 9,
      },
      forecast: [
        { day: 'Today', high: 14, low: 8, condition: 'partlyCloudy', precipitation: 10 },
        { day: 'Tomorrow', high: 16, low: 10, condition: 'sunny', precipitation: 5 },
        { day: 'Sat', high: 13, low: 7, condition: 'rain', precipitation: 80 },
        { day: 'Sun', high: 15, low: 9, condition: 'partlyCloudy', precipitation: 20 },
      ],
      healthAdvisories: [
        {
          type: 'info',
          icon: Stethoscope,
          title: 'Flu activity: moderate',
          description: 'Increased flu cases reported. Consider extra hygiene precautions.',
        },
        {
          type: 'warning',
          icon: ThermometerSnowflake,
          title: 'Cold weather alert',
          description: 'Temperatures dropping. Layer clothing appropriately.',
        },
        {
          type: 'success',
          icon: Wind,
          title: 'Air quality: good',
          description: 'Air quality is satisfactory for outdoor activities.',
        },
      ],
      localInfo: {
        timeNow: '14:32',
        sunrise: '06:45',
        sunset: '17:20',
        moonPhase: 'Waning',
      },
    },
    dxb: {
      name: 'Dubai (DXB)',
      country: 'United Arab Emirates',
      timezone: 'GST (UTC+4)',
      currentWeather: {
        temp: 32,
        condition: 'Sunny',
        icon: Sun,
        humidity: 45,
        windSpeed: 12,
        windDirection: 'NE',
        visibility: 10,
        pressure: 1010,
        uvIndex: 9,
        feelsLike: 35,
      },
      forecast: [
        { day: 'Today', high: 34, low: 24, condition: 'sunny', precipitation: 0 },
        { day: 'Tomorrow', high: 33, low: 25, condition: 'sunny', precipitation: 0 },
        { day: 'Sat', high: 35, low: 26, condition: 'sunny', precipitation: 0 },
        { day: 'Sun', high: 34, low: 25, condition: 'partlyCloudy', precipitation: 5 },
      ],
      healthAdvisories: [
        {
          type: 'warning',
          icon: ThermometerSun,
          title: 'Extreme heat warning',
          description: 'Very high temperatures. Stay hydrated and limit sun exposure.',
        },
        {
          type: 'info',
          icon: Droplets,
          title: 'Dehydration risk: high',
          description: 'Drink plenty of water throughout the day.',
        },
        {
          type: 'success',
          icon: ShieldCheck,
          title: 'COVID-19: low risk',
          description: 'Current infection rates are low in this region.',
        },
      ],
      localInfo: {
        timeNow: '23:32',
        sunrise: '06:30',
        sunset: '17:45',
        moonPhase: 'Waning',
      },
    },
    sin: {
      name: 'Singapore (SIN)',
      country: 'Singapore',
      timezone: 'SGT (UTC+8)',
      currentWeather: {
        temp: 28,
        condition: 'Thunderstorms',
        icon: CloudLightning,
        humidity: 85,
        windSpeed: 15,
        windDirection: 'SW',
        visibility: 7,
        pressure: 1008,
        uvIndex: 6,
        feelsLike: 32,
      },
      forecast: [
        { day: 'Today', high: 30, low: 25, condition: 'thunderstorms', precipitation: 90 },
        { day: 'Tomorrow', high: 31, low: 26, condition: 'rain', precipitation: 70 },
        { day: 'Sat', high: 29, low: 25, condition: 'thunderstorms', precipitation: 85 },
        { day: 'Sun', high: 30, low: 26, condition: 'rain', precipitation: 60 },
      ],
      healthAdvisories: [
        {
          type: 'warning',
          icon: Bug,
          title: 'Dengue alert: elevated',
          description: 'Increased mosquito activity. Use insect repellent.',
        },
        {
          type: 'info',
          icon: Haze,
          title: 'Haze advisory',
          description: 'Air quality may be affected. Monitor PSI levels.',
        },
        {
          type: 'info',
          icon: Umbrella,
          title: 'Monsoon season',
          description: 'Frequent rain expected. Carry an umbrella.',
        },
      ],
      localInfo: {
        timeNow: '03:32',
        sunrise: '07:00',
        sunset: '19:10',
        moonPhase: 'Waning',
      },
    },
  };

  const layoverTips: LayoverTip[] = [
    { icon: GlassWater, tip: 'Stay hydrated: drink water regularly' },
    { icon: Thermometer, tip: 'Adjust room temperature for better sleep' },
    { icon: Dumbbell, tip: 'Light exercise can help combat jet lag' },
    { icon: Utensils, tip: 'Follow local meal times to adjust faster' },
  ];

  const currentLocation = locations[selectedCity as keyof typeof locations];
  const weather = currentLocation.currentWeather;
  const WeatherIcon = weather.icon;

  // Colour carries the status: amber for an advisory to act on, green for a normal reading, teal for information.
  const advisoryTone: Record<Advisory['type'], Tone> = { warning: 'caution', success: 'ok', info: 'info' };

  const uvLabel = weather.uvIndex >= 8 ? 'very high' : weather.uvIndex >= 6 ? 'high' : 'moderate';
  const uvTone: Tone = weather.uvIndex >= 8 ? 'warning' : weather.uvIndex >= 6 ? 'caution' : 'neutral';

  const daylight = timeBlock(currentLocation.localInfo.sunrise, currentLocation.localInfo.sunset, 'info', 'Daylight');

  return (
    <div>
      <PageHeader title="Weather and health" lead="Local conditions and advisories" story={3} />

      <Section title="Location">
        <label htmlFor="location" className="mb-1.5 block text-[14px] text-ink-soft">
          Select location
        </label>
        <select
          id="location"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full rounded-md border border-line bg-surface px-3 py-2.5 text-[15px] text-ink"
        >
          <option value="jfk">New York (JFK)</option>
          <option value="dxb">Dubai (DXB)</option>
          <option value="sin">Singapore (SIN)</option>
        </select>

        <div className="mt-3">
          <Panel>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display text-[22px] font-semibold leading-tight text-ink">{currentLocation.name}</p>
                <p className="text-[14px] text-ink-soft">{currentLocation.country}</p>
                <p className="tabular mt-1 text-[13px] text-ink-faint">{currentLocation.timezone}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[13px] text-ink-soft">Local time</p>
                <p className="tabular mt-1 font-display text-[28px] font-semibold leading-none text-ink">{currentLocation.localInfo.timeNow}</p>
              </div>
            </div>
          </Panel>
        </div>
      </Section>

      <Section title="Current weather">
        <Panel padded={false}>
          <div className="flex items-end justify-between gap-4 p-4">
            <p className="tabular font-display text-[44px] font-semibold leading-none text-ink">{weather.temp}°</p>
            <div className="text-right">
              <p className="flex items-center justify-end gap-2 text-[15px] font-medium text-ink">
                <WeatherIcon size={20} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
                {weather.condition}
              </p>
              <p className="tabular mt-0.5 text-[13px] text-ink-faint">Feels like {weather.feelsLike}°</p>
            </div>
          </div>
          <div className="border-t border-line-soft p-4">
            <Meter label="UV index" valueLabel={`${weather.uvIndex}, ${uvLabel}`} value={weather.uvIndex} max={11} tone={uvTone} />
          </div>
        </Panel>
        <div className="mt-3">
          <StatGrid>
            <Stat label="Humidity" value={weather.humidity} unit="%" icon={Droplets} />
            <Stat label="Wind" value={weather.windSpeed} unit={`km/h ${weather.windDirection}`} icon={Wind} />
            <Stat label="Visibility" value={weather.visibility} unit="km" icon={Eye} />
            <Stat label="Pressure" value={weather.pressure} unit="hPa" icon={Gauge} />
          </StatGrid>
        </div>
      </Section>

      <Section title="4-day forecast" aside="High and low">
        <RowList>
          {currentLocation.forecast.map((day) => {
            const { label, icon: ConditionIcon } = conditions[day.condition];
            return (
              <div key={day.day} className="flex items-center justify-between gap-3 border-b border-line-soft py-3 last:border-b-0">
                <div className="flex min-w-0 items-center gap-3">
                  <ConditionIcon size={20} strokeWidth={1.75} className="shrink-0 text-ink" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium text-ink">{day.day}</p>
                    <p className="tabular text-[13px] text-ink-faint">
                      {label}, precipitation {day.precipitation}%
                    </p>
                  </div>
                </div>
                <p className="tabular shrink-0 text-right text-[15px]">
                  <span className="font-medium text-ink">
                    <span className="sr-only">High </span>
                    {day.high}°
                  </span>
                  <span className="ml-3 text-ink-faint">
                    <span className="sr-only">Low </span>
                    {day.low}°
                  </span>
                </p>
              </div>
            );
          })}
        </RowList>
      </Section>

      <Section title="Sun and moon">
        <Panel padded={false}>
          <div className="p-4">
            <Tape title={`Daylight, ${currentLocation.timezone}`} segments={daylight} now={toHour(currentLocation.localInfo.timeNow) ?? undefined} />
            <p className="tabular mt-2 text-[12.5px] text-ink-faint">The line marks local time now, {currentLocation.localInfo.timeNow}.</p>
          </div>
          <div className="border-t border-line-soft px-4">
            <Row icon={Sunrise} label="Sunrise" value={currentLocation.localInfo.sunrise} />
            <Row icon={Sunset} label="Sunset" value={currentLocation.localInfo.sunset} />
            <Row icon={Moon} label="Moon" value={currentLocation.localInfo.moonPhase} />
          </div>
        </Panel>
      </Section>

      <Section title="Health advisories">
        <div className="grid gap-2.5">
          {currentLocation.healthAdvisories.map((advisory) => (
            <Notice key={advisory.title} tone={advisoryTone[advisory.type]} icon={advisory.icon} title={advisory.title}>
              {advisory.description}
            </Notice>
          ))}
        </div>
      </Section>

      <Section title="Layover tips">
        <RowList>
          {layoverTips.map((item) => (
            <Row key={item.tip} icon={item.icon} label={item.tip} />
          ))}
        </RowList>
      </Section>
    </div>
  );
}
