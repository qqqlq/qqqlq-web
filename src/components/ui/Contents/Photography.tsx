import { Box, Heading, Text, SimpleGrid, Image, VStack } from "@chakra-ui/react";
import { DUMMY_PHOTOS } from "../../../constants/photos";

const Photography = () => {
    return (
        <VStack gap={8} align="stretch" w="100%" pb={10}>
            <Box textAlign="center" pt={10} pb={6}>
                <Heading size="2xl" mb={4}>Photography</Heading>
                <Text color="fg.muted" fontSize="lg">
                    趣味で撮影した写真のギャラリーです。
                </Text>
            </Box>

            {/* Masonry-like SimpleGrid layout */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6} px={4}>
                {DUMMY_PHOTOS.map((photo) => (
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
        </VStack>
    );
};

export default Photography;
