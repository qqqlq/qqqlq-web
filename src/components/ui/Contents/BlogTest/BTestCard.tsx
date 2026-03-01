import { Card, Heading, Tag, HStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { getTagColor } from "../../../../constants/tags";

const BTestCard = () => {

  const navigate = useNavigate();

  const goToBlog = () => {
    navigate("/blog/test");
  };

  // タグ色々
  const tags = ["learning", "Chakra", "React"];

  return (
    <>
      <Card.Root width="100%" onClick={goToBlog} cursor="pointer">
        <Card.Header>
          <HStack gap={2} justifyContent="space-between">
            <Heading size="md">Test Post</Heading>
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
          テスト投稿です。
        </Card.Body>
      </Card.Root>
    </>
  )
}
export default BTestCard;