// components/friends/FriendsTabs.jsx
export default function FriendsTabs({ tabs, activeTab, setActiveTab }) {
    return (
        <div className="bg-surface rounded-lg p-1 mb-6">
            <div className="flex gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors relative ${
                            activeTab === tab.id
                                ? 'bg-primary text-background'
                                : 'text-secondary hover:text-primary hover:bg-background'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                        
                        {/* Badge ONLY for requests tab */}
                        {tab.id === 'requests' && tab.count !== undefined && tab.count > 0 && (
                            <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full animate-pulse ${
                                activeTab === tab.id
                                    ? 'bg-background text-primary'
                                    : 'bg-primary text-background'
                            }`}>
                                {tab.count > 99 ? '99+' : tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
