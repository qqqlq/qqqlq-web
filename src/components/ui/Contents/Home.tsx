import { Box, Heading, Text, VStack, SimpleGrid, Image, Button, Spinner, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import DynamicBlogCard from "./DynamicBlogCard";

const Home = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<any[]>([]);
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const qBlogs = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'), limit(3));
        const unsubBlogs = onSnapshot(qBlogs, (snapshot) => {
            setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        const qPhotos = query(collection(db, 'photos'), orderBy('createdAt', 'desc'), limit(3));
        const unsubPhotos = onSnapshot(qPhotos, (snapshot) => {
            setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubBlogs();
            unsubPhotos();
        };
    }, []);

    return (
        <VStack gap={12} align="stretch" w="100%" py={10}>
            {/* Hero Section */}
            <Box
                textAlign="center"
                py={20}
                px={6}
                borderRadius="2xl"
                bgGradient="to-r"
                gradientFrom="teal.500"
                gradientTo="blue.500"
                color="white"
                boxShadow="xl"
            >
                <Heading size="3xl" mb={6}>Hi, I'm qqqlq</Heading>
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
                                        <Image
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
