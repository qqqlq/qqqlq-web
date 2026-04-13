import { Box, Heading, Text, VStack, SimpleGrid, Button, Spinner, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import SEO from "../../SEO";
import DynamicBlogCard from "./DynamicBlogCard";
import FadeImage from "./FadeImage";
import { sortPhotos } from "../../../lib/photoUtils";
import type { Photo } from "../../../types";

const Home = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<any[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const qBlogs = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'), limit(3));
        const unsubBlogs = onSnapshot(qBlogs, (snapshot) => {
            setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        const qPhotos = query(collection(db, 'photos'), orderBy('createdAt', 'desc'), limit(10));
        const unsubPhotos = onSnapshot(qPhotos, (snapshot) => {
            const raw = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Photo));
            setPhotos(sortPhotos(raw).slice(0, 3));
        });

        return () => {
            unsubBlogs();
            unsubPhotos();
        };
    }, []);

    return (
        <VStack gap={12} align="stretch" w="100%" py={10}>
            <SEO
                title="ホーム"
                description="qqqlqの技術ブログ・写真ポートフォリオサイト。Web開発、モバイル開発などの技術記事と写真作品を公開しています。"
                path="/"
                type="website"
            />
            {/* Hero Section */}
            <Box
                textAlign="center"
                py={20}
                px={6}
                borderRadius="2xl"
                bg="black"
                color="white"
                boxShadow="xl"
            >
                <Heading size="3xl" mb={4}>Hi, I'm qqqlq</Heading>
                <Text
                    as="a"
                    href="https://www.instagram.com/qqqlq__/"
                    target="_blank"
                    rel="noopener noreferrer"
                    fontSize="lg"
                    opacity={0.8}
                    _hover={{ opacity: 1, textDecoration: "underline" }}
                >
                    📷 @qqqlq__
                </Text>
                {/* <Text fontSize="xl" maxW="2xl" mx="auto" mb={8}>
                    ソフトウェアエンジニア兼アマチュアフォトグラファー。ここには私の日々の技術的な学びや、趣味で撮影した写真のポートフォリオをまとめています。
                </Text> */}
            </Box>

            {loading ? (
                <Center h="20vh"><Spinner size="xl" /></Center>
            ) : (
                <>
                    {/* Photography Preview Section */}
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6} px={4}>
                            <Heading size="xl">Photography</Heading>
                            <Button variant="outline" colorPalette="teal" onClick={() => navigate("/photography")}>
                                View All
                            </Button>
                        </Box>
                        {photos.length === 0 ? (
                            <Text px={4} color="fg.muted">まだ写真がありません。</Text>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} px={4}>
                                {photos.map((photo) => (
                                    <Box
                                        key={photo.id}
                                        borderRadius="xl"
                                        overflow="hidden"
                                        boxShadow="md"
                                        cursor="pointer"
                                        transition="transform 0.2s"
                                        _hover={{ transform: "translateY(-4px)" }}
                                        onClick={() => navigate("/photography")}
                                    >
                                        <FadeImage
                                            src={photo.url}
                                            alt={photo.title}
                                            objectFit="cover"
                                            h="250px"
                                            w="100%"
                                        />
                                    </Box>
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>

                    {/* Tech Blog Preview Section */}
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6} px={4}>
                            <Heading size="xl">Tech Blog</Heading>
                            <Button variant="outline" colorPalette="blue" onClick={() => navigate("/blog/tag")}>
                                Read More
                            </Button>
                        </Box>

                        <Box px={4}>
                            {blogs.length === 0 ? (
                                <Text color="fg.muted">まだ記事がありません。</Text>
                            ) : (
                                <VStack gap={4} align="stretch">
                                    {blogs.map(blog => (
                                        <DynamicBlogCard
                                            key={blog.id}
                                            title={blog.title}
                                            pathParams={blog.pathParams}
                                            tags={blog.tags}
                                            description={blog.description}
                                        />
                                    ))}
                                </VStack>
                            )}
                        </Box>
                    </Box>
                </>
            )}
        </VStack>
    );
};

export default Home;
