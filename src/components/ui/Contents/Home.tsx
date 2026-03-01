import { Box, Heading, Text, VStack, SimpleGrid, Image, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DUMMY_PHOTOS } from "../../../constants/photos";
import BExpoRoutingTipsCard from "./BlogExpoRoutingTips/BExpoRoutingTipsCard";
import BExpoRoutingCard from "./BlogExpoRouting/BExpoRoutingCard";
import BMDCard from "./BlogMD/BMDCard";

const Home = () => {
    const navigate = useNavigate();

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
                <Text fontSize="xl" maxW="2xl" mx="auto" mb={8}>
                    ソフトウェアエンジニア兼アマチュアフォトグラファー。ここには私の日々の技術的な学びや、趣味で撮影した写真のポートフォリオをまとめています。
                </Text>
            </Box>

            {/* Photography Preview Section */}
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={6} px={4}>
                    <Heading size="xl">Photography</Heading>
                    <Button variant="outline" colorPalette="teal" onClick={() => navigate("/photography")}>
                        View All
                    </Button>
                </Box>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} px={4}>
                    {DUMMY_PHOTOS.slice(0, 3).map((photo) => (
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
            </Box>

            {/* Tech Blog Preview Section */}
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={6} px={4}>
                    <Heading size="xl">Tech Blog</Heading>
                    <Button variant="outline" colorPalette="blue" onClick={() => navigate("/blog")}>
                        Read More
                    </Button>
                </Box>

                <Box px={4}>
                    <VStack gap={4} align="stretch">
                        <BExpoRoutingTipsCard />
                        <BExpoRoutingCard />
                        <BMDCard />
                    </VStack>
                </Box>
            </Box>

        </VStack>
    );
};

export default Home;
