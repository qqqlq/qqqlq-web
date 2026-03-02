import { Card, Heading, Tag, HStack, VStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { getTagColor } from "../../../../constants/tags";

const BTestCard = () => {
  const navigate = useNavigate();
  const tags = ["learning", "Chakra", "React"];

  return (
    <>
      <Card.Root width="100%" onClick={() => navigate("/blog/test")} cursor="pointer" _hover={{ transform: 'translateY(-2px)', shadow: 'md' }} transition="all 0.2s">
        <Card.Body>
          <VStack align="start" gap={2}>
            <Heading size="md">Test Post</Heading>
            <HStack gap={2} wrap="wrap">
              {tags.map(tag => (
                <Tag.Root key={tag} cursor="pointer" colorPalette={getTagColor(tag)}>
                  <Tag.Label>{tag}</Tag.Label>
                </Tag.Root>
              ))}
            </HStack>
          </VStack>
        </Card.Body>
        <Card.Footer pt={0} pb={4} px={6}>
        </Card.Footer>
      </Card.Root>
    </>
  )
}
export default BTestCard;