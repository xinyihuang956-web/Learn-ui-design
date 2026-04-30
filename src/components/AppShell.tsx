import Sidebar from './Sidebar'
import TopHeader from './TopHeader'

type AppShellProps = {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-full overflow-hidden bg-[#F7F9FC]">
      {/* Sidebar: fixed-width, never scrolls */}
      <div className="flex-shrink-0 h-full" style={{ width: 230 }}>
        <Sidebar />
      </div>

      {/* Right side: header + content column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header: fixed height, never scrolls */}
        <div className="flex-shrink-0 z-10">
          <TopHeader />
        </div>

        {/* Content area: pages handle their own scroll internally */}
        <main className="flex-1 min-h-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
