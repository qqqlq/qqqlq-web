import { Box, Heading, Text, SimpleGrid, Image, VStack, Spinner, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const Photography = () => {
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <VStack gap={8} align="stretch" w="100%" pb={10}>
            <Box textAlign="center" pt={10} pb={6}>
                <Heading size="2xl" mb={4}>Photography</Heading>
                <Text color="fg.muted" fontSize="lg">
                    趣味で撮影した写真のギャラリーです。
                </Text>
            </Box>

            {
                loading ? (
                    <Center h="50vh">
                        <Spinner size="xl" />
                    </Center>
                ) : photos.length === 0 ? (
                    <Center h="20vh">
                        <Text color="fg.muted">まだ写真がありません。</Text>
                    </Center>
                ) : (
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6} px={4}>
                        {photos.map((photo) => (
                            <Box
                                key={photo.id}
                                overflow="hidden"
                                borderRadius="xl"
                                boxShadow="md"
                                cursor="pointer"
                                transition="all 0.3s ease"
                                _hover={{ transform: "scale(1.02)", boxShadow: "xl" }}
                            >
                                <Image
                                    src={photo.url}
                                    alt={photo.title}
                                    objectFit="cover"
                                    w="100%"
                                    h={{ base: "300px", md: "400px" }}
                                />
                            </Box>
                        ))}
                    </SimpleGrid>
                )
            }
        </VStack>
    );
};

export default Photography;
