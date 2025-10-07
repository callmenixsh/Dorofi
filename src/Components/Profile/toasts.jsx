// components/Achievements/AchievementToast.jsx - Much simpler!
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { clearNewAchievements } from '../../store/slices/achievementsSlice';

const AchievementToast = () => {
    const dispatch = useDispatch();
    const { newAchievements } = useSelector(state => state.achievements);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (newAchievements.length > 0) {
            setVisible(true);
            
            // Auto-hide after 4 seconds
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(() => dispatch(clearNewAchievements()), 300);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [newAchievements, dispatch]);

    if (newAchievements.length === 0) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
            visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
            {newAchievements.map((achievement, index) => (
                <div 
                    key={achievement.id}
                    className={`mb-2 bg-surface border-l-4 ${
                        achievement.isSecret 
                            ? 'border-purple-500 bg-gradient-to-r from-purple-500/10 to-pink-500/10' 
                            : 'border-primary bg-primary/5'
                    } rounded-lg p-4 shadow-lg min-w-80 animate-in slide-in-from-right`}
                    style={{ animationDelay: `${index * 200}ms` }}
                >
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className={`font-semibold ${
                                    achievement.isSecret ? 'text-purple-600' : 'text-primary'
                                }`}>
                                    Achievement Unlocked!
                                </h3>
                                {achievement.isSecret && (
                                    <span className="text-xs bg-purple-500/20 text-purple-600 px-2 py-1 rounded-full">
                                        Secret
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-primary font-medium">{achievement.name}</p>
                            <p className="text-xs text-secondary capitalize">{achievement.category}</p>
                        </div>
                        <div className="text-xl">🏆</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AchievementToast;
