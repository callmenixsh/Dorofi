// components/Profile/Achievements.jsx - Original UI
export default function Achievements({ stats }) {
    return (
        <div className="bg-surface rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.achievements.map((achievement) => (
                    <div 
                        key={achievement.id} 
                        className={`p-4 rounded-lg text-center transition-all ${
                            achievement.earned 
                                ? 'bg-primary/10 border-2 border-primary/20' 
                                : 'bg-background border-2 border-background opacity-50'
                        }`}
                    >
                        <div className={`text-2xl mb-2 ${achievement.earned ? '' : 'grayscale'}`}>
                            {achievement.icon}
                        </div>
                        <h3 className={`font-medium text-sm ${
                            achievement.earned ? 'text-primary' : 'text-secondary'
                        }`}>
                            {achievement.name}
                        </h3>
                        {achievement.earned && (
                            <p className="text-xs text-accent mt-1">Earned!</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
