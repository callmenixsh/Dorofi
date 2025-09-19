// components/Profile/ActivityCalendar.jsx
export default function ActivityCalendar({ stats }) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <div className="bg-surface rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-primary mb-4">This Week</h2>
            <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                    const hasActivity = index < Math.floor(stats.totalSessions / 10);
                    return (
                        <div key={day} className="text-center">
                            <p className="text-xs text-secondary mb-1">{day}</p>
                            <div
                                className={`w-8 h-8 rounded mx-auto ${
                                    hasActivity ? "bg-primary" : "bg-background"
                                }`}
                            ></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
