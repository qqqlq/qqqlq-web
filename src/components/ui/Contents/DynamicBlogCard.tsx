import { Card, Heading, Tag, HStack, VStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getTagColor } from "../../../constants/tags";

interface DynamicBlogCardProps {
    title: string;
    pathParams: string;
    tags: string[];
    description?: string;
}

const DynamicBlogCard = ({ title, pathParams, tags, description }: DynamicBlogCardProps) => {
    const navigate = useNavigate();

    return (
        <Card.Root
            width="100%"
            onClick={() => navigate(`/blog/${pathParams}`)}
            cursor="pointer"
            _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
            transition="all 0.2s"
        >
            <Card.Body>
                <VStack align="start" gap={2}>
                    {/* タイトル */}
                    <Heading size="md">{title}</Heading>

                    {/* タグ（タイトルの直下） */}
                    <HStack gap={2} wrap="wrap">
                        {tags.map(tag => (
                            // @ts-ignore
                            <Tag.Root key={tag} colorPalette={getTagColor(tag)}>
                                <Tag.Label>{tag}</Tag.Label>
                            </Tag.Root>
                        ))}
                    </HStack>

                    {/* 概要（タグの下） */}
                    {description && (
                        <Text
                            color="fg.muted"
                            fontSize="sm"
                            overflow="hidden"
                            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                        >
                            {description}
                        </Text>
                    )}
                </VStack>
            </Card.Body>
        </Card.Root>
    );
};

export default DynamicBlogCard;
