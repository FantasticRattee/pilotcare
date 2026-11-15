'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, CloudSun, Ellipsis, Gauge, Moon, Plane, type LucideIcon } from 'lucide-react';

type NavItem = { href: string; label: string; icon: LucideIcon };

const mainNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: Gauge },
    { href: '/sleep-schedule', label: 'Sleep', icon: Moon },
    { href: '/circadian-rhythm', label: 'Rhythm', icon: Activity },
    { href: '/weather-health', label: 'Weather', icon: CloudSun },
    { href: '/more', label: 'More', icon: Ellipsis },
];

export default function Navigation() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Header: the product name, nothing else competing with the page below */}
            <header className="fixed left-0 right-0 top-0 z-40">
                <div className="mx-auto flex h-[57px] max-w-md items-center justify-between border-x border-b border-line bg-surface px-5">
                    <Link href="/" className="flex items-center gap-2.5 text-ink" aria-label="PilotCare home">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-white">
                            <Plane size={17} strokeWidth={2} aria-hidden="true" />
                        </span>
                        <span className="font-display text-[19px] font-semibold leading-none tracking-[0.01em]">PilotCare</span>
                    </Link>
                    <span className="text-[13px] text-ink-faint">Health and duty</span>
                </div>
            </header>

            {/* Bottom tabs */}
            <nav className="fixed bottom-0 left-0 right-0 z-50" aria-label="Main">
                <div className="mx-auto max-w-md border-x border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]">
                    <ul className="grid grid-cols-5">
                        {mainNavItems.map(({ href, label, icon: Icon }) => {
                            const active = isActive(href);
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        aria-current={active ? 'page' : undefined}
                                        className={`relative flex flex-col items-center gap-1 px-1 pb-2.5 pt-3 text-[12px] font-medium ${active ? 'text-ink' : 'text-ink-faint hover:text-ink-soft'}`}
                                    >
                                        {/* Magenta marks where you are, as the active route does on a flight display */}
                                        {active ? <span className="absolute left-1/2 top-0 h-[3px] w-9 -translate-x-1/2 rounded-b bg-plan" aria-hidden="true" /> : null}
                                        <Icon size={21} strokeWidth={active ? 2 : 1.75} aria-hidden="true" />
                                        {label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </>
    );
}
