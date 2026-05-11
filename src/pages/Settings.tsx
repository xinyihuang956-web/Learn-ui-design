import { useState } from 'react'
import { Bell, Clock, BookOpen, User, Check, X } from 'lucide-react'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 44, height: 24, borderRadius: 999, flexShrink: 0,
        background: on ? '#1B3FA0' : '#E6ECF3',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.15s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', transition: 'left 0.15s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
      }} />
    </button>
  )
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,37,79,0.18)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, border: '1px solid #E6ECF3', boxShadow: '0 24px 64px rgba(15,23,42,0.12)', width: '100%', maxWidth: 380, padding: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0A254F' }}>Profile</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E6ECF3', background: '#F9FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7B8DA5' }}>
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1B3FA0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12 }}>XH</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0A254F' }}>Xinyi Huang</div>
        </div>
        {[
          { label: 'Email', value: 'xinyi.huang@sms.ed.ac.uk' },
          { label: 'Programme', value: 'Design Informatics' },
          { label: 'Year', value: '2024/25' },
          { label: 'Student ID', value: 'S1234567' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #EEF2F7' }}>
            <span style={{ fontSize: 12, color: '#7B8DA5' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#0A254F' }}>{row.value}</span>
          </div>
        ))}
        <button
          onClick={onClose}
          style={{ width: '100%', height: 40, borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: 20 }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default function Settings() {
  const [notifs, setNotifs] = useState({ deadlines: true, announcements: true, feedback: true, weekly: false })
  const [timing, setTiming] = useState('3days')
  const [prefs, setPrefs] = useState({ completed: false, favourites: true, unread: true })
  const [saved, setSaved] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const toggleNotif = (k: keyof typeof notifs) => setNotifs(p => ({ ...p, [k]: !p[k] }))
  const togglePref = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const cardStyle: React.CSSProperties = {
    background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16,
    boxShadow: '0 8px 24px rgba(15,23,42,0.04)', padding: '24px',
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '11px 0', borderBottom: '1px solid #EEF2F7',
  }

  const iconBox = (bg: string, icon: React.ReactNode) => (
    <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
  )

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="w-full max-w-[1280px] mx-auto" style={{ padding: '28px 32px 40px' }}>

          <h1 style={{ fontSize: 34, fontWeight: 700, color: '#0A254F', letterSpacing: '-0.02em', marginBottom: 28 }}>Settings</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24, marginBottom: 28 }}>

            {/* Notifications */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                {iconBox('#EAF2FF', <Bell size={18} strokeWidth={1.75} color="#2563EB" />)}
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0A254F' }}>Notification preferences</div>
              </div>
              {([
                { key: 'deadlines',      label: 'Deadline reminders' },
                { key: 'announcements',  label: 'Course announcements' },
                { key: 'feedback',       label: 'Feedback released' },
                { key: 'weekly',         label: 'Weekly summary email' },
              ] as { key: keyof typeof notifs; label: string }[]).map(item => (
                <div key={item.key} style={rowStyle}>
                  <span style={{ fontSize: 13, color: '#48607A' }}>{item.label}</span>
                  <Toggle on={notifs[item.key]} onToggle={() => toggleNotif(item.key)} />
                </div>
              ))}
            </div>

            {/* Reminder timing */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                {iconBox('#FFF3E6', <Clock size={18} strokeWidth={1.75} color="#F97316" />)}
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0A254F' }}>Reminder timing</div>
              </div>
              {[
                { value: '1day',  label: '1 day before' },
                { value: '3days', label: '3 days before' },
                { value: '1week', label: '1 week before' },
                { value: 'custom', label: 'Custom' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTiming(opt.value)}
                  style={{ ...rowStyle, width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontSize: 13, color: '#48607A' }}>{opt.label}</span>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${timing === opt.value ? '#1B3FA0' : '#D7E0EA'}`, background: timing === opt.value ? '#1B3FA0' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {timing === opt.value && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                </button>
              ))}
            </div>

            {/* Course display */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                {iconBox('#EAF8F0', <BookOpen size={18} strokeWidth={1.75} color="#1F9D55" />)}
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0A254F' }}>Course display</div>
              </div>
              {([
                { key: 'completed',  label: 'Show completed courses' },
                { key: 'favourites', label: 'Pin favourite courses' },
                { key: 'unread',     label: 'Show unread updates first' },
              ] as { key: keyof typeof prefs; label: string }[]).map(item => (
                <div key={item.key} style={rowStyle}>
                  <span style={{ fontSize: 13, color: '#48607A' }}>{item.label}</span>
                  <Toggle on={prefs[item.key]} onToggle={() => togglePref(item.key)} />
                </div>
              ))}
            </div>

            {/* Account */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                {iconBox('#F3E8FF', <User size={18} strokeWidth={1.75} color="#7C3AED" />)}
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0A254F' }}>Account</div>
              </div>
              {[
                { label: 'Name',       value: 'Xinyi Huang' },
                { label: 'Email',      value: 'xinyi.huang@sms.ed.ac.uk' },
                { label: 'Programme',  value: 'Design Informatics' },
              ].map((row, i, arr) => (
                <div key={i} style={{ ...rowStyle, borderBottom: i < arr.length - 1 ? '1px solid #EEF2F7' : 'none' }}>
                  <span style={{ fontSize: 12, color: '#7B8DA5' }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0A254F' }}>{row.value}</span>
                </div>
              ))}
              <button
                onClick={() => setProfileOpen(true)}
                style={{ width: '100%', height: 38, borderRadius: 10, border: '1px solid #D7E0EA', background: '#fff', color: '#0A254F', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 16 }}
              >
                Edit profile
              </button>
            </div>
          </div>

          {/* Save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14 }}>
            {saved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#1F9D55' }}>
                <Check size={14} strokeWidth={2.5} />
                Settings saved
              </div>
            )}
            <button
              onClick={handleSave}
              style={{ height: 40, padding: '0 24px', borderRadius: 10, background: '#1B3FA0', color: '#fff', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>

      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </div>
  )
}
