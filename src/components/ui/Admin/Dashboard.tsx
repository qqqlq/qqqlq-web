import { Box, Heading, Button, VStack, Flex, Text, Card } from '@chakra-ui/react';
import { auth, db } from '../../../lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<any[]>([]);
    const [photos, setPhotos] = useState<any[]>([]);

    useEffect(() => {
        // Blogs
        const qBlogs = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
        const unsubBlogs = onSnapshot(qBlogs, (snapshot) => {
            setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Photos
        const qPhotos = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
        const unsubPhotos = onSnapshot(qPhotos, (snapshot) => {
            setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubBlogs();
            unsubPhotos();
        };
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin/login');
    };

    return (
        <VStack gap={8} align="stretch" py={10}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Heading>Admin Dashboard</Heading>
                <Button colorPalette="red" variant="outline" onClick={handleLogout}>Logout</Button>
            </Box>

            <Box>
                <Heading size="md" mb={4}>コンテンツの追加</Heading>
                <Flex gap={4}>
                    <Button colorPalette="teal" onClick={() => navigate('/admin/blog/new')}>新しい記事を書く</Button>
                    <Button colorPalette="blue" onClick={() => navigate('/admin/photography/new')}>写真をアップロード</Button>
                </Flex>
            </Box>

            <Flex gap={8} direction={{ base: "column", md: "row" }}>
                <Box flex={1}>
                    <Heading size="md" mb={4}>ブログ記事一覧</Heading>
                    <VStack align="stretch" gap={3}>
                        {blogs.map(blog => (
                            <Card.Root key={blog.id} size="sm">
                                <Card.Body>
                                    <Heading size="sm">{blog.title}</Heading>
                                    <Text color="fg.muted" fontSize="sm">/{blog.pathParams}</Text>
                                </Card.Body>
                            </Card.Root>
                        ))}
                        {blogs.length === 0 && <Text color="fg.muted">投稿がありません。</Text>}
                    </VStack>
                </Box>

                <Box flex={1}>
                    <Heading size="md" mb={4}>写真一覧</Heading>
                    <VStack align="stretch" gap={3}>
                        {photos.map(photo => (
                            <Card.Root key={photo.id} size="sm">
                                <Card.Body>
                                    <Heading size="sm">{photo.title}</Heading>
                                </Card.Body>
                            </Card.Root>
                        ))}
                        {photos.length === 0 && <Text color="fg.muted">写真がありません。</Text>}
                    </VStack>
                </Box>
            </Flex>
        </VStack>
    );
};

export default Dashboard;
