import { Search, Bell, ChevronDown } from 'lucide-react'

export default function TopHeader() {
  return (
    <header
      className="bg-white border-b border-[#E6ECF3] flex items-center justify-between px-8"
      style={{ height: 72 }}
    >
      {/* Search */}
      <div className="relative" style={{ width: 380 }}>
        <Search
          size={16}
          strokeWidth={1.75}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B8DA5]"
        />
        <input
          type="text"
          placeholder="Search LEARN"
          className="w-full h-11 pl-10 pr-4 border border-[#E6ECF3] rounded-[12px] bg-white text-sm text-[#48607A] placeholder-[#7B8DA5] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[rgba(37,99,235,0.12)] transition-all"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-5">
        <button className="relative text-[#48607A] hover:text-[#0A254F] transition-colors">
          <Bell size={20} strokeWidth={1.75} />
          <span
            className="absolute -top-1 -right-1 w-2 h-2 bg-[#EF4444] rounded-full"
          />
        </button>

        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div
            className="flex items-center justify-center rounded-full text-white text-xs font-semibold"
            style={{ width: 36, height: 36, background: '#1B3FA0', fontSize: 12 }}
          >
            XH
          </div>
          <span className="text-sm font-medium text-[#0A254F]">Xinyi Huang</span>
          <ChevronDown size={16} strokeWidth={1.75} className="text-[#7B8DA5]" />
        </button>
      </div>
    </header>
  )
}
