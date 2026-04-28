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

function UoECrest() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="34" height="34" rx="7" fill="#072452" />
      <path
        d="M17 5 L26 8 L26 19 C26 24 17 29 17 29 C17 29 8 24 8 19 L8 8 Z"
        fill="none" stroke="white" strokeWidth="1.2" strokeLinejoin="round"
      />
      <line x1="17" y1="8"  x2="17" y2="26" stroke="white" strokeWidth="1" />
      <line x1="10" y1="14" x2="24" y2="14" stroke="white" strokeWidth="1" />
      <circle cx="17" cy="8" r="1.2" fill="white" />
    </svg>
  )
}

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <aside className="h-screen bg-white border-r border-[#E6ECF3] flex flex-col w-full">
      <div className="px-5 pt-7 pb-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-9">
          <UoECrest />
          <div>
            <div className="font-bold text-[#0A254F] leading-none tracking-wide"
                 style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              The University
            </div>
            <div className="font-bold text-[#0A254F] leading-none mt-0.5 tracking-wide"
                 style={{ fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              of Edinburgh
            </div>
            <div className="font-semibold text-[#2563EB] mt-1"
                 style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              LEARN
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = pathname === item.path || pathname.startsWith(item.path + '/')
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 w-full px-4 rounded-[12px] font-medium text-[15px] transition-all duration-150 ${
                  active
                    ? 'bg-[#072452] text-white'
                    : 'text-[#48607A] hover:bg-[#F1F5F9] hover:text-[#0A254F]'
                }`}
                style={{
                  height: 46,
                  boxShadow: active ? '0 8px 20px rgba(7, 36, 82, 0.15)' : undefined,
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
