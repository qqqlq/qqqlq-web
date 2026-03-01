import { Card, Heading, Tag, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { TagColor } from "../../../constants/tags";

interface DynamicBlogCardProps {
    title: string;
    pathParams: string;
    tags: string[];
}

const DynamicBlogCard = ({ title, pathParams, tags }: DynamicBlogCardProps) => {
    const navigate = useNavigate();

    const goToBlog = () => {
        navigate(`/blog/${pathParams}`);
    };

    return (
        <Card.Root width="100%" onClick={goToBlog} cursor="pointer" _hover={{ transform: 'translateY(-2px)', shadow: 'md' }} transition="all 0.2s">
            <Card.Header>
                <HStack gap={2} justifyContent="space-between">
                    <Heading size="md">{title}</Heading>
                    <HStack gap={2}>
                        {tags.map(tag => (
                            // @ts-ignore
                            <Tag.Root key={tag} colorPalette={TagColor[tag] || "gray"}>
                                <Tag.Label>{tag}</Tag.Label>
                            </Tag.Root>
                        ))}
                    </HStack>
                </HStack>
            </Card.Header>
        </Card.Root>
    );
};

export default DynamicBlogCard;
