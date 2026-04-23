const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const envBase = import.meta.env.VITE_API_BASE_URL?.trim();

const defaultBase = `${window.location.protocol}//${window.location.hostname}:5000/api`;

export const API_BASE = trimTrailingSlash(envBase || defaultBase);

export const apiUrl = (path = '') => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE}${normalizedPath}`;
};