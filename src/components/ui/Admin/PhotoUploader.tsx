import { useState } from 'react';
import { Box, Button, Input, VStack, Heading, Textarea, Flex, HStack, Image } from '@chakra-ui/react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../lib/firebase';
import { useNavigate } from 'react-router-dom';

const PhotoUploader = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file || !title) {
            setError('写真ファイルとタイトルは必須です。');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Upload to Firebase Storage
            const storageRef = ref(storage, `photos/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(snapshot.ref);

            // Save Metadata to Firestore
            await addDoc(collection(db, 'photos'), {
                title,
                description,
                url: downloadUrl,
                createdAt: serverTimestamp(),
            });

            alert('写真をアップロードしました！');
            navigate('/admin');
        } catch (err) {
            console.error(err);
            setError('アップロードに失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack gap={6} align="stretch" py={8} maxW="3xl" mx="auto">
            <Flex justifyContent="space-between" alignItems="center">
                <Heading>写真をアップロード</Heading>
                <HStack gap={4}>
                    <Button variant="outline" onClick={() => navigate('/admin')}>キャンセル</Button>
                    <Button colorPalette="blue" onClick={handleUpload} loading={loading}>
                        アップロード
                    </Button>
                </HStack>
            </Flex>

            {error && <Box color="red.500">{error}</Box>}

            <Box borderWidth={1} p={6} borderRadius="lg" borderStyle="dashed" textAlign="center">
                <Input type="file" accept="image/*" onChange={handleFileChange} mb={4} p={1} />
                {previewUrl && (
                    <Box mt={4} maxH="400px" overflow="hidden" borderRadius="md">
                        <Image src={previewUrl} alt="Preview" objectFit="contain" maxH="400px" mx="auto" />
                    </Box>
                )}
            </Box>

            <Input
                placeholder="写真のタイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
                placeholder="写真の説明（任意）"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
            />
        </VStack>
    );
};

export default PhotoUploader;
