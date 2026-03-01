import { Card, Heading, Tag, HStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { TagColor } from "../../../../constants/tags";

const BMDCard = () => {

  const navigate = useNavigate();

  const goToBlog = () => {
    navigate("/blog/md");
  };

  // タグ色々
  const tags = ["learning", "React", "Markdown"];

  return (
    <>
      <Card.Root width="100%" onClick={goToBlog} cursor="pointer">
        <Card.Header>
          <HStack gap={2} justifyContent="space-between">
            <Heading size="md">handle .md</Heading>
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
          react-markdownを使用することで、.mdファイルを扱うことができます。
        </Card.Body>
      </Card.Root>
    </>
  )
}
export default BMDCard;