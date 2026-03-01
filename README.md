# 記事の追加方法(備忘録)


qqqlq-web(技術ブログ)における記事追加の流れを以下に記す。

## 1. 記事ファイルの作成

`@/components/ui/Contents`下に任意のディレクトリを作成し以下テンプレートをもとに"B[ブログのparams等].tsx"と"B[ブログのparams等]Card.tsx"を作成する。

***BSample.tsx***
```js:BSample.tsx
import { Stack, Text } from "@chakra-ui/react"
import BlogHead from "../BlogHead";

const BlogSample = () => {
  return (
    <>
      <BlogHead title="サンプル投稿" params="sample" tags={["learning", "sample"]} />
      // コンテンツ
    </>
  )
}
export default BlogSample;
```
***BSampleCard.tsx***
```tsx:BSampleCard.tsx
import { Card, Heading, Tag, HStack} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { TagColor } from "../../../../constants/tags";

const BSampleCard = () => {

  const navigate = useNavigate();

  const goToBlog = () => {
    navigate("/blog/sample");
  };

  // タグ色々
  const tags = ["learning", "sample"];

  return (
    <>
      <Card.Root width="100%" onClick={goToBlog} cursor="pointer">
          <Card.Header>
            <HStack gap={2} justifyContent="space-between">
              <Heading size="md">サンプル投稿</Heading>
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
            これはサンプルです。
          </Card.Body>
        </Card.Root>
    </>
  )
}
export default BSampleCard;
```

## 2. 記事内容の執筆

手順1にて作成した"B[ブログのparams等].tsx"にjsxで頑張る。

## 3. Cardの飾り

- 当記事のタイトル(なるべく短く)とサイト内での場所(パスパラメータ)、適切なtag("B...Card.tsx" の `tags` 配列)を決める。
- 決定事項をもとに"B[ブログのparams等].tsx"のBlogHeadコンポーネントに各propsを設定する。
- "B[ブログのparams等]Card.tsx"のgoToBlog関数のnavigateの引数を当記事のパスパラメータに設定する。
- `@/components/ui/Contents/BlogRoutes.tsx`にて"B[ブログのparams等].tsx"をimportしてルーティングする。
- `@/components/ui/Contents/BlogSearch.tsx`にて新しく作成したカードコンポーネントをimportし、`BTags`配列に追加する。
- 従来のタグにない新しいタグを指定する場合、`@/constants/tags.ts`にて該当のタグと表示色(colorPalette)の設定を追加する。
