import { Card, Heading, Tag, HStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { TagColor } from "../../../constants/tags";

interface DynamicBlogCardProps {
    title: string;
    pathParams: string;
    tags: string[];
    description?: string;
}

const DynamicBlogCard = ({ title, pathParams, tags, description }: DynamicBlogCardProps) => {
    const navigate = useNavigate();

    const goToBlog = () => {
        navigate(`/blog/${pathParams}`);
    };

    return (
        <Card.Root width="100%" onClick={goToBlog} cursor="pointer" _hover={{ transform: 'translateY(-2px)', shadow: 'md' }} transition="all 0.2s">
            <Card.Header>
                <HStack gap={2} justifyContent="space-between" alignItems="flex-start">
                    <Heading size="md">{title}</Heading>
                    <HStack gap={2} flexShrink={0}>
                        {tags.map(tag => (
                            // @ts-ignore
                            <Tag.Root key={tag} colorPalette={TagColor[tag] || "gray"}>
                                <Tag.Label>{tag}</Tag.Label>
                            </Tag.Root>
                        ))}
                    </HStack>
                </HStack>
            </Card.Header>
            {description && (
                <Card.Body pt={0}>
                    <Text color="fg.muted" fontSize="sm" overflow="hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{description}</Text>
                </Card.Body>
            )}
        </Card.Root>
    );
};

export default DynamicBlogCard;
