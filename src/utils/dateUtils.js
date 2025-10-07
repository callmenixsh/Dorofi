// src/utils/dateUtils.js
export const getToday = () => {
    return new Date().toDateString();
};

export const getTodayKey = () => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const isToday = (dateString) => {
    const today = new Date().toDateString();
    const date = new Date(dateString).toDateString();
    return today === date;
};

export const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString();
};
