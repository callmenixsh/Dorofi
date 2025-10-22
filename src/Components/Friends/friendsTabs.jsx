export default function FriendsTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="bg-surface rounded-lg p-2 mb-6 w-full flex justify-center">
      <div className="flex max-w-4xl w-full gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 rounded font-medium transition-colors text-sm sm:text-base ${
              activeTab === tab.id
                ? "bg-primary text-background"
                : "text-secondary hover:text-primary hover:bg-background"
            }`}
          >
            <tab.icon size={18} className="min-w-[18px] shrink-0" />
            <span className="hidden sm:inline truncate">{tab.label}</span>

            {tab.id === "requests" && tab.count > 0 && (
              <span
                className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full ${
                  activeTab === tab.id
                    ? "bg-background text-primary"
                    : "bg-primary text-background"
                }`}
              >
                {tab.count > 99 ? "99+" : tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
