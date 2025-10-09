// components/Profile/ActivityCalendar.jsx - Complete Fixed Version with Debug
import { useState, useEffect } from 'react';
import { BarChart3, Clock, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import apiService from '../../services/api';

export default function ActivityCalendar({ stats }) {
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [viewMode, setViewMode] = useState('focus');
    const [monthlyData, setMonthlyData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Fetch monthly data on mount
    useEffect(() => {
        const fetchMonthlyActivity = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                console.log("🔍 Fetching unified stats for ActivityCalendar...");
                const result = await apiService.getUnifiedStats();
                
                // 🔍 DEBUG: Full response
                console.log("🔍 DEBUG - Full unified stats result:", JSON.stringify(result, null, 2));
                
                if (result?.success && result?.stats?.timer) {
                    const timerStats = result.stats.timer;
                    console.log("🔍 DEBUG - Timer stats:", timerStats);
                    console.log("🔍 DEBUG - Monthly history:", timerStats.monthlyHistory);
                    
                    const monthlyHistory = timerStats.monthlyHistory || [];
                    
                    if (monthlyHistory.length === 0) {
                        console.log("⚠️ No monthly history found - showing empty state");
                        setMonthlyData([]);
                        return;
                    }
                    
                    // Process the monthly history from User schema
                    const processedData = [];
                    const now = new Date();
                    const currentYear = now.getFullYear();
                    const currentMonth = now.getMonth() + 1; // JS months are 0-based
                    
                    console.log("🔍 Processing monthly data for:", { currentYear, currentMonth });
                    
                    // Generate last 6 months
                    for (let i = 5; i >= 0; i--) {
                        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
                        const targetYear = targetDate.getFullYear();
                        const targetMonth = targetDate.getMonth() + 1;
                        
                        // Find corresponding data from backend
                        const monthEntry = monthlyHistory.find(entry => 
                            entry.year === targetYear && entry.month === targetMonth
                        );
                        
                        console.log(`🔍 Month ${targetYear}-${targetMonth}:`, monthEntry);
                        
                        // Month names
                        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                              'July', 'August', 'September', 'October', 'November', 'December'];
                        
                        processedData.push({
                            year: targetYear,
                            month: targetMonth,
                            name: `${fullMonthNames[targetMonth - 1]} ${targetYear}`,
                            shortName: monthNames[targetMonth - 1],
                            focusTime: monthEntry?.totalFocusTime || 0, // Already in minutes
                            sessions: monthEntry?.totalSessions || 0,
                            isCurrentMonth: targetYear === currentYear && targetMonth === currentMonth
                        });
                    }
                    
                    console.log("🔍 Final processed data:", processedData);
                    setMonthlyData(processedData);
                } else {
                    console.log("❌ Invalid response structure:", result);
                    setError('Invalid data format received');
                }
            } catch (error) {
                console.error('❌ Failed to fetch monthly activity:', error);
                setError(`Failed to load activity data: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMonthlyActivity();
    }, []);
    
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };
    
    // Get max values for relative sizing
    const maxFocusTime = Math.max(...monthlyData.map(m => m.focusTime || 0), 1);
    const maxSessions = Math.max(...monthlyData.map(m => m.sessions || 0), 1);
    
    const getBarHeight = (value, maxValue) => {
        if (maxValue === 0 || value === 0) return 12;
        const percentage = (value / maxValue) * 100;
        return Math.max((percentage / 100) * 180, 12);
    };
    
    const getBarColor = (monthData, value) => {
        if (monthData.isCurrentMonth) return 'bg-accent shadow-md';
        if (value === 0) return 'bg-background border border-surface';
        return 'bg-primary hover:bg-primary/80 shadow-sm';
    };
    
    if (isLoading) {
        return (
            <div className="bg-surface rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="ml-3 text-secondary">Loading activity data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-surface rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center py-12 text-center">
                    <div>
                        <div className="text-red-500 mb-2">❌ {error}</div>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="text-primary hover:underline text-sm"
                        >
                            Try refreshing the page
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Check if we have any data at all
    const hasAnyData = monthlyData.some(month => month.focusTime > 0 || month.sessions > 0);
    
    if (!hasAnyData) {
        return (
            <div className="bg-surface rounded-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-primary">Past 6 Months Activity</h2>
                </div>
                <div className="flex items-center justify-center py-12 text-center">
                    <div>
                        <div className="text-secondary mb-2">No activity data available yet.</div>
                        <div className="text-sm text-secondary">Complete some timer sessions to see your progress!</div>
                        <div className="text-xs text-gray-400 mt-2">Debug: {monthlyData.length} months loaded</div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-surface rounded-lg p-6 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-primary">Past 6 Months Activity</h2>
                </div>
                
                {/* View Toggle */}
                <div className="flex bg-background rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('focus')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                            viewMode === 'focus' 
                                ? 'bg-primary text-white shadow-sm' 
                                : 'text-secondary hover:text-primary'
                        }`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        Focus Time
                    </button>
                    <button
                        onClick={() => setViewMode('sessions')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-1.5 ${
                            viewMode === 'sessions' 
                                ? 'bg-primary text-white shadow-sm' 
                                : 'text-secondary hover:text-primary'
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        Sessions
                    </button>
                </div>
            </div>
            
            {/* Bar Chart */}
            <div className="space-y-6">
                {/* Bars Container */}
                <div className="flex items-end justify-between gap-4 bg-background rounded-lg p-6 overflow-hidden" style={{ height: '240px' }}>
                    {monthlyData.map((monthData, index) => {
                        const value = viewMode === 'focus' ? (monthData.focusTime || 0) : (monthData.sessions || 0);
                        const maxValue = viewMode === 'focus' ? maxFocusTime : maxSessions;
                        const height = getBarHeight(value, maxValue);
                        
                        return (
                            <div 
                                key={`${monthData.year}-${monthData.month}`}
                                className="flex flex-col items-center flex-1 group cursor-pointer"
                                onClick={() => setSelectedMonth(selectedMonth === index ? null : index)}
                            >
                                {/* Bar Container */}
                                <div className="relative w-full flex flex-col items-center" style={{ height: '200px' }}>
                                    <div className="flex-1"></div>
                                    
                                    {/* Bar */}
                                    <div
                                        className={`w-full rounded-t-md transition-all duration-300 hover:scale-105 ${
                                            getBarColor(monthData, value)
                                        } ${selectedMonth === index ? 'ring-2 ring-primary/50' : ''}`}
                                        style={{ height: `${height}px` }}
                                    />
                                    
                                    {/* Current month indicator */}
                                    {monthData.isCurrentMonth && (
                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent rounded-full border-2 border-surface"></div>
                                    )}
                                    
                                    {/* Hover Tooltip */}
                                    <div className="absolute bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                        <div className="font-medium">{monthData.name}</div>
                                        <div className="text-gray-300">
                                            {formatTime(monthData.focusTime || 0)} • {monthData.sessions || 0} sessions
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>
                                
                                {/* Month Label */}
                                <div className="text-xs text-secondary mt-3 font-medium">
                                    {monthData.shortName}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Selected Month Details */}
                {selectedMonth !== null && monthlyData[selectedMonth] && (
                    <div className="bg-background rounded-lg p-4 border border-surface">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-primary flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                {monthlyData[selectedMonth].name}
                            </h3>
                            <button
                                onClick={() => setSelectedMonth(null)}
                                className="text-secondary hover:text-primary text-sm transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary mb-1">
                                    {formatTime(monthlyData[selectedMonth].focusTime || 0)}
                                </div>
                                <div className="text-xs text-secondary">Focus Time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary mb-1">
                                    {monthlyData[selectedMonth].sessions || 0}
                                </div>
                                <div className="text-xs text-secondary">Sessions</div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Legend & Stats */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-accent rounded"></div>
                            <span className="text-secondary">Current Month</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded"></div>
                            <span className="text-secondary">Past Months</span>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <div className="font-semibold text-primary">
                            {viewMode === 'focus' 
                                ? formatTime(monthlyData.reduce((sum, month) => sum + (month.focusTime || 0), 0))
                                : monthlyData.reduce((sum, month) => sum + (month.sessions || 0), 0)
                            }
                        </div>
                        <div className="text-secondary text-xs">
                            Total past 6 months
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
