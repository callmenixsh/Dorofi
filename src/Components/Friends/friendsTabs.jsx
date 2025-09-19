// components/friends/FriendsTabs.jsx
export default function FriendsTabs({ tabs, activeTab, setActiveTab }) {
    return (
        <div className="bg-surface rounded-lg p-1 mb-6">
            <div className="flex gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'bg-primary text-background'
                                : 'text-secondary hover:text-primary hover:bg-background'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
