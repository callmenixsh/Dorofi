// components/Profile/Achievements.jsx
export default function Achievements({ stats }) {
    return (
        <div className="bg-surface rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.achievements?.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            achievement.earned
                                ? "border-primary bg-primary/5"
                                : "border-surface bg-background opacity-50"
                        }`}
                    >
                        <div className="text-center">
                            <div className="text-2xl mb-2">{achievement.icon}</div>
                            <p
                                className={`text-sm font-medium ${
                                    achievement.earned ? "text-primary" : "text-secondary"
                                }`}
                            >
                                {achievement.name}
                            </p>
                            {achievement.earned && (
                                <p className="text-xs text-accent mt-1">Earned!</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
