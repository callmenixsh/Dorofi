import { Home, Users, Settings, User, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import ThemeToggle from "./toggletheme";
import SettingsModal from "./SettingsModal";
import InfoModal from "./InfoModal";

export default function DorofiNavbar() {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isInfoOpen, setIsInfoOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [profileImageError, setProfileImageError] = useState(false);
	const navigate = useNavigate();

	// Check for existing authentication on component mount
	useEffect(() => {
		const userInfo = localStorage.getItem("googleUserInfo");
		if (userInfo) {
			try {
				const parsed = JSON.parse(userInfo);
				setUser(parsed);
			} catch (error) {
				console.error("Invalid user info:", error);
				localStorage.removeItem("googleUserInfo");
				localStorage.removeItem("googleToken");
			}
		}
	}, []);

	// Custom Google Login with useGoogleLogin hook
	const login = useGoogleLogin({
		onSuccess: async (response) => {
			setIsLoading(true);
			try {
				// Get user info from Google
				const userInfoResponse = await fetch(
					`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`
				);
				const userInfo = await userInfoResponse.json();

				console.log("Login Success:", userInfo);
				setUser(userInfo);
				setProfileImageError(false); // Reset image error state
				localStorage.setItem("googleToken", response.access_token);
				localStorage.setItem("googleUserInfo", JSON.stringify(userInfo));
			} catch (error) {
				console.error("Login failed:", error);
			} finally {
				setIsLoading(false);
			}
		},
		onError: (error) => {
			console.error("Google Login Failed:", error);
			setIsLoading(false);
		},
	});

	// Enhanced logout function
	const handleLogout = () => {
		try {
			// Clear user state
			setUser(null);
			setProfileImageError(false);

			// Clear localStorage
			localStorage.removeItem("googleToken");
			localStorage.removeItem("googleUserInfo");

			// Navigate to home
			navigate("/", { replace: true });
		} catch (error) {
			console.error("Logout error:", error);
			// Force navigation even if there's an error
			window.location.href = "/";
		}
	};

	// Get high-resolution profile picture from Google
	const getHighResProfilePicture = (googlePicture) => {
		if (!googlePicture) return null;

		// Google profile pictures come in different sizes
		// Replace size parameters to get higher resolution
		return googlePicture
			.replace("s96-c", "s200-c") // Increase size from 96px to 200px
			.replace("=s96", "=s200") // Alternative format
			.replace("sz=50", "sz=200"); // Another alternative format
	};

	const handleNavigation = (path) => {
		navigate(path);
	};

	const openSettings = () => {
		setIsSettingsOpen(true);
	};

	const closeSettings = () => {
		setIsSettingsOpen(false);
	};

	const openInfo = () => {
		setIsInfoOpen(true);
	};

	const closeInfo = () => {
		setIsInfoOpen(false);
	};

	// Updated toggleColorScheme function with localStorage persistence
	const toggleColorScheme = () => {
		const currentTheme = document.documentElement.getAttribute("data-theme");

		// Determine current mode (dark or light)
		const isDark = currentTheme?.includes("dark");
		const mode = isDark ? "dark" : "light";

		// Toggle color scheme while preserving mode
		let newTheme;
		if (currentTheme?.includes("dorofi")) {
			newTheme = `ocean-${mode}`;
		} else if (currentTheme?.includes("ocean")) {
			newTheme = `dorofi-${mode}`;
		} else {
			// Fallback if no theme is set
			newTheme = "ocean-light";
		}

		// Apply new theme
		document.documentElement.setAttribute("data-theme", newTheme);

		// Save to localStorage
		localStorage.setItem("dorofi-theme", newTheme);

		// Save color scheme separately
		const colorScheme = newTheme.includes("ocean") ? "ocean" : "dorofi";
		localStorage.setItem("dorofi-color-scheme", colorScheme);
	};

	return (
		<>
			<nav className="flex justify-between items-center px-8 py-4 bg-background">
				{/* Left side: Brand & Navigation */}
				<div className="flex items-center gap-2 text-primary text-2xl">
					<button
						onClick={() => handleNavigation("/about")}
						className="focus:outline-none rounded-full p-2 hover:bg-surface transition-colors"
						aria-label="About Dorofi"
						title="What is Dorofi?"
						style={{ fontFamily: "Joti One" }}
					>
						Dorofi
					</button>
				</div>
				<div style={{ display: "none" }}>
					<ThemeToggle />
				</div>

				{/* Center: Focus & Settings */}
				<div className="flex items-center gap-5 text-accent">
					<button
						onClick={() => handleNavigation("/")}
						className="rounded-full p-2 hover:bg-surface transition-colors"
						aria-label="Solo Focus Session"
						title="Solo Focus Session"
					>
						<User size={28} strokeWidth={2.25} />
					</button>
					<button
						onClick={() => handleNavigation("/rooms")}
						className="rounded-full p-2 hover:bg-surface transition-colors"
						aria-label="Study Rooms"
						title="Study Rooms"
					>
						<Users size={28} strokeWidth={2.25} />
					</button>
					<button
						onClick={() => handleNavigation("/friends")}
						className="rounded-full p-2 hover:bg-surface transition-colors "
						aria-label="Friends"
						title="Friends"
					>
						<Users size={28} strokeWidth={2.25} />
					</button>
				</div>

				{/* Right: Social / Auth */}
				<div className="flex items-center gap-2">
					{user ? (
						// Logged in state
						<>
							{/* Info button for logged in users */}
							<button
								onClick={openInfo}
								className="rounded-full p-2 hover:bg-surface transition-colors text-secondary"
								aria-label="How to use app"
								title="How to Use Dorofi"
							>
								<Info size={24} strokeWidth={2} />
							</button>
							<button
								onClick={openSettings}
								className="rounded-full p-2 hover:bg-surface transition-colors text-secondary"
								aria-label="Settings"
								title="Settings"
							>
								<Settings size={28} strokeWidth={2.25} />
							</button>
							{/* Enhanced Profile Button */}
							<button
								onClick={() => handleNavigation("/profile")}
								className="rounded-full p-1 hover:bg-surface transition-colors"
								aria-label="Profile"
								title={`${user.name}'s Profile`}
							>
								<div className="w-8 h-8 rounded-full overflow-hidden border-2 border-secondary bg-surface">
									{user?.picture && !profileImageError ? (
										<img
											src={getHighResProfilePicture(user.picture)}
											alt={user.name || "Profile"}
											className="w-full h-full object-cover"
											onError={() => setProfileImageError(true)}
											onLoad={() => setProfileImageError(false)}
											crossOrigin="anonymous"
											referrerPolicy="no-referrer"
										/>
									) : (
										<div className="w-full h-full bg-surface flex items-center justify-center">
											<User
												size={18}
												strokeWidth={2}
												className="text-secondary"
											/>
										</div>
									)}
								</div>
							</button>
						</>
					) : (
						// Login section with info button for guests
						<div className="flex items-center gap-2">
							<button
								onClick={openInfo}
								className="rounded-full p-2 hover:bg-surface transition-colors text-secondary"
								aria-label="Why login?"
								title="Why Should I Login?"
							>
								<Info size={20} strokeWidth={2} />
							</button>{" "}
							<button
								onClick={openSettings}
								className="rounded-full p-2 hover:bg-surface transition-colors text-secondary"
								aria-label="Settings"
								title="Settings"
							>
								<Settings size={28} strokeWidth={2.25} />
							</button>
							<button
								onClick={() => login()}
								disabled={isLoading}
								className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
								aria-label="Login to track progress"
								title="Login with Google to track your progress"
							>
								{isLoading ? (
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								) : (
									<FaGoogle size={18} />
								)}
								<span className="text-sm">
									{isLoading ? "Signing in..." : "SignUp/Login"}
								</span>
							</button>
						</div>
					)}
				</div>
			</nav>

			{/* Settings Modal */}
			{isSettingsOpen && (
				<SettingsModal
					onClose={closeSettings}
					user={user}
					onLogout={handleLogout}
					toggleColorScheme={toggleColorScheme}
				/>
			)}

			{/* Info Modal */}
			{isInfoOpen && <InfoModal onClose={closeInfo} user={user} />}
		</>
	);
}
