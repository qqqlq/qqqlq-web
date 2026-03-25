import type { Photo } from '../types';

export function sortPhotos(photos: Photo[]): Photo[] {
    return [...photos].sort((a, b) => {
        const aPinned = a.pinned ?? false;
        const bPinned = b.pinned ?? false;

        if (aPinned !== bPinned) return bPinned ? 1 : -1;

        const aOrder = a.order ?? a.createdAt?.toMillis?.() ?? 0;
        const bOrder = b.order ?? b.createdAt?.toMillis?.() ?? 0;

        return aOrder - bOrder;
    });
}
