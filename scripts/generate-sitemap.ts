/**
 * ビルド時にFirebaseからブログ記事一覧を取得し、sitemap.xmlを生成するスクリプト。
 * 使い方: tsx scripts/generate-sitemap.ts
 * package.jsonのbuildスクリプトから実行される。
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://blog.nodewalker.app';

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

async function generateSitemap() {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const staticRoutes = [
        { path: '/', priority: '1.0', changefreq: 'weekly' },
        { path: '/blog', priority: '0.8', changefreq: 'weekly' },
        { path: '/photography', priority: '0.7', changefreq: 'weekly' },
    ];

    let blogRoutes: { path: string; priority: string; changefreq: string }[] = [];
    try {
        const snapshot = await getDocs(collection(db, 'blogs'));
        blogRoutes = snapshot.docs
            .map(doc => doc.data().pathParams as string)
            .filter(Boolean)
            .map(slug => ({
                path: `/blog/${slug}`,
                priority: '0.6',
                changefreq: 'monthly',
            }));
        console.log(`Fetched ${blogRoutes.length} blog articles from Firebase.`);
    } catch (err) {
        console.warn('Firebase fetch failed, generating sitemap without blog articles:', err);
    }

    const allRoutes = [...staticRoutes, ...blogRoutes];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

    const outPath = resolve(__dirname, '../dist/sitemap.xml');
    writeFileSync(outPath, sitemap, 'utf-8');
    console.log(`sitemap.xml generated at ${outPath} (${allRoutes.length} URLs)`);
    process.exit(0);
}

generateSitemap().catch(err => {
    console.error('sitemap generation failed:', err);
    process.exit(1);
});
