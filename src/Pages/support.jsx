import React from "react";
import {
	Bug,
	Github,
	ExternalLink,
	MessageCircle,
	ArrowLeft,
	Sparkles,
	Check,
	Lightbulb,
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
		<div className="min-h-screen bg-background animate-page-in relative overflow-hidden">
			<div className="max-w-3xl mx-auto px-6 py-12 relative z-10">
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 text-primary rounded-2xl mb-4 shadow-sm border border-primary/10">
						<MessageCircle size={32} />
					</div>
					<h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
						Support & Feedback
					</h1>
					<p className="text-secondary text-sm md:text-base max-w-lg mx-auto leading-relaxed">
						Dorofi is community-driven and open source. Our official, permanent
						support and collaboration hub is hosted entirely on GitHub.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					<div className="bg-surface border border-surface rounded-2xl p-6 flex flex-col justify-between group hover:border-rose-500/30 transition-all duration-300 shadow-sm hover:shadow-md">
						<div>
							<div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200">
								<Bug size={24} className="text-rose-500" />
							</div>
							<p className="text-secondary text-xs leading-relaxed mb-6">
								Encountered broken layout, timer issues, or glitches? Let us
								know so we can fix it.
							</p>
						</div>
						<button
							onClick={handleNewIssue}
							className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors font-semibold shadow-sm text-xs"
						>
							<Bug size={14} />
							<span>Report Bug</span>
							<ExternalLink size={12} />
						</button>
					</div>

					<div className="bg-surface border border-surface rounded-2xl p-6 flex flex-col justify-between group hover:border-amber-500/30 transition-all duration-300 shadow-sm hover:shadow-md">
						<div>
							<div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200">
								<Lightbulb size={24} className="text-amber-500" />
							</div>
							<p className="text-secondary text-xs leading-relaxed mb-6">
								Have an idea for a new feature, integration, or custom theme?
								Share your ideas with us.
							</p>
						</div>
						<button
							onClick={handleNewIssue}
							className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors font-semibold shadow-sm text-xs"
						>
							<Lightbulb size={14} />
							<span>Suggest Idea</span>
							<ExternalLink size={12} />
						</button>
					</div>

					<div className="bg-surface border border-surface rounded-2xl p-6 flex flex-col justify-between group hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
						<div>
							<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center  transition-transform group-hover:scale-110 duration-200">
								<Github size={24} className="text-primary" />
							</div>
							<p className="text-secondary text-xs leading-relaxed mb-6">
								Browse existing active discussions, track milestones, and see
								public feature roadmaps.
							</p>
						</div>
						<button
							onClick={handleGitHubIssues}
							className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:opacity-95 text-invert rounded-xl transition-all font-semibold shadow-sm text-xs"
						>
							<Github size={14} />
							<span>Browse Issues</span>
							<ExternalLink size={12} />
						</button>
					</div>
				</div>

				<div className="bg-surface border border-surface rounded-2xl text-sm p-6 shadow-sm">
					<h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
						What to include in reports:
					</h3>
					<div className="space-y-3">
						<h4 className="font-semibold text-primary"></h4>
						<ul className="space-y-2.5">
							{[
								"Clear description of what you were trying to do",
								"What actually happened versus what you expected",
								"Your current browser, operating system, and device type",
								"Simple, step-by-step instructions to reproduce the issue",
							].map((item, idx) => (
								<li key={idx} className="flex gap-2.5 items-start">
									<span className="w-5 h-5 rounded bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
										{idx + 1}
									</span>
									<span className="text-secondary leading-relaxed">{item}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Support;
