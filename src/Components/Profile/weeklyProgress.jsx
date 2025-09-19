// components/Profile/WeeklyProgress.jsx
export default function WeeklyProgress({ stats, formatTime }) {
    const weeklyProgressPercent = stats.weeklyGoal > 0 ? (stats.weeklyProgress / stats.weeklyGoal) * 100 : 0;

    return (
        <div className="bg-surface rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary">Weekly Goal</h2>
                <span className="text-sm text-secondary">
                    {formatTime(stats.weeklyProgress)} / {formatTime(stats.weeklyGoal)}
                </span>
            </div>
            <div className="w-full bg-background rounded-full h-3 mb-2">
                <div
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(weeklyProgressPercent, 100)}%` }}
                ></div>
            </div>
            <p className="text-sm text-secondary">
                {weeklyProgressPercent >= 100
                    ? "🎉 Goal achieved! Great work!"
                    : `${Math.round(weeklyProgressPercent)}% complete - ${formatTime(
                          Math.max(0, stats.weeklyGoal - stats.weeklyProgress)
                      )} to go`}
            </p>
        </div>
    );
}
