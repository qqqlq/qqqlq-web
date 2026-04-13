import {
    Box,
    Flex,
    Stack
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { FaXTwitter, FaGithub, FaInstagram } from "react-icons/fa6";

const Footer = () => {
    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={2} mt="auto" >
                <Flex h={7} alignItems="center" justifyContent="space-between">
                    <Box fontSize="sm">Node Walker</Box>
                <Stack direction="row" alignItems="center" gap={3}>
                    <Box
                        as="button"
                        onClick={() => window.open('https://github.com/chihiroyasu', '_blank')}
                        cursor="pointer"
                        fontSize="lg"
                        _hover={{ color: 'gray.500' }}
                    >
                        <FaGithub />
                    </Box>
                    <Box
                        as="button"
                        onClick={() => window.open('https://twitter.com/qqqlq', '_blank')}
                        cursor="pointer"
                        fontSize="lg"
                        _hover={{ color: 'gray.500' }}
                    >
                        <FaXTwitter />
                    </Box>
                    <Box
                        as="button"
                        onClick={() => window.open('https://www.instagram.com/qqqlq__/', '_blank')}
                        cursor="pointer"
                        fontSize="lg"
                        _hover={{ color: 'gray.500' }}
                    >
                        <FaInstagram />
                    </Box>
                </Stack>
                </Flex>
            </Box>
        </>
    )
};

export default Footer;