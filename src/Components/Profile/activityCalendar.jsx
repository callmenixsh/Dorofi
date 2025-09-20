// components/Profile/ActivityCalendar.jsx - Original UI
export default function ActivityCalendar({ stats }) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <div className="bg-surface rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Activity Calendar</h2>
            
            <div className="space-y-3">
                {/* Week days */}
                <div className="grid grid-cols-7 gap-2">
                    {days.map(day => (
                        <div key={day} className="text-center text-xs text-secondary py-2">
                            {day}
                        </div>
                    ))}
                </div>
                
                {/* Activity grid */}
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div 
                            key={index} 
                            className="aspect-square bg-background rounded-lg border border-background hover:bg-primary/20 transition-colors"
                        />
                    ))}
                </div>
                
                <div className="text-center text-sm text-secondary mt-4">
                    Activity tracking coming soon!
                </div>
            </div>
        </div>
    );
}
