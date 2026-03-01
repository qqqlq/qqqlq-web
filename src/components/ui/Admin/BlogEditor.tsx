import { useState } from 'react';
import { Box, Button, Input, VStack, Heading, Textarea, Flex, HStack } from '@chakra-ui/react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogEditor = () => {
    const [title, setTitle] = useState('');
    const [pathParams, setPathParams] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handlePublish = async () => {
        if (!title || !content || !pathParams) {
            setError('タイトル、パス(URL)、本文は必須です。');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);

            await addDoc(collection(db, 'blogs'), {
                title,
                pathParams,
                tags,
                content,
                createdAt: serverTimestamp(),
                published: true
            });

            alert('記事を投稿しました！');
            navigate('/admin');
        } catch (err) {
            console.error(err);
            setError('記事の投稿に失敗しました。Firestoreのルール設定等を確認してください。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack gap={6} align="stretch" py={8} h="90vh">
            <Flex justifyContent="space-between" alignItems="center">
                <Heading>新しい記事を投稿</Heading>
                <HStack gap={4}>
                    <Button variant="outline" onClick={() => navigate('/admin')}>キャンセル</Button>
                    <Button colorPalette="blue" onClick={handlePublish} loading={loading}>
                        公開する
                    </Button>
                </HStack>
            </Flex>

            {error && <Box color="red.500">{error}</Box>}

            <HStack gap={4}>
                <Input placeholder="記事のタイトル" value={title} onChange={(e) => setTitle(e.target.value)} flex={2} />
                <Input placeholder="URLのパス (例: my-new-post)" value={pathParams} onChange={(e) => setPathParams(e.target.value)} flex={1} />
                <Input placeholder="タグ (カンマ区切り)" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} flex={1} />
            </HStack>

            <Flex gap={4} flex={1} minH="0">
                {/* Editor Tab */}
                <Box flex={1} display="flex" flexDirection="column">
                    <Heading size="sm" mb={2}>Markdown 本文</Heading>
                    <Textarea
                        flex={1}
                        placeholder="マークダウンで記述してください..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fontFamily="monospace"
                        resize="none"
                    />
                </Box>

                {/* Preview Tab */}
                <Box flex={1} display="flex" flexDirection="column" overflowY="auto" borderWidth={1} p={4} borderRadius="md" bg="gray.50" _dark={{ bg: "gray.800" }}>
                    <Heading size="sm" mb={2} color="fg.muted">プレビュー</Heading>
                    <Box className="markdown-body" bg="transparent">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content || '*プレビューがここに表示されます*'}
                        </ReactMarkdown>
                    </Box>
                </Box>
            </Flex>
        </VStack>
    );
};

export default BlogEditor;
