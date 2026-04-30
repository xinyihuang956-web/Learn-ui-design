import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  BarChart2,
  Settings,
  LogOut,
} from 'lucide-react'

type NavItem = {
  label: string
  icon: React.ReactNode
  path: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} strokeWidth={1.75} />, path: '/dashboard' },
  { label: 'Courses',   icon: <BookOpen size={20} strokeWidth={1.75} />,        path: '/courses'   },
  { label: 'Schedule',  icon: <Calendar size={20} strokeWidth={1.75} />,         path: '/schedule'  },
  { label: 'Marks',     icon: <BarChart2 size={20} strokeWidth={1.75} />,        path: '/marks'     },
  { label: 'Settings',  icon: <Settings size={20} strokeWidth={1.75} />,         path: '/settings'  },
]

// Pages that are "sub-pages" of Dashboard in terms of nav highlight
const DASHBOARD_SUBPATHS = new Set(['/deadlines', '/updates'])

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Resolve which top-level nav entry should appear active
  const activePath = DASHBOARD_SUBPATHS.has(pathname) ? '/dashboard' : pathname

  return (
    <aside className="h-screen bg-white border-r border-[#E6ECF3] flex flex-col w-full">
      <div className="px-5 pt-7 pb-0">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-9">
          <img
            src="/edinburgh-logo.jpg"
            alt="University of Edinburgh"
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <div className="font-bold text-[#0A254F] leading-none"
                 style={{ fontSize: 8.5, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              The University
            </div>
            <div className="font-bold text-[#0A254F] leading-none mt-0.5"
                 style={{ fontSize: 8.5, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              of Edinburgh
            </div>
            <div className="font-semibold text-[#2563EB] mt-1"
                 style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              LEARN
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = activePath === item.path || activePath.startsWith(item.path + '/')
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 w-full px-4 rounded-[12px] font-medium text-[15px] transition-all duration-150 ${
                  active
                    ? 'bg-[#1B3FA0] text-white'
                    : 'text-[#48607A] hover:bg-[#F1F5F9] hover:text-[#0A254F]'
                }`}
                style={{
                  height: 46,
                  boxShadow: active ? '0 8px 20px rgba(27, 63, 160, 0.18)' : undefined,
                }}
              >
                <span className={`shrink-0 ${active ? 'text-white' : 'text-[#7B8DA5]'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Sign out */}
      <div className="mt-auto px-5 pb-8">
        <div className="border-t border-[#EEF2F7] mb-4" />
        <button
          className="flex items-center gap-3 w-full px-4 rounded-[12px] text-[#7B8DA5] hover:bg-[#FFF5F5] hover:text-[#EF4444] text-[15px] font-medium transition-all duration-150"
          style={{ height: 46 }}
        >
          <LogOut size={20} strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
