// components/Profile/StatsOverview.jsx
import { Clock, Target, TrendingUp, Award } from "lucide-react";

export default function StatsOverview({ stats, formatTime }) {
	const statsData = [
        {
            icon: Clock,
            label: "Today's Focus Time",
            value: formatTime(stats.dailyFocusTime),
            color: "primary",
        },
		{
			icon: Clock,
			label: "Total Focus Time",
			value: formatTime(stats.totalFocusTime),
			color: "primary",
		},
		{
			icon: Target,
			label: "Sessions ",
			value: stats.totalSessions,
			color: "secondary",
		},
		{
			icon: TrendingUp,
			label: "Current Streak",
			value: `${stats.currentStreak} days`,
			color: "accent",
		},
		{
			icon: Award,
			label: "Best Streak",
			value: `${stats.longestStreak} days`,
			color: "primary",
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
			{statsData.map((stat, index) => (
				<div key={index} className="bg-surface rounded-lg p-4">
					<div className="flex items-center gap-3">
						<div className={`p-2 bg-${stat.color}/10 rounded-lg`}>
							<stat.icon size={20} className={`text-${stat.color}`} />
						</div>
						<div>
							<p className="text-sm text-secondary">{stat.label}</p>
							<p className="text-lg font-semibold text-primary">{stat.value}</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
