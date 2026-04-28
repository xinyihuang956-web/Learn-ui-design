type PillVariant = 'blue' | 'green' | 'orange' | 'red' | 'purple'

const variants: Record<PillVariant, { bg: string; text: string }> = {
  blue:   { bg: '#EAF2FF', text: '#2563EB' },
  green:  { bg: '#EAF8F0', text: '#1F9D55' },
  orange: { bg: '#FFF3E6', text: '#F97316' },
  red:    { bg: '#FFECEC', text: '#EF4444' },
  purple: { bg: '#F3E8FF', text: '#7C3AED' },
}

type StatusPillProps = {
  label: string
  variant: PillVariant
}

export default function StatusPill({ label, variant }: StatusPillProps) {
  const { bg, text } = variants[variant]
  return (
    <span
      className="inline-flex items-center font-semibold"
      style={{
        background: bg,
        color: text,
        borderRadius: 999,
        fontSize: 12,
        lineHeight: '16px',
        padding: '4px 10px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
