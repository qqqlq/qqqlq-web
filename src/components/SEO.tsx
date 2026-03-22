import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://blog.nodewalker.app';
const SITE_NAME = 'NodeWalker Web';
const DEFAULT_IMAGE = `${SITE_URL}/qqqlq_icon.jpg`;
const DEFAULT_DESCRIPTION = 'qqqlqの技術ブログ・写真ポートフォリオサイト。Web開発、モバイル開発などの技術記事と写真作品を公開しています。';

interface SEOProps {
    title?: string;
    description?: string;
    path: string;
    image?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    tags?: string[];
    noindex?: boolean;
    jsonLd?: Record<string, unknown>;
}

const SEO = ({ title, description, path, image, type = 'website', publishedTime, tags, noindex, jsonLd }: SEOProps) => {
    const url = `${SITE_URL}${path}`;
    const ogImage = image || DEFAULT_IMAGE;
    const desc = description || DEFAULT_DESCRIPTION;
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            <link rel="canonical" href={url} />
            {noindex && <meta name="robots" content="noindex,nofollow" />}

            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="ja_JP" />
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {tags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}

            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={ogImage} />

            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
