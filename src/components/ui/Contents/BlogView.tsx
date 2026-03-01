import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import BlogHead from './BlogHead';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Spinner, Center, Text, Box } from '@chakra-ui/react';

const BlogView = () => {
    const { path } = useParams<{ path: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Theme detection for github-markdown-css
        const detectTheme = () => {
            const isDark = document.documentElement.classList.contains('dark') ||
                document.documentElement.getAttribute('data-theme') === 'dark';
            return isDark ? 'dark' : 'light';
        };

        setTheme(detectTheme());
        const observer = new MutationObserver(() => setTheme(detectTheme()));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const existingLink = document.getElementById('github-markdown-css');
        if (existingLink) existingLink.remove();

        const link = document.createElement('link');
        link.id = 'github-markdown-css';
        link.rel = 'stylesheet';
        link.href = theme === 'dark'
            ? 'https://cdn.jsdelivr.net/npm/github-markdown-css@5/github-markdown-dark.css'
            : 'https://cdn.jsdelivr.net/npm/github-markdown-css@5/github-markdown-light.css';

        document.head.appendChild(link);
        return () => link.remove();
    }, [theme]);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!path) return;
            try {
                const q = query(collection(db, 'blogs'), where('pathParams', '==', path));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setBlog({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
                } else {
                    setBlog(null);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [path]);

    if (loading) return <Center h="50vh"><Spinner size="xl" /></Center>;

    if (!blog) return (
        <Center h="50vh" flexDir="column" gap={4}>
            <Text fontSize="xl" color="fg.muted">記事が見つかりませんでした。</Text>
            <Text cursor="pointer" color="blue.500" onClick={() => navigate('/blog')}>ブログ一覧に戻る</Text>
        </Center>
    );

    return (
        <Box w="100%">
            <BlogHead title={blog.title} params={blog.pathParams} tags={blog.tags || []} />
            <Box className="markdown-body" mt={8} bg="transparent">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {blog.content}
                </ReactMarkdown>
            </Box>
        </Box>
    );
};

export default BlogView;
