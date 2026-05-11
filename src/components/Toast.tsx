import { Check } from 'lucide-react'

interface ToastProps {
  message: string
  visible: boolean
}

export default function Toast({ message, visible }: ToastProps) {
  if (!visible) return null
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 200,
      background: '#fff', border: '1px solid #E6ECF3', borderRadius: 12,
      boxShadow: '0 8px 32px rgba(15,23,42,0.12)',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 18px',
    }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#EAF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Check size={12} strokeWidth={2.5} color="#1F9D55" />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#0A254F' }}>{message}</span>
    </div>
  )
}
