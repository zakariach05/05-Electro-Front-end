import { API_URL } from './api';

const API_BASE = API_URL.replace(/\/api\/?$/, '');

export function getImageUrl(image) {
    if (!image) return '';
    // already absolute
    if (/^https?:\/\//i.test(image)) return image;
    // relative path starting with / -> prefix with API base
    if (image.startsWith('/')) return API_BASE + image;
    // storage paths like storage/..., products/...
    return API_BASE + '/storage/' + image.replace(/^\/+/, '');
}

export default getImageUrl;
