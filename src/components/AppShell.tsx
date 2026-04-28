import Sidebar from './Sidebar'
import TopHeader from './TopHeader'

type AppShellProps = {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="bg-[#F7F9FC]" style={{ minHeight: '100vh' }}>
      {/* Sidebar: fixed to viewport left, never scrolls */}
      <div
        className="fixed top-0 left-0 h-screen z-20"
        style={{ width: 230 }}
      >
        <Sidebar />
      </div>

      {/* Everything right of sidebar */}
      <div style={{ marginLeft: 230 }}>
        {/* Header: sticky so it stays visible while page scrolls */}
        <div className="sticky top-0 z-10">
          <TopHeader />
        </div>

        {/* Page content: unconstrained, scrolls with the document */}
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}
