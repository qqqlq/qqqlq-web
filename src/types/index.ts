import { Timestamp } from 'firebase/firestore';

export interface Blog {
    id: string;
    title: string;
    pathParams: string;
    description: string;
    tags: string[];
    content: string;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    published: boolean;
}

export interface Photo {
    id: string;
    title: string;
    description: string;
    url: string;
    storagePath?: string;
    createdAt: Timestamp;
    order?: number;
    pinned?: boolean;
}
