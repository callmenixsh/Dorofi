// Pages/Support.jsx - Balanced Support Page
import React from "react";
import {
	Bug,
	Github,
	ExternalLink,
	MessageCircle,
	ArrowLeft,
	Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Support = () => {
	const navigate = useNavigate();

	const handleGitHubIssues = () => {
		window.open("https://github.com/callmenixsh/Dorofi/issues", "_blank");
	};

	const handleNewIssue = () => {
		window.open("https://github.com/callmenixsh/Dorofi/issues/new", "_blank");
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-2xl mx-auto px-6 py-16">
				<div className="text-center mb-10">
					<div className="flex items-center justify-center gap-5">
						<div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center  mb-6">
							<MessageCircle size={36} className="text-white" />
						</div>
						<h1 className="text-4xl font-bold text-primary mb-4">Support</h1>
					</div>
					<p className="text-lg text-secondary">
						Need help? Found a bug? We're here for you!
					</p>
				</div>

				{/* Status Banner */}
				<div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-surface mb-12 text-center">
					<div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-3">
						<Clock size={16} className="text-primary" />
						<span className="text-primary font-medium">
							Currently in Development
						</span>
					</div>
					<p className="text-secondary">
						We're using GitHub Issues to track bugs and feature requests. A full
						support system is coming soon!
					</p>
				</div>

				{/* Main Actions */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
					{/* Report Bug */}
					<div className="bg-surface p-6 rounded-xl border border-surface">
						<div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
							<Bug size={24} className="text-red-500" />
						</div>
						<h3 className="text-xl font-semibold text-primary mb-3">
							Report a Bug
						</h3>
						<p className="text-secondary mb-4 text-sm">
							Found something broken? Help us fix it by reporting the issue on
							GitHub.
						</p>
						<button
							onClick={handleNewIssue}
							className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
						>
							<Bug size={16} />
							<span>Report Bug</span>
							<ExternalLink size={14} />
						</button>
					</div>

					{/* View Issues */}
					<div className="bg-surface p-6 rounded-xl border border-surface">
						<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
							<Github size={24} className="text-primary" />
						</div>
						<h3 className="text-xl font-semibold text-primary mb-3">
							Browse Issues
						</h3>
						<p className="text-secondary mb-4 text-sm">
							Check existing issues or see what we're working on fixing next.
						</p>
						<button
							onClick={handleGitHubIssues}
							className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-medium"
						>
							<Github size={16} />
							<span>View Issues</span>
							<ExternalLink size={14} />
						</button>
					</div>
				</div>

				{/* Quick Tips */}
				<div className="bg-surface rounded-xl p-6 border border-surface">
					<h3 className="text-lg font-semibold text-primary mb-4">
						💡 Reporting Tips
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
						<div>
							<h4 className="font-medium text-primary mb-2">
								What to include:
							</h4>
							<ul className="space-y-1 text-secondary">
								<li>• What you were trying to do</li>
								<li>• What actually happened</li>
								<li>• Your browser and device</li>
								<li>• Steps to reproduce the bug</li>
							</ul>
						</div>
						<div>
							<h4 className="font-medium text-primary mb-2">This helps us:</h4>
							<ul className="space-y-1 text-secondary">
								<li>• Fix bugs faster</li>
								<li>• Understand the problem</li>
								<li>• Prioritize important fixes</li>
								<li>• Improve Dorofi for everyone</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Support;
