import { Box, Heading, Button, VStack, Flex, Text, Card, Image, HStack, IconButton } from '@chakra-ui/react';
import { auth, db, storage } from '../../../lib/firebase';
import SEO from '../../SEO';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiArrowUp, FiArrowDown, FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import ConfirmDialog from './ConfirmDialog';
import { extractStoragePathFromUrl } from '../../../lib/storageUtils';
import { sortPhotos } from '../../../lib/photoUtils';
import type { Blog, Photo } from '../../../types';

const Dashboard = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);

    const [blogDeleteTarget, setBlogDeleteTarget] = useState<{ id: string; title: string } | null>(null);
    const [blogDeleteLoading, setBlogDeleteLoading] = useState(false);

    const [photoDeleteTarget, setPhotoDeleteTarget] = useState<Photo | null>(null);
    const [photoDeleteLoading, setPhotoDeleteLoading] = useState(false);

    useEffect(() => {
        const qBlogs = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
        const unsubBlogs = onSnapshot(qBlogs, (snapshot) => {
            setBlogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Blog)));
        });

        const qPhotos = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
        const unsubPhotos = onSnapshot(qPhotos, (snapshot) => {
            const raw = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Photo));
            setPhotos(sortPhotos(raw));
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

    const handleBlogDelete = async () => {
        if (!blogDeleteTarget) return;
        setBlogDeleteLoading(true);
        try {
            await deleteDoc(doc(db, 'blogs', blogDeleteTarget.id));
        } catch (err) {
            console.error(err);
        } finally {
            setBlogDeleteLoading(false);
            setBlogDeleteTarget(null);
        }
    };

    const handlePhotoDelete = async () => {
        if (!photoDeleteTarget) return;
        setPhotoDeleteLoading(true);
        try {
            const storagePath = photoDeleteTarget.storagePath ?? extractStoragePathFromUrl(photoDeleteTarget.url);
            if (storagePath) {
                try {
                    await deleteObject(ref(storage, storagePath));
                } catch {
                    // ファイルが既に存在しない場合は無視
                }
            }
            await deleteDoc(doc(db, 'photos', photoDeleteTarget.id));
        } catch (err) {
            console.error(err);
        } finally {
            setPhotoDeleteLoading(false);
            setPhotoDeleteTarget(null);
        }
    };

    const handlePinToggle = async (photo: Photo) => {
        await updateDoc(doc(db, 'photos', photo.id), { pinned: !(photo.pinned ?? false) });
    };

    const handlePhotoMove = async (index: number, direction: 'up' | 'down') => {
        const sorted = [...photos];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= sorted.length) return;

        const current = sorted[index];
        const neighbor = sorted[targetIndex];

        // ピングループをまたぐ移動はしない
        if ((current.pinned ?? false) !== (neighbor.pinned ?? false)) return;

        const currentOrder = current.order ?? current.createdAt?.toMillis?.() ?? 0;
        const neighborOrder = neighbor.order ?? neighbor.createdAt?.toMillis?.() ?? 0;

        // 中間値を計算して入れ替え
        const newCurrentOrder = neighborOrder;
        const newNeighborOrder = currentOrder;

        await Promise.all([
            updateDoc(doc(db, 'photos', current.id), { order: newCurrentOrder }),
            updateDoc(doc(db, 'photos', neighbor.id), { order: newNeighborOrder }),
        ]);
    };

    return (
        <VStack gap={8} align="stretch" py={10}>
            <SEO title="Admin Dashboard" description="" path="/admin" noindex={true} />
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
                {/* ブログ一覧 */}
                <Box flex={1}>
                    <Heading size="md" mb={4}>ブログ記事一覧</Heading>
                    <VStack align="stretch" gap={3}>
                        {blogs.map(blog => (
                            <Card.Root key={blog.id} size="sm">
                                <Card.Body>
                                    <Flex justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Heading size="sm">{blog.title}</Heading>
                                            <Text color="fg.muted" fontSize="sm">/{blog.pathParams}</Text>
                                        </Box>
                                        <HStack gap={1}>
                                            <IconButton
                                                aria-label="編集"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => navigate(`/admin/blog/edit/${blog.id}`)}
                                            >
                                                <FiEdit2 />
                                            </IconButton>
                                            <IconButton
                                                aria-label="削除"
                                                size="sm"
                                                variant="ghost"
                                                colorPalette="red"
                                                onClick={() => setBlogDeleteTarget({ id: blog.id, title: blog.title })}
                                            >
                                                <FiTrash2 />
                                            </IconButton>
                                        </HStack>
                                    </Flex>
                                </Card.Body>
                            </Card.Root>
                        ))}
                        {blogs.length === 0 && <Text color="fg.muted">投稿がありません。</Text>}
                    </VStack>
                </Box>

                {/* 写真一覧 */}
                <Box flex={1}>
                    <Heading size="md" mb={4}>写真一覧</Heading>
                    <VStack align="stretch" gap={3}>
                        {photos.map((photo, index) => (
                            <Card.Root key={photo.id} size="sm">
                                <Card.Body>
                                    <Flex justifyContent="space-between" alignItems="center">
                                        <HStack gap={3}>
                                            {photo.url && (
                                                <Image
                                                    src={photo.url}
                                                    alt={photo.title}
                                                    boxSize="60px"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                    flexShrink={0}
                                                />
                                            )}
                                            <Box>
                                                <HStack gap={1} mb={0.5}>
                                                    {photo.pinned && (
                                                        <Box color="yellow.500" fontSize="xs">
                                                            <FaStar />
                                                        </Box>
                                                    )}
                                                    <Heading size="sm">{photo.title}</Heading>
                                                </HStack>
                                                {photo.description && <Text fontSize="xs" color="fg.muted" mt={1}>{photo.description}</Text>}
                                            </Box>
                                        </HStack>
                                        <HStack gap={1}>
                                            {/* 上下移動 */}
                                            <IconButton
                                                aria-label="上へ"
                                                size="sm"
                                                variant="ghost"
                                                disabled={index === 0 || (photo.pinned ?? false) !== (photos[index - 1]?.pinned ?? false)}
                                                onClick={() => handlePhotoMove(index, 'up')}
                                            >
                                                <FiArrowUp />
                                            </IconButton>
                                            <IconButton
                                                aria-label="下へ"
                                                size="sm"
                                                variant="ghost"
                                                disabled={index === photos.length - 1 || (photo.pinned ?? false) !== (photos[index + 1]?.pinned ?? false)}
                                                onClick={() => handlePhotoMove(index, 'down')}
                                            >
                                                <FiArrowDown />
                                            </IconButton>
                                            {/* ピン留め */}
                                            <IconButton
                                                aria-label={photo.pinned ? 'ピン留めを外す' : 'ピン留め'}
                                                size="sm"
                                                variant="ghost"
                                                colorPalette="yellow"
                                                onClick={() => handlePinToggle(photo)}
                                            >
                                                {photo.pinned ? <FaStar /> : <FiStar />}
                                            </IconButton>
                                            {/* 削除 */}
                                            <IconButton
                                                aria-label="削除"
                                                size="sm"
                                                variant="ghost"
                                                colorPalette="red"
                                                onClick={() => setPhotoDeleteTarget(photo)}
                                            >
                                                <FiTrash2 />
                                            </IconButton>
                                        </HStack>
                                    </Flex>
                                </Card.Body>
                            </Card.Root>
                        ))}
                        {photos.length === 0 && <Text color="fg.muted">写真がありません。</Text>}
                    </VStack>
                </Box>
            </Flex>

            {/* ブログ削除確認ダイアログ */}
            <ConfirmDialog
                open={blogDeleteTarget !== null}
                onClose={() => setBlogDeleteTarget(null)}
                onConfirm={handleBlogDelete}
                title="記事を削除しますか？"
                description={`「${blogDeleteTarget?.title ?? ''}」を削除します。この操作は取り消せません。`}
                loading={blogDeleteLoading}
            />

            {/* 写真削除確認ダイアログ */}
            <ConfirmDialog
                open={photoDeleteTarget !== null}
                onClose={() => setPhotoDeleteTarget(null)}
                onConfirm={handlePhotoDelete}
                title="写真を削除しますか？"
                description={`「${photoDeleteTarget?.title ?? ''}」を削除します。Storageからも完全に削除されます。この操作は取り消せません。`}
                loading={photoDeleteLoading}
            />
        </VStack>
    );
};

export default Dashboard;
