import React from "react";
import { Timer, Heart, Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gradient-to-r from-surface/50 to-surface/30 border-t border-surface/50 mt-24">
			<div className="max-w-6xl mx-auto px-6 py-8">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
					{/* Brand Section */}
					<div>
						<div className="flex items-center gap-2 mb-3">
							<div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
								<Timer size={18} className="text-white" />
							</div>
							<span
								className="text-xl font-bold text-primary"
								style={{ fontFamily: "Joti One" }}
							>
								Dorofi
							</span>
						</div>
						<p className="text-secondary text-sm leading-relaxed">
							Master focused work with the enhanced Pomodoro technique. Built
							for everyone.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="font-semibold text-primary mb-3">Quick Links</h4>
						<div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
							<a
								href="/"
								className="text-secondary hover:text-primary transition-colors"
							>
								Timer
							</a>
							<a
								href="/about"
								className="text-secondary hover:text-primary transition-colors"
							>
								About
							</a>
							<a
								href="/rooms"
								className="text-secondary hover:text-primary transition-colors"
							>
								Study Rooms
							</a>
							<a
								href="#"
								className="text-secondary hover:text-primary transition-colors"
							>
								Shortcuts
							</a>
							<a
								href="/friends"
								className="text-secondary hover:text-primary transition-colors"
							>
								Friends
							</a>
							<a
								href="#"
								className="text-secondary hover:text-primary transition-colors"
							>
								Support
							</a>
						</div>
					</div>

					{/* Connect */}
					<div>
						<h4 className="font-semibold text-primary mb-3">Connect</h4>
						<div className="flex items-center gap-4 mb-3">
							<a
								href="https://github.com/callmenixsh/Dorofi"
                target="_blank"
								className="text-secondary hover:text-primary transition-colors"
							>
								<Github size={18} />
							</a>
						</div>
						<div className="flex items-center gap-1 text-xs text-secondary">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							<span>All systems operational</span>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-surface/30 pt-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary">
						<div className="flex items-center gap-1">
							<span>© {currentYear} Dorofi.</span>
							<span>Made with</span>
							<Heart size={12} className="text-red-500 fill-current" />
							<span>for productivity</span>
						</div>

						<div className="flex items-center gap-4">
							<a
								href="/policies?tab=privacy"
								className="hover:text-primary transition-colors"
							>
								Privacy
							</a>
							<span className="text-surface">•</span>
							<a
								href="/policies?tab=terms"
								className="hover:text-primary transition-colors"
							>
								Terms
							</a>
							<span className="text-surface">•</span>
							<a
								href="/policies?tab=faq"
								className="hover:text-primary transition-colors"
							>
								FAQs
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
