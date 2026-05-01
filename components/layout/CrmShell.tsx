'use client';

import { useMemo, useState } from 'react';
import {
  Bell,
  Briefcase,
  Calendar,
  CheckSquare,
  ChevronRight,
  FileText,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Users,
  UserSquare2,
  X,
  Plus,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '#', icon: LayoutDashboard },
  { label: 'Liidit', href: '#', icon: UserSquare2 },
  { label: 'Asiakkaat', href: '#', icon: Users },
  { label: 'Projektit', href: '#', icon: FolderKanban },
  { label: 'Tarjoukset', href: '#', icon: FileText },
  { label: 'Tehtävät', href: '#', icon: CheckSquare },
  { label: 'Kalenteri', href: '#', icon: Calendar },
  { label: 'Raportit', href: '#', icon: Gauge },
  { label: 'Asetukset', href: '#', icon: Settings },
] as const;

export default function CrmShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const quickActions = useMemo(() => ['Uusi liidi', 'Uusi tarjous', 'Uusi tehtävä'], []);

  return (
    <div className="min-h-screen bg-[#232323] text-neutral-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-[#3f3f46] bg-[#2b2b2b] lg:block">
          <div className="sticky top-0 flex h-screen flex-col px-5 py-6">
            <div className="mb-6 flex items-center gap-3 border-b border-[#3f3f46] pb-4">
              <div className="rounded-lg bg-[#b66e3f]/20 p-2 text-[#d99162]">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">CRM</p>
                <p className="font-semibold">EKI Pro</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-300 transition hover:bg-[#343434] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 border-b border-[#3f3f46] bg-[#2b2b2b]/95 backdrop-blur">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-5 md:px-6 lg:px-8">
              <button
                type="button"
                className="rounded-md border border-[#4b4b52] p-2 text-neutral-300 lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Avaa valikko"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span>CRM</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>Dashboard</span>
                </div>
                <h1 className="truncate text-base font-semibold sm:text-lg">Dashboard</h1>
              </div>

              <div className="hidden flex-1 lg:block">
                <label className="flex h-10 items-center gap-2 rounded-lg border border-[#4b4b52] bg-[#343434] px-3">
                  <Search className="h-4 w-4 text-neutral-400" />
                  <input
                    className="w-full bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-500"
                    placeholder="Globaali haku..."
                  />
                </label>
              </div>

              <div className="hidden items-center gap-2 md:flex">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="rounded-md border border-[#4b4b52] px-3 py-1.5 text-xs text-neutral-200 hover:bg-[#343434]"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <button type="button" className="rounded-md border border-[#4b4b52] p-2 text-neutral-300">
                <Bell className="h-4 w-4" />
              </button>
              <button type="button" className="flex items-center gap-2 rounded-md border border-[#4b4b52] px-2 py-1.5">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-[#b66e3f]/30 text-xs font-semibold text-[#f4c7a5]">
                  EP
                </div>
                <span className="hidden text-sm text-neutral-200 sm:inline">Profiili</span>
              </button>
            </div>

            <div className="border-t border-[#3f3f46] px-4 py-3 sm:px-5 md:px-6 lg:hidden">
              <label className="flex h-10 items-center gap-2 rounded-lg border border-[#4b4b52] bg-[#343434] px-3">
                <Search className="h-4 w-4 text-neutral-400" />
                <input
                  className="w-full bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-500"
                  placeholder="Globaali haku..."
                />
              </label>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 pb-24 sm:px-5 md:px-6 md:py-6 lg:px-8 lg:pb-8">{children}</main>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/45" onClick={() => setMobileMenuOpen(false)} aria-label="Sulje valikko" />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-[#3f3f46] bg-[#2b2b2b] px-4 py-5">
            <div className="mb-4 flex items-center justify-between border-b border-[#3f3f46] pb-3">
              <p className="font-semibold">Navigaatio</p>
              <button onClick={() => setMobileMenuOpen(false)} className="rounded-md border border-[#4b4b52] p-1.5">
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-300 hover:bg-[#343434] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#3f3f46] bg-[#2b2b2b]/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.label} href={item.href} className="flex flex-col items-center rounded-md px-2 py-1.5 text-[11px] text-neutral-300">
                <Icon className="mb-1 h-4 w-4" />
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      <button
        type="button"
        className="fixed bottom-20 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-[#b66e3f] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-black/30 transition hover:brightness-110 lg:hidden"
      >
        <Plus className="h-4 w-4" />
        <Sparkles className="h-4 w-4" />
        Uusi liidi
      </button>
    </div>
  );
}
