import { Card, Heading, Tag, HStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { TagColor } from "../../../../constants/tags";

const BExpoRoutingCard = () => {

  const navigate = useNavigate();

  const goToBlog = () => {
    navigate("/blog/expo-routing-basic");
  };

  // タグ色々
  const tags = ["Expo", "expo-router", "ルーティング", "React Native"];

  return (
    <>
      <Card.Root width="100%" onClick={goToBlog} cursor="pointer">
        <Card.Header>
          <HStack gap={2} justifyContent="space-between">
            <Heading size="md">Expo動的ルーティング</Heading>
            <HStack gap={2}>
              {tags.map(tag => (
                <Tag.Root key={tag} cursor="pointer" colorPalette={TagColor[tag] || "gray"}>
                  <Tag.Label>{tag}</Tag.Label>
                </Tag.Root>
              ))}
            </HStack>
          </HStack>
        </Card.Header>
        <Card.Body color="fg.muted">
          Expoの動的ルーティング(クエリ形式との違い)
        </Card.Body>
      </Card.Root>
    </>
  )
}
export default BExpoRoutingCard;