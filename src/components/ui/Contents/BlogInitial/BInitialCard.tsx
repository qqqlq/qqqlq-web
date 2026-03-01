import { Card, Heading, HStack, Tag } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { TagColor } from "../../../../constants/tags";

const BInitialCard = () => {

  const navigate = useNavigate();

  const goToBlog = () => {
    navigate("/blog/initial");
  };

  // タグ色々
  const tags = ["learning"];

  return (
    <>
      <Card.Root width="100%" onClick={goToBlog} cursor="pointer">
        <Card.Header>
          <HStack gap={2} justifyContent="space-between">
            <Heading size="md"> I'm qqqlq.</Heading>
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
          最初の投稿です。このブログはReactで作成されました。
        </Card.Body>
      </Card.Root>
    </>
  )
}
export default BInitialCard;