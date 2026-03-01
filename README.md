# サイトコンセプトについて

本サイトは、これまでの「技術ブログ」としての役割を拡張し、写真の展示(Photography)機能を含めた包括的な個人ポートフォリオサイトとして再構築中です。今後は以下の3つの主要コンテンツで構成されます：
1. **ポートフォリオ**: プログラミングや写真撮影といった活動全体を紹介するランディングページ
2. **Photography**: 趣味の写真作品をギャラリー形式で魅せる写真集（当面はダミー画像で構築し、将来的にCloudinaryなどの外部BaaSやCMSと連携予定）
3. **Tech Blog**: 従来の技術ブログ

# プロジェクト仕様書 (Specification)

## 1. ページ構成とルーティング
- **`/` (Home)**
  - ポートフォリオのランディングページ。
  - Heroセクション（自己紹介）、写真ギャラリーのプレビュー(3枚)、技術ブログへの導線を配置。
- **`/blog` (Tech Blog)**
  - これまで作成した技術ブログ記事の一覧ページ。
- **`/photography` (Photography)**
  - 趣味で撮影した写真のギャラリーページ。
  - `Masonry`風のグリッドレイアウト（Chakra UIの`SimpleGrid`を利用）で画像を敷き詰めて表示。
  - 画像ホバー時には拡大とシャドウ強調のエフェクトが発動。

## 2. 写真データ管理
- 現在は `src/constants/photos.ts` にて、Unsplashのダミー画像URLとタイトル・説明を配列(`DUMMY_PHOTOS`)として定義しています。
- 将来的には、この配列を外部の BaaS (Cloudinary など) やヘッドレス CMS (microCMS, Contentful) の API 呼び出しに置き換えることで、動的なギャラリーへと容易に拡張可能です。

## 3. 主要テクノロジースタック
- **Framework**: React + Vite
- **Routing**: React Router (`react-router-dom`)
- **Styling / UI**: Chakra UI
- **Markdown Rendering**: `react-markdown`

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

# Changelog (変更履歴)

- **2026-03-01**
  - 技術ブログ専用からポートフォリオサイト(Home, Photography機能)を統合する形へリニューアル。
  - ルーティング構造を刷新し、ランディングページ(`/`)と写真ギャラリー(`/photography`)を追加。
  - Chakra UI v3 の最新仕様に合わせてコードを修正。
  - タグ情報を一元化(`src/constants/tags.ts`)し、冗長なハードコード設定を排除するリファクタリングを実施。
  - すべてのカードコンポーネントおよびUI上のテキストを日本語へ翻訳・統一。
