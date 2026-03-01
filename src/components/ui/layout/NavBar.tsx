import {
    Box,
    Flex,
    Stack,
    Avatar,
    AvatarImage,
} from "@chakra-ui/react"
import {
    ColorModeButton,
    useColorModeValue,
} from "@/components/ui/color-mode"
import classes from "./NavBar.module.scss";
import { useNavigate } from "react-router-dom";

// ナビゲーションバー本体
const NavBar = () => {

    const navigate = useNavigate();

    const goToTop = () => {
        navigate("/")
    };

    return (
        <>
            <Box bg={useColorModeValue('gray.200', 'gray.900')} px={4}>
                <Flex h={16} alignItems="center" justifyContent="space-between">
                    <Box className={classes.NavBarTitle} onClick={goToTop} cursor="pointer" >Node Walker</Box>
                    <Stack direction="row" alignItems="center">
                        <ColorModeButton />
                        <Avatar.Root onClick={() => window.open('https://github.com/qqqlq')}>
                            <Avatar.Fallback name="QQQLQ" />
                            <AvatarImage src="/qqqlq_icon.jpg" />
                        </Avatar.Root>
                    </Stack>
                </Flex>
            </Box>
        </>
    )
}

export default NavBar