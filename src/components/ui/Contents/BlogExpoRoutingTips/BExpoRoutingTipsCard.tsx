import { Card, Heading, Tag, HStack, VStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { getTagColor } from "../../../../constants/tags";

const BExpoRoutingTipsCard = () => {
  const navigate = useNavigate();
  const tags = ["Expo", "expo-router", "ルーティング", "React Native"];

  return (
    <>
      <Card.Root width="100%" onClick={() => navigate("/blog/expo-routing-tips")} cursor="pointer" _hover={{ transform: 'translateY(-2px)', shadow: 'md' }} transition="all 0.2s">
        <Card.Body>
          <VStack align="start" gap={2}>
            <Heading size="md">expo-router tips</Heading>
            <HStack gap={2} wrap="wrap">
              {tags.map(tag => (
                <Tag.Root key={tag} cursor="pointer" colorPalette={getTagColor(tag)}>
                  <Tag.Label>{tag}</Tag.Label>
                </Tag.Root>
              ))}
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </>
  )
}
export default BExpoRoutingTipsCard;