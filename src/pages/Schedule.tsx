import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, ChevronDown, Plus, X, Check,
  BookOpen, AlertCircle, User, Users, ClipboardList, MessageSquare,
  MapPin, Clock,
} from 'lucide-react'
import MiniCalendarShared from '../components/MiniCalendar'
import DailyAgendaShared from '../components/DailyAgenda'
import type { DailyAgendaItem as SharedAgendaItem } from '../components/DailyAgenda'
import Toast from '../components/Toast'

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = 'Day' | 'Week' | 'Month'
type EventType = 'Class' | 'Deadline' | 'Personal' | 'Meeting' | 'Task' | 'Seminar' | 'Workshop'

interface TEvent {
  id: string
  day: number   // 0 = Mon 13, …, 6 = Sun 19; -1 = outside current week
  title: string
  location: string
  type: EventType
  startH: number
  startM: number
  endH: number
  endM: number
  route?: string
}

interface AgendaItem {
  id: string
  time: string
  title: string
  location: string
  type: EventType
  route?: string
}

interface FormState {
  title: string
  type: EventType
  date: string
  startTime: string
  endTime: string
  source: string
  location: string
  addToAgenda: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const HOUR_HEIGHT = 72
const START_HOUR = 8
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

const DAYS = [
  { name: 'Mon', date: 13 },
  { name: 'Tue', date: 14 },
  { name: 'Wed', date: 15 },
  { name: 'Thu', date: 16 },
  { name: 'Fri', date: 17 },
  { name: 'Sat', date: 18 },
  { name: 'Sun', date: 19 },
]

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const TYPE_STYLES: Record<EventType, { bg: string; border: string; text: string }> = {
  Class:    { bg: '#EAF2FF', border: '#93C5FD', text: '#2563EB' },
  Deadline: { bg: '#FFECEC', border: '#FDA4AF', text: '#EF4444' },
  Personal: { bg: '#EAF8F0', border: '#86EFAC', text: '#1F9D55' },
  Meeting:  { bg: '#FFF3E6', border: '#FDBA74', text: '#F97316' },
  Task:     { bg: '#FFF3E6', border: '#FDBA74', text: '#F97316' },
  Seminar:  { bg: '#F3E8FF', border: '#C4B5FD', text: '#7C3AED' },
  Workshop: { bg: '#F3E8FF', border: '#C4B5FD', text: '#7C3AED' },
}

const TYPE_OPTIONS: { label: string; value: EventType }[] = [
  { label: 'Class',              value: 'Class'    },
  { label: 'Deadline',           value: 'Deadline' },
  { label: 'Personal',           value: 'Personal' },
  { label: 'Meeting',            value: 'Meeting'  },
  { label: 'Seminar / Workshop', value: 'Seminar'  },
  { label: 'Task',               value: 'Task'     },
]

const LEGEND: { label: string; color: string; types: EventType[] }[] = [
  { label: 'All',                  color: '#94A3B8', types: [] },
  { label: 'Classes',              color: '#2563EB', types: ['Class'] },
  { label: 'Deadlines',            color: '#EF4444', types: ['Deadline'] },
  { label: 'Personal',             color: '#1F9D55', types: ['Personal', 'Task'] },
  { label: 'Meetings',             color: '#F97316', types: ['Meeting'] },
  { label: 'Seminars / Workshops', color: '#7C3AED', types: ['Seminar', 'Workshop'] },
]

const INITIAL_EVENTS: TEvent[] = [
  { id: 'm1',  day: 0, title: 'Molecular Biology Lecture',  location: 'David Hume 2.12',    type: 'Class',    startH: 9,  startM: 0,  endH: 10, endM: 0,  route: '/courses/molecular-biology' },
  { id: 'm2',  day: 0, title: 'Sociology Seminar',          location: 'Appleton Tower 1.05', type: 'Seminar',  startH: 11, startM: 0,  endH: 12, endM: 0,  route: '/courses/sociology' },
  { id: 'm3',  day: 0, title: 'Review seminar notes',       location: '',                    type: 'Task',     startH: 15, startM: 0,  endH: 16, endM: 0  },
  { id: 't1',  day: 1, title: 'Marketing Group Meeting',    location: 'Online',              type: 'Meeting',  startH: 13, startM: 0,  endH: 14, endM: 30 },
  { id: 't2',  day: 1, title: 'Personal gym session',       location: 'Pleasance Gym',       type: 'Personal', startH: 17, startM: 30, endH: 18, endM: 30 },
  { id: 'w1',  day: 2, title: 'Molecular Biology Lecture',  location: 'David Hume 2.12',     type: 'Class',    startH: 9,  startM: 0,  endH: 10, endM: 0,  route: '/courses/molecular-biology' },
  { id: 'w2',  day: 2, title: 'Lab Report Deadline',        location: 'LEARN Assignment',    type: 'Deadline', startH: 14, startM: 0,  endH: 14, endM: 30, route: '/courses/molecular-biology/assignments/lab-report-2-enzyme-kinetics' },
  { id: 'th1', day: 3, title: 'Project Workshop',           location: 'George Square G.03',  type: 'Workshop', startH: 10, startM: 0,  endH: 12, endM: 0  },
  { id: 'th2', day: 3, title: 'Sociology Seminar',          location: 'Appleton Tower 1.05', type: 'Seminar',  startH: 15, startM: 0,  endH: 16, endM: 0,  route: '/courses/sociology' },
  { id: 'f1',  day: 4, title: 'Library return',             location: 'Main Library',        type: 'Personal', startH: 11, startM: 0,  endH: 11, endM: 30 },
  { id: 'f2',  day: 4, title: 'Molecular Biology Tutorial', location: 'David Hume 1.11',     type: 'Class',    startH: 14, startM: 0,  endH: 15, endM: 0,  route: '/courses/molecular-biology' },
  { id: 'f3',  day: 4, title: 'Marketing Group Meeting',    location: 'Online',              type: 'Meeting',  startH: 16, startM: 30, endH: 17, endM: 30 },
  { id: 'su1', day: 6, title: 'Personal gym session',       location: 'Pleasance Gym',       type: 'Personal', startH: 18, startM: 0,  endH: 19, endM: 0  },
]

const AGENDA_BY_DAY: Record<number, AgendaItem[]> = {
  13: [
    { id: 'ag-m1', time: '09:00–10:00', title: 'Molecular Biology Lecture', location: 'David Hume 2.12',    type: 'Class',   route: '/courses/molecular-biology' },
    { id: 'ag-m2', time: '11:00–12:00', title: 'Sociology Seminar',         location: 'Appleton Tower 1.05', type: 'Seminar', route: '/courses/sociology' },
    { id: 'ag-m3', time: '15:00–16:00', title: 'Review seminar notes',      location: '',                    type: 'Task' },
  ],
  14: [
    { id: 'ag-t1', time: '13:00–14:30', title: 'Marketing Group Meeting', location: 'Online',         type: 'Meeting'  },
    { id: 'ag-t2', time: '17:30–18:30', title: 'Personal gym session',    location: 'Pleasance Gym',  type: 'Personal' },
  ],
  15: [
    { id: 'ag-w1', time: '09:00–10:00', title: 'Molecular Biology Lecture', location: 'David Hume 2.12',    type: 'Class',    route: '/courses/molecular-biology' },
    { id: 'ag-w2', time: '14:00',       title: 'Lab Report Deadline',       location: 'LEARN Assignment',    type: 'Deadline', route: '/courses/molecular-biology/assignments/lab-report-2-enzyme-kinetics' },
    { id: 'ag-w3', time: '15:00–16:00', title: 'Sociology Seminar',         location: 'Appleton Tower 1.05', type: 'Seminar',  route: '/courses/sociology' },
    { id: 'ag-w4', time: '17:30–18:30', title: 'Personal gym session',      location: 'Pleasance Gym',       type: 'Personal' },
  ],
  16: [
    { id: 'ag-th1', time: '10:00–12:00', title: 'Project Workshop',    location: 'George Square G.03',  type: 'Workshop' },
    { id: 'ag-th2', time: '15:00–16:00', title: 'Sociology Seminar',   location: 'Appleton Tower 1.05', type: 'Seminar', route: '/courses/sociology' },
  ],
  17: [
    { id: 'ag-f1', time: '11:00–11:30', title: 'Library return',             location: 'Main Library',    type: 'Personal' },
    { id: 'ag-f2', time: '14:00–15:00', title: 'Molecular Biology Tutorial', location: 'David Hume 1.11', type: 'Class',   route: '/courses/molecular-biology' },
    { id: 'ag-f3', time: '16:30–17:30', title: 'Marketing Group Meeting',    location: 'Online',          type: 'Meeting'  },
  ],
  19: [
    { id: 'ag-su1', time: '18:00–19:00', title: 'Personal gym session', location: 'Pleasance Gym', type: 'Personal' },
  ],
}

// ─── Schedule mini-calendar data ─────────────────────────────────────────────

function buildWeeks(startOffset: number, daysInMonth: number): (number | null)[][] {
  const flat: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) flat.push(null)
  for (let d = 1; d <= daysInMonth; d++) flat.push(d)
  while (flat.length % 7 !== 0) flat.push(null)
  const weeks: (number | null)[][] = []
  for (let i = 0; i < flat.length; i += 7) weeks.push(flat.slice(i, i + 7))
  return weeks
}

const SCHEDULE_CAL_WEEKS = buildWeeks(2, 31)
const SCHEDULE_CAL_DOTS: Record<number, string> = {
  13: '#2563EB', 14: '#F97316', 15: '#2563EB',
  16: '#EF4444', 17: '#1F9D55',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtHour(h: number) {
  if (h === 12) return '12 PM'
  return h > 12 ? `${h - 12} PM` : `${h} AM`
}

function fmtHM(h: number, m: number) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function topPx(h: number, m: number) {
  return ((h - START_HOUR) + m / 60) * HOUR_HEIGHT
}

function heightPx(sH: number, sM: number, eH: number, eM: number) {
  return Math.max(((eH + eM / 60) - (sH + sM / 60)) * HOUR_HEIGHT, 36)
}

function parseHM(t: string): { h: number; m: number } {
  const [h, m] = t.split(':').map(Number)
  return { h: h || 0, m: m || 0 }
}

function dateToDay(dateStr: string): number {
  if (!dateStr) return -1
  const d = new Date(dateStr + 'T00:00:00')
  if (d.getMonth() !== 4) return -1
  const n = d.getDate()
  return n >= 13 && n <= 19 ? n - 13 : -1
}

function genId() {
  return `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function toSharedItems(items: AgendaItem[]): SharedAgendaItem[] {
  return items.map(item => ({
    id: item.id,
    time: item.time,
    title: item.title,
    subtitle: item.location,
    category: item.type as SharedAgendaItem['category'],
    route: item.route,
  }))
}

// ─── EIcon ────────────────────────────────────────────────────────────────────

function EIcon({ type, size = 14 }: { type: EventType; size?: number }) {
  const p = { size, strokeWidth: 1.75 } as const
  if (type === 'Class')    return <BookOpen {...p} />
  if (type === 'Deadline') return <AlertCircle {...p} />
  if (type === 'Personal') return <User {...p} />
  if (type === 'Meeting')  return <Users {...p} />
  if (type === 'Task')     return <ClipboardList {...p} />
  if (type === 'Seminar')  return <MessageSquare {...p} />
  return <BookOpen {...p} />
}

// ─── EventDetailModal ─────────────────────────────────────────────────────────

function EventDetailModal({ ev, onClose }: { ev: TEvent; onClose: () => void }) {
  const s = TYPE_STYLES[ev.type]
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,79,0.18)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, border: '1px solid #E6ECF3', boxShadow: '0 24px 64px rgba(15,23,42,0.12)', width: '100%', maxWidth: 360, padding: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: s.text }}><EIcon type={ev.type} size={18} /></span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: s.text, background: s.bg, borderRadius: 999, padding: '3px 10px', border: `1px solid ${s.border}` }}>
              {ev.type}
            </span>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E6ECF3', background: '#F9FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7B8DA5' }}>
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0A254F', marginBottom: 16 }}>{ev.title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={14} strokeWidth={1.75} color="#7B8DA5" />
            <span style={{ fontSize: 13, color: '#48607A' }}>{fmtHM(ev.startH, ev.startM)} – {fmtHM(ev.endH, ev.endM)}</span>
          </div>
          {ev.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin size={14} strokeWidth={1.75} color="#7B8DA5" />
              <span style={{ fontSize: 13, color: '#48607A' }}>{ev.location}</span>
            </div>
          )}
        </div>
        <button onClick={onClose} style={{ width: '100%', height: 40, borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  )
}

// ─── AgendaItemDetailModal ────────────────────────────────────────────────────

function AgendaItemDetailModal({ item, onClose }: { item: AgendaItem; onClose: () => void }) {
  const s = TYPE_STYLES[item.type]
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,79,0.18)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, border: '1px solid #E6ECF3', boxShadow: '0 24px 64px rgba(15,23,42,0.12)', width: '100%', maxWidth: 360, padding: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: s.text }}><EIcon type={item.type} size={18} /></span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: s.text, background: s.bg, borderRadius: 999, padding: '3px 10px', border: `1px solid ${s.border}` }}>
              {item.type}
            </span>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E6ECF3', background: '#F9FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7B8DA5' }}>
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0A254F', marginBottom: 16 }}>{item.title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={14} strokeWidth={1.75} color="#7B8DA5" />
            <span style={{ fontSize: 13, color: '#48607A' }}>{item.time}</span>
          </div>
          {item.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin size={14} strokeWidth={1.75} color="#7B8DA5" />
              <span style={{ fontSize: 13, color: '#48607A' }}>{item.location}</span>
            </div>
          )}
        </div>
        <button onClick={onClose} style={{ width: '100%', height: 40, borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  )
}

// ─── EventCard ────────────────────────────────────────────────────────────────

function EventCard({ ev, onNavigate, onOpen }: { ev: TEvent; onNavigate?: (r: string) => void; onOpen?: (ev: TEvent) => void }) {
  const s = TYPE_STYLES[ev.type]
  const t = topPx(ev.startH, ev.startM)
  const h = heightPx(ev.startH, ev.startM, ev.endH, ev.endM)
  const compact = h < 52

  function handleClick() {
    if (ev.route && onNavigate) onNavigate(ev.route)
    else if (onOpen) onOpen(ev)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute', top: t, height: h, left: 3, right: 3,
        background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10,
        padding: compact ? '4px 8px' : '8px 10px',
        overflow: 'hidden', zIndex: 1,
        cursor: 'pointer',
        transition: 'opacity 0.1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
        <span style={{ color: s.text, flexShrink: 0, marginTop: 1 }}>
          <EIcon type={ev.type} size={12} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: s.text, lineHeight: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {ev.title}
          </div>
          {!compact && ev.location && (
            <div style={{ fontSize: 10, color: s.text, opacity: 0.75, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ev.location}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Timetable ────────────────────────────────────────────────────────────────

function Timetable({ events, selectedCalDate, onNavigate, onOpen }: { events: TEvent[]; selectedCalDate: number; onNavigate?: (r: string) => void; onOpen?: (ev: TEvent) => void }) {
  const totalH = HOURS.length * HOUR_HEIGHT

  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '56px repeat(7, minmax(0,1fr))', borderBottom: '1px solid #E6ECF3' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '10px 8px 12px 0', fontSize: 10, color: '#7B8DA5', fontWeight: 600, letterSpacing: '0.04em' }}>
          GMT+1
        </div>
        {DAYS.map((d) => {
          const sel = d.date === selectedCalDate
          return (
            <div key={d.name} style={{ padding: '10px 4px 12px', textAlign: 'center', borderLeft: '1px solid #E6ECF3' }}>
              <div style={{ fontSize: 10, color: '#7B8DA5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                {d.name}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: sel ? '#1B3FA0' : 'transparent', color: sel ? '#fff' : '#0A254F', fontSize: 14, fontWeight: sel ? 700 : 500 }}>
                {d.date}
              </div>
              <div style={{ fontSize: 10, color: '#7B8DA5', marginTop: 3 }}>May</div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ width: 56, flexShrink: 0 }}>
          {HOURS.map(h => (
            <div key={h} style={{ height: HOUR_HEIGHT, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: 8, paddingTop: 6, fontSize: 11, color: '#7B8DA5', fontWeight: 500 }}>
              {fmtHour(h)}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, position: 'relative', borderLeft: '1px solid #E6ECF3' }}>
          {HOURS.map((_, i) => (
            <div key={i} style={{ position: 'absolute', top: i * HOUR_HEIGHT, left: 0, right: 0, height: 1, background: i === 0 ? '#E6ECF3' : '#EEF2F7' }} />
          ))}
          <div style={{ position: 'absolute', top: totalH, left: 0, right: 0, height: 1, background: '#E6ECF3' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0,1fr))', height: totalH }}>
            {DAYS.map((d, di) => (
              <div key={d.name} style={{ position: 'relative', borderRight: di < 6 ? '1px solid #E6ECF3' : 'none' }}>
                {events.filter(e => e.day === di).map(ev => (
                  <EventCard key={ev.id} ev={ev} onNavigate={onNavigate} onOpen={onOpen} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── DayView ──────────────────────────────────────────────────────────────────

function DayView({ events, selectedCalDate, onNavigate, onOpen }: { events: TEvent[]; selectedCalDate: number; onNavigate: (r: string) => void; onOpen: (ev: TEvent) => void }) {
  const dayIdx = selectedCalDate >= 13 && selectedCalDate <= 19 ? selectedCalDate - 13 : 2
  const dayName = DAY_NAMES[dayIdx]
  const dayEvents = events.filter(e => e.day === dayIdx).sort((a, b) => a.startH * 60 + a.startM - (b.startH * 60 + b.startM))

  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '24px' }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: '#0A254F', marginBottom: 20 }}>{dayName}, {selectedCalDate} May</div>

      {dayEvents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#B4C0D0', fontSize: 14 }}>No events for this day.</div>
      ) : (
        dayEvents.map((ev, i) => {
          const s = TYPE_STYLES[ev.type]
          return (
            <div
              key={ev.id}
              onClick={() => ev.route ? onNavigate(ev.route) : onOpen(ev)}
              style={{ display: 'flex', gap: 16, padding: '14px 12px', borderRadius: 10, cursor: 'pointer', transition: 'background 0.12s', borderBottom: i < dayEvents.length - 1 ? '1px solid #EEF2F7' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F9FBFF')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 90, flexShrink: 0, fontSize: 12, color: '#7B8DA5', fontWeight: 500, paddingTop: 2 }}>
                {fmtHM(ev.startH, ev.startM)} – {fmtHM(ev.endH, ev.endM)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: s.text }}><EIcon type={ev.type} size={12} /></span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: s.text, background: s.bg, borderRadius: 999, padding: '2px 8px', border: `1px solid ${s.border}` }}>{ev.type}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0A254F' }}>{ev.title}</div>
                {ev.location && <div style={{ fontSize: 12, color: '#7B8DA5', marginTop: 3 }}>{ev.location}</div>}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

// ─── MonthView ────────────────────────────────────────────────────────────────

const MONTH_WEEKS = buildWeeks(2, 31) // May 2024 starts Wednesday (offset 2)

function MonthView({ events, selectedCalDate }: { events: TEvent[]; selectedCalDate: number }) {
  const eventsByDay: Record<number, TEvent[]> = {}
  events.forEach(ev => {
    if (ev.day < 0) return
    if (!eventsByDay[ev.day]) eventsByDay[ev.day] = []
    eventsByDay[ev.day].push(ev)
  })

  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, boxShadow: '0 8px 24px rgba(15,23,42,0.04)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #E6ECF3' }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} style={{ padding: '12px 0', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#7B8DA5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {d}
          </div>
        ))}
      </div>

      {MONTH_WEEKS.map((week, wi) => (
        <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: wi < MONTH_WEEKS.length - 1 ? '1px solid #EEF2F7' : 'none' }}>
          {week.map((date, di) => {
            const dayIdx = date ? date - 13 : -1
            const dayEvs = dayIdx >= 0 && dayIdx <= 6 ? eventsByDay[dayIdx] || [] : []
            const isSel = date === selectedCalDate
            return (
              <div key={di} style={{ padding: 8, minHeight: 80, borderRight: di < 6 ? '1px solid #EEF2F7' : 'none', background: date ? '#fff' : '#FAFBFC' }}>
                {date && (
                  <>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: '50%', background: isSel ? '#1B3FA0' : 'transparent', color: isSel ? '#fff' : '#0A254F', fontSize: 13, fontWeight: isSel ? 700 : 400, marginBottom: 4 }}>
                      {date}
                    </div>
                    {dayEvs.slice(0, 2).map(ev => {
                      const s = TYPE_STYLES[ev.type]
                      return (
                        <div key={ev.id} style={{ fontSize: 10, fontWeight: 600, color: s.text, background: s.bg, borderRadius: 4, padding: '2px 5px', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ev.title}
                        </div>
                      )
                    })}
                    {dayEvs.length > 2 && (
                      <div style={{ fontSize: 10, color: '#7B8DA5' }}>+{dayEvs.length - 2} more</div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ─── FilterCard ───────────────────────────────────────────────────────────────

function FilterCard({ activeFilter, onFilterChange }: { activeFilter: string; onFilterChange: (label: string) => void }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, padding: '20px', boxShadow: '0 8px 24px rgba(15,23,42,0.04)' }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0A254F', marginBottom: 14 }}>Filter / Legend</div>
      {LEGEND.map((l, i) => {
        const active = activeFilter === l.label
        return (
          <div
            key={i}
            onClick={() => onFilterChange(l.label)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 8, cursor: 'pointer', background: active ? '#F0F4FF' : 'transparent', transition: 'background 0.12s' }}
          >
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, color: active ? '#1B3FA0' : '#48607A', fontWeight: active ? 700 : 500 }}>{l.label}</span>
            {active && <Check size={13} strokeWidth={2.5} color="#1B3FA0" />}
          </div>
        )
      })}
    </div>
  )
}

// ─── AddItemModal ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', height: 40, borderRadius: 10,
  border: '1px solid #E6ECF3', background: '#F9FBFF',
  padding: '0 12px', fontSize: 13, color: '#0A254F',
  outline: 'none', boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: '#48607A', marginBottom: 6,
}

const errorStyle: React.CSSProperties = {
  fontSize: 11, color: '#EF4444', marginTop: 4,
}

type Errors = Partial<Record<keyof FormState, string>>

interface ModalProps {
  defaultDate: number
  onClose: () => void
  onAdd: (ev: TEvent, dateStr: string, startTime: string, endTime: string, addToAgenda: boolean) => void
}

function AddItemModal({ defaultDate, onClose, onAdd }: ModalProps) {
  const dateStr = `2024-05-${String(defaultDate).padStart(2, '0')}`
  const [form, setForm] = useState<FormState>({
    title: '', type: 'Class', date: dateStr,
    startTime: '10:00', endTime: '11:00',
    source: '', location: '', addToAgenda: true,
  })
  const [errors, setErrors] = useState<Errors>({})

  function setField<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function handleSubmit() {
    const errs: Errors = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.date) errs.date = 'Date is required'
    if (!form.startTime) errs.startTime = 'Start time is required'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const start = parseHM(form.startTime)
    const end = form.endTime ? parseHM(form.endTime) : { h: start.h + 1, m: start.m }
    const day = dateToDay(form.date)

    const newEvent: TEvent = {
      id: genId(), day, title: form.title.trim(),
      location: form.location.trim(), type: form.type,
      startH: start.h, startM: start.m, endH: end.h, endM: end.m,
    }

    onAdd(newEvent, form.date, form.startTime, form.endTime, form.addToAgenda)
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(27, 63, 160, 0.18)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, border: '1px solid #E6ECF3', boxShadow: '0 24px 64px rgba(15,23,42,0.10)', width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid #EEF2F7' }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#0A254F' }}>Add schedule item</span>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E6ECF3', background: '#F9FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7B8DA5', cursor: 'pointer' }}>
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Title <span style={{ color: '#EF4444' }}>*</span></label>
            <input
              style={{ ...inputStyle, borderColor: errors.title ? '#EF4444' : '#E6ECF3' }}
              placeholder="e.g. Group meeting"
              value={form.title}
              onChange={e => setField('title', e.target.value)}
            />
            {errors.title && <div style={errorStyle}>{errors.title}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Type <span style={{ color: '#EF4444' }}>*</span></label>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.type}
                onChange={e => setField('type', e.target.value as EventType)}
              >
                {TYPE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="date"
                style={{ ...inputStyle, borderColor: errors.date ? '#EF4444' : '#E6ECF3' }}
                value={form.date}
                onChange={e => setField('date', e.target.value)}
              />
              {errors.date && <div style={errorStyle}>{errors.date}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Start time <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="time"
                style={{ ...inputStyle, borderColor: errors.startTime ? '#EF4444' : '#E6ECF3' }}
                value={form.startTime}
                onChange={e => setField('startTime', e.target.value)}
              />
              {errors.startTime && <div style={errorStyle}>{errors.startTime}</div>}
            </div>
            <div>
              <label style={labelStyle}>End time <span style={{ color: '#7B8DA5' }}>(optional)</span></label>
              <input type="time" style={inputStyle} value={form.endTime} onChange={e => setField('endTime', e.target.value)} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Course / source</label>
            <input style={inputStyle} placeholder="e.g. BIOL08019 or Personal" value={form.source} onChange={e => setField('source', e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Location / note</label>
            <input style={inputStyle} placeholder="e.g. Main Library" value={form.location} onChange={e => setField('location', e.target.value)} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div
              onClick={() => setField('addToAgenda', !form.addToAgenda)}
              style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${form.addToAgenda ? '#1B3FA0' : '#D7E0EA'}`, background: form.addToAgenda ? '#1B3FA0' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all 0.15s' }}
            >
              {form.addToAgenda && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: '#48607A', fontWeight: 500 }}>Show in daily agenda ({defaultDate} May)</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 24px', borderTop: '1px solid #EEF2F7' }}>
          <button onClick={onClose} style={{ height: 38, padding: '0 18px', borderRadius: 10, border: '1px solid #D7E0EA', background: '#fff', color: '#0A254F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={{ height: 38, padding: '0 18px', borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Add item
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Schedule() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<TEvent[]>(INITIAL_EVENTS)
  const [extraAgendaByDate, setExtraAgendaByDate] = useState<Record<number, AgendaItem[]>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [view, setView] = useState<ViewMode>('Week')
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [selectedEvent, setSelectedEvent] = useState<TEvent | null>(null)
  const [selectedCalDate, setSelectedCalDate] = useState(15)
  const [selectedAgendaItem, setSelectedAgendaItem] = useState<AgendaItem | null>(null)
  const [toast, setToast] = useState(false)

  const currentAgenda: AgendaItem[] = [
    ...(AGENDA_BY_DAY[selectedCalDate] ?? []),
    ...(extraAgendaByDate[selectedCalDate] ?? []),
  ]

  const visibleEvents = activeFilter === 'All'
    ? events
    : events.filter(ev => {
        const entry = LEGEND.find(l => l.label === activeFilter)
        return entry ? entry.types.includes(ev.type) : true
      })

  function handleAdd(ev: TEvent, dateStr: string, startTime: string, endTime: string, addToAgenda: boolean) {
    if (ev.day >= 0) {
      setEvents(prev => [...prev, ev])
    }
    if (addToAgenda) {
      const dateNum = new Date(dateStr + 'T00:00:00').getDate()
      const timeStr = endTime ? `${startTime}–${endTime}` : startTime
      const item: AgendaItem = {
        id: ev.id + '-ag',
        time: timeStr,
        title: ev.title,
        location: ev.location,
        type: ev.type,
      }
      setExtraAgendaByDate(prev => ({
        ...prev,
        [dateNum]: [...(prev[dateNum] ?? []), item].sort((a, b) => a.time.localeCompare(b.time)),
      }))
      setToast(true)
      setTimeout(() => setToast(false), 2500)
    }
  }

  function handleAgendaClick(sharedItem: SharedAgendaItem) {
    if (sharedItem.route) {
      navigate(sharedItem.route)
      return
    }
    const match = currentAgenda.find(a => a.id === sharedItem.id)
    if (match) setSelectedAgendaItem(match)
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Center: scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <div style={{ padding: '28px 32px 40px' }}>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: '#0A254F', letterSpacing: '-0.02em', marginBottom: 18 }}>
            Schedule
          </h1>

          {/* Controls row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #E6ECF3', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#48607A', cursor: 'pointer' }}>
                <ChevronLeft size={18} strokeWidth={1.75} />
              </button>
              <button style={{ height: 36, padding: '0 14px', borderRadius: 10, border: '1px solid #E6ECF3', background: '#fff', color: '#0A254F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Today
              </button>
              <button style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #E6ECF3', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#48607A', cursor: 'pointer' }}>
                <ChevronRight size={18} strokeWidth={1.75} />
              </button>
            </div>

            <button style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 10, border: '1px solid #E6ECF3', background: '#fff', color: '#0A254F', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {view === 'Day' ? `${selectedCalDate} May, 2024` : view === 'Month' ? 'May 2024' : 'May 13 – 19, 2024'}
              <ChevronDown size={13} strokeWidth={1.75} color="#7B8DA5" />
            </button>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setModalOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, height: 36, padding: '0 16px', borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                <Plus size={15} strokeWidth={2} />
                Add item
              </button>

              <div style={{ display: 'flex', border: '1px solid #E6ECF3', borderRadius: 10, overflow: 'hidden' }}>
                {(['Day', 'Week', 'Month'] as ViewMode[]).map((v, i) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{ padding: '0 14px', height: 36, background: v === view ? '#1B3FA0' : '#fff', color: v === view ? '#fff' : '#48607A', border: 'none', borderLeft: i > 0 ? '1px solid #E6ECF3' : 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s, color 0.15s' }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {view === 'Week' && (
            <Timetable events={visibleEvents} selectedCalDate={selectedCalDate} onNavigate={r => navigate(r)} onOpen={setSelectedEvent} />
          )}
          {view === 'Day' && (
            <DayView events={visibleEvents} selectedCalDate={selectedCalDate} onNavigate={r => navigate(r)} onOpen={setSelectedEvent} />
          )}
          {view === 'Month' && (
            <MonthView events={visibleEvents} selectedCalDate={selectedCalDate} />
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <div style={{ width: 320, flexShrink: 0, borderLeft: '1px solid #E6ECF3', background: '#F7F9FC', padding: '24px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <MiniCalendarShared
          monthLabel="May 2024"
          weeks={SCHEDULE_CAL_WEEKS}
          selectedDate={selectedCalDate}
          eventDots={SCHEDULE_CAL_DOTS}
          onDateSelect={setSelectedCalDate}
        />
        <DailyAgendaShared
          dateLabel={`${selectedCalDate} May Agenda`}
          showTodayBadge={selectedCalDate === 15}
          items={toSharedItems(currentAgenda)}
          onItemClick={handleAgendaClick}
          bottomAction={
            <button style={{ width: '100%', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}>
              View full day →
            </button>
          }
        />
        <FilterCard activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {modalOpen && (
        <AddItemModal
          defaultDate={selectedCalDate}
          onClose={() => setModalOpen(false)}
          onAdd={handleAdd}
        />
      )}

      {selectedEvent && (
        <EventDetailModal ev={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {selectedAgendaItem && (
        <AgendaItemDetailModal item={selectedAgendaItem} onClose={() => setSelectedAgendaItem(null)} />
      )}

      <Toast message="Item added to agenda" visible={toast} />
    </div>
  )
}
