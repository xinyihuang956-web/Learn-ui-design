import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, Clock, FileText, Eye, MessageSquare, X, User } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType = 'deadline' | 'material' | 'feedback' | 'announcement'
interface Notif { id: string; title: string; course: string; type: NotifType; time: string; route: string }

interface SearchResult { id: string; title: string; type: string; route: string }

// ─── Data ─────────────────────────────────────────────────────────────────────

const NOTIFS: Notif[] = [
  { id: 'n1', title: 'Lab Report 2 is due tomorrow', course: 'BIOL08019',      type: 'deadline',     time: '18h left',  route: '/courses/molecular-biology/assignments/lab-report-2-enzyme-kinetics' },
  { id: 'n2', title: 'New slides uploaded',           course: 'Molecular Biology', type: 'material',  time: '2h ago',    route: '/courses/molecular-biology' },
  { id: 'n3', title: 'Feedback released',             course: 'Design Informatics', type: 'feedback', time: 'Yesterday', route: '/marks' },
  { id: 'n4', title: 'Seminar room changed',          course: 'Sociology',      type: 'announcement', time: '4h ago',    route: '/updates' },
]

const SEARCH_INDEX: SearchResult[] = [
  { id: 's1', title: 'Molecular Biology',             type: 'Course',      route: '/courses/molecular-biology' },
  { id: 's2', title: 'Sociology',                     type: 'Course',      route: '/courses/sociology' },
  { id: 's3', title: 'Marketing',                     type: 'Course',      route: '/courses/marketing' },
  { id: 's4', title: 'Global History',                type: 'Course',      route: '/courses/global-history' },
  { id: 's5', title: 'Design Informatics',            type: 'Course',      route: '/courses/design-informatics' },
  { id: 's6', title: 'Data Science',                  type: 'Course',      route: '/courses/data-science' },
  { id: 's7', title: 'Lab Report 2: Enzyme Kinetics', type: 'Assignment',  route: '/courses/molecular-biology/assignments/lab-report-2-enzyme-kinetics' },
  { id: 's8', title: 'Critical Analysis: Globalisation', type: 'Assignment', route: '/courses/sociology/assignments/critical-analysis-globalisation-culture' },
  { id: 's9', title: 'Schedule',                      type: 'Page',        route: '/schedule' },
  { id: 's10', title: 'Marks',                        type: 'Page',        route: '/marks' },
  { id: 's11', title: 'Course Updates',               type: 'Page',        route: '/updates' },
  { id: 's12', title: 'All Deadlines',                type: 'Page',        route: '/deadlines' },
  { id: 's13', title: 'My Courses',                   type: 'Page',        route: '/courses' },
  { id: 's14', title: 'Settings',                     type: 'Page',        route: '/settings' },
]

const TYPE_ICON: Record<NotifType, React.ReactNode> = {
  deadline:     <Clock size={13} strokeWidth={1.75} />,
  material:     <FileText size={13} strokeWidth={1.75} />,
  feedback:     <Eye size={13} strokeWidth={1.75} />,
  announcement: <MessageSquare size={13} strokeWidth={1.75} />,
}

const TYPE_COLOR: Record<string, string> = {
  Course: '#2563EB', Assignment: '#7C3AED', Page: '#48607A',
}

// ─── Profile modal ────────────────────────────────────────────────────────────

function ProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,79,0.18)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, border: '1px solid #E6ECF3', boxShadow: '0 24px 64px rgba(15,23,42,0.12)', width: '100%', maxWidth: 360, padding: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0A254F' }}>Profile</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E6ECF3', background: '#F9FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7B8DA5' }}>
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#1B3FA0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10 }}>XH</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0A254F' }}>Xinyi Huang</div>
          <div style={{ fontSize: 12, color: '#7B8DA5', marginTop: 2 }}>Design Informatics student</div>
        </div>
        {[
          { label: 'Email',      value: 'xinyi.huang@sms.ed.ac.uk' },
          { label: 'Programme',  value: 'Design Informatics' },
          { label: 'Year',       value: '2024/25' },
          { label: 'Student ID', value: 'S1234567' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #EEF2F7' }}>
            <span style={{ fontSize: 12, color: '#7B8DA5' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#0A254F' }}>{row.value}</span>
          </div>
        ))}
        <button onClick={onClose} style={{ width: '100%', height: 40, borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: 20 }}>
          Close
        </button>
      </div>
    </div>
  )
}

// ─── Dropdown container ───────────────────────────────────────────────────────

function Dropdown({ children, width = 320 }: { children: React.ReactNode; width?: number }) {
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 12px)', right: 0,
      background: '#fff', border: '1px solid #E6ECF3', borderRadius: 14,
      boxShadow: '0 16px 48px rgba(15,23,42,0.14)', zIndex: 80,
      width, overflow: 'hidden',
    }}>
      {children}
    </div>
  )
}

// ─── TopHeader ────────────────────────────────────────────────────────────────

export default function TopHeader() {
  const navigate = useNavigate()
  const [query, setQuery]         = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen]   = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef  = useRef<HTMLDivElement>(null)
  const menuRef   = useRef<HTMLDivElement>(null)

  // Close all dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  setNotifOpen(false)
      if (menuRef.current   && !menuRef.current.contains(e.target as Node))   setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Escape key closes search
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') { setSearchOpen(false); setQuery('') } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const results = query.trim()
    ? SEARCH_INDEX.filter(r => r.title.toLowerCase().includes(query.toLowerCase()))
    : SEARCH_INDEX.slice(0, 6)

  const go = (route: string) => {
    navigate(route)
    setSearchOpen(false); setNotifOpen(false); setMenuOpen(false)
    setQuery('')
  }

  const menuBtnStyle: React.CSSProperties = {
    width: '100%', textAlign: 'left', padding: '10px 16px',
    fontSize: 13, background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center',
  }

  return (
    <>
      <header className="bg-white border-b border-[#E6ECF3] flex items-center justify-between px-8" style={{ height: 72, position: 'relative', zIndex: 40 }}>

        {/* ── Search ── */}
        <div ref={searchRef} className="relative" style={{ width: 380 }}>
          <Search size={16} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B8DA5] pointer-events-none" />
          <input
            type="text"
            placeholder="Search LEARN"
            value={query}
            onChange={e => { setQuery(e.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
            className="w-full h-11 pl-10 pr-9 border border-[#E6ECF3] rounded-[12px] bg-white text-sm text-[#48607A] placeholder-[#7B8DA5] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[rgba(37,99,235,0.12)] transition-all"
          />
          {query && (
            <button onClick={() => { setQuery(''); setSearchOpen(false) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B4C0D0] hover:text-[#7B8DA5]">
              <X size={14} strokeWidth={1.75} />
            </button>
          )}

          {searchOpen && (
            <Dropdown width={380}>
              <div style={{ padding: '10px 14px 6px', fontSize: 11, fontWeight: 700, color: '#7B8DA5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {query.trim() ? 'Results' : 'Quick links'}
              </div>
              {results.length > 0 ? results.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => go(r.route)}
                  style={{ ...menuBtnStyle, borderTop: i > 0 ? '1px solid #EEF2F7' : 'none', justifyContent: 'space-between' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F9FBFF')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0A254F' }}>{r.title}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: TYPE_COLOR[r.type] ?? '#7B8DA5', background: '#F1F5F9', borderRadius: 999, padding: '2px 8px' }}>{r.type}</span>
                </button>
              )) : (
                <div style={{ padding: '12px 14px 14px', fontSize: 13, color: '#7B8DA5', textAlign: 'center' }}>No results found</div>
              )}
            </Dropdown>
          )}
        </div>

        {/* ── Right ── */}
        <div className="flex items-center gap-5" style={{ position: 'relative' }}>

          {/* Bell */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setNotifOpen(p => !p); setMenuOpen(false) }}
              className="relative text-[#48607A] hover:text-[#0A254F] transition-colors"
              style={{ padding: 4 }}
            >
              <Bell size={20} strokeWidth={1.75} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#EF4444] rounded-full" />
            </button>

            {notifOpen && (
              <Dropdown width={340}>
                <div style={{ padding: '14px 16px 12px', fontSize: 14, fontWeight: 700, color: '#0A254F', borderBottom: '1px solid #EEF2F7' }}>
                  Notifications
                </div>
                {NOTIFS.map((n, i) => (
                  <button
                    key={n.id}
                    onClick={() => go(n.route)}
                    style={{ ...menuBtnStyle, borderTop: i > 0 ? '1px solid #EEF2F7' : 'none', gap: 10, alignItems: 'flex-start' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F9FBFF')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: '#EAF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#2563EB' }}>
                      {TYPE_ICON[n.type]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0A254F' }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: '#7B8DA5', marginTop: 2 }}>{n.course} · {n.time}</div>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => go('/updates')}
                  style={{ width: '100%', padding: '10px', fontSize: 12, fontWeight: 600, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', borderTop: '1px solid #EEF2F7' }}
                >
                  View all notifications →
                </button>
              </Dropdown>
            )}
          </div>

          {/* User menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setMenuOpen(p => !p); setNotifOpen(false) }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center rounded-full text-white font-semibold" style={{ width: 36, height: 36, background: '#1B3FA0', fontSize: 12 }}>XH</div>
              <span className="text-sm font-medium text-[#0A254F]">Xinyi Huang</span>
              <ChevronDown size={16} strokeWidth={1.75} className={`text-[#7B8DA5] transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <Dropdown width={220}>
                <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #EEF2F7' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0A254F' }}>Xinyi Huang</div>
                  <div style={{ fontSize: 12, color: '#7B8DA5', marginTop: 2 }}>Design Informatics student</div>
                </div>
                {[
                  { label: 'View profile', icon: <User size={14} strokeWidth={1.75} />, action: () => { setMenuOpen(false); setProfileOpen(true) } },
                  { label: 'Settings',     icon: <Search size={14} strokeWidth={1.75} />, action: () => go('/settings') },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    style={{ ...menuBtnStyle, gap: 10, borderTop: i > 0 ? '1px solid #EEF2F7' : 'none', color: '#0A254F' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F9FBFF')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ color: '#7B8DA5' }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => { setMenuOpen(false); alert('Sign out — prototype action') }}
                  style={{ ...menuBtnStyle, gap: 10, borderTop: '1px solid #EEF2F7', color: '#EF4444' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FFF5F5')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Sign out
                </button>
              </Dropdown>
            )}
          </div>
        </div>
      </header>

      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </>
  )
}
