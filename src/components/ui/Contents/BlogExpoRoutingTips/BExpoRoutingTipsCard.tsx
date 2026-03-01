import { Card, Heading, Tag, HStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { getTagColor } from "../../../../constants/tags";

const BExpoRoutingTipsCard = () => {

  const navigate = useNavigate();

  const goToBlog = () => {
    navigate("/blog/expo-routing-tips");
  };

  // タグ色々
  const tags = ["Expo", "expo-router", "ルーティング", "React Native"];

  return (
    <>
      <Card.Root width="100%" onClick={goToBlog} cursor="pointer">
        <Card.Header>
          <HStack gap={2} justifyContent="space-between">
            <Heading size="md">expo-router tips</Heading>
            <HStack gap={2}>
              {tags.map(tag => (
                <Tag.Root key={tag} cursor="pointer" colorPalette={getTagColor(tag)}>
                  <Tag.Label>{tag}</Tag.Label>
                </Tag.Root>
              ))}
            </HStack>
          </HStack>
        </Card.Header>
        <Card.Body color="fg.muted">
          expo-routerのルーティングのTips
        </Card.Body>
      </Card.Root>
    </>
  )
}
export default BExpoRoutingTipsCard;