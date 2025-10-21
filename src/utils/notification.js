// src/utils/notifications.js
class NotificationManager {
    constructor() {
        this.isEnabled = true;
        this.permission = 'default';
        this.init();
    }

    async init() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
            console.log('Notification permission:', this.permission);
        } else {
            console.warn('Browser does not support notifications');
        }
    }

    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('Browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            console.log('🔔 Notification permission:', permission);
            return permission === 'granted';
        }

        return false;
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
        console.log('🔔 Notifications enabled:', enabled);
    }

    async showNotification({ title, body, icon, tag }) {
        if (!this.isEnabled) {
            console.log('🔕 Notifications disabled');
            return;
        }

        if (!('Notification' in window)) {
            console.warn('Browser does not support notifications');
            return;
        }

        // Request permission if not granted
        if (Notification.permission !== 'granted') {
            const granted = await this.requestPermission();
            if (!granted) {
                console.log('Notification permission denied');
                return;
            }
        }

        try {
            const notification = new Notification(title, {
                body,
                icon: icon || '/favicon.ico',
                tag: tag || 'dorofi-notification',
                badge: '/favicon.ico',
                silent: true, // We handle sound separately
                requireInteraction: false,
                timestamp: Date.now()
            });

            // Auto-close after 5 seconds
            setTimeout(() => notification.close(), 5000);

            // Click handler - focus the window
            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            console.log('Notification shown:', title);
        } catch (error) {
            console.error('❌ Notification error:', error);
        }
    }

    // Specific notification types
    async showWorkComplete() {
        await this.showNotification({
            title: '🎯 Focus Session Complete!',
            body: 'Great work! Time for a well-deserved break.',
            tag: 'work-complete'
        });
    }

    async showBreakComplete() {
        await this.showNotification({
            title: '⏰ Break Time Over!',
            body: 'Ready to focus again? Let\'s get back to work.',
            tag: 'break-complete'
        });
    }

    async showLongBreakComplete() {
        await this.showNotification({
            title: '🌟 Long Break Complete!',
            body: 'Refreshed and ready! Time to start a new session.',
            tag: 'long-break-complete'
        });
    }
}

// Export singleton instance
export const notificationManager = new NotificationManager();
export default notificationManager;
