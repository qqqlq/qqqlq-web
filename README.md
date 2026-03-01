# サイトコンセプトについて

本サイトは、これまでの「技術ブログ」としての役割を拡張し、写真の展示(Photography)機能を含めた包括的な個人ポートフォリオサイトとして再構築中。今後は以下の3つの主要コンテンツで構成：
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
- 現在は `src/constants/photos.ts` にて、Unsplashのダミー画像URLとタイトル・説明を配列(`DUMMY_PHOTOS`)として定義。
- 将来的には、この配列を外部の BaaS (Cloudinary など) やヘッドレス CMS (microCMS, Contentful) の API 呼び出しに置き換えることで、動的なギャラリーへと容易に拡張可能。

## 3. 主要テクノロジースタック
- **Framework**: React + Vite
- **Routing**: React Router (`react-router-dom`)
- **Styling / UI**: Chakra UI
- **Markdown Rendering**: `react-markdown`

# 記事の追加方法(備忘録)


現在は React コンポーネント上に直接記述することも可能だが、`react-markdown` を導入したため、今後は **Markdown (.md) ファイル** でブログ記事を作成するフローを推奨。

## Markdown を用いた記事の追加手順

1. `@/components/ui/Contents/[任意のブログ名]` ディレクトリを作成する。
2. そのディレクトリ内に `記事名.md`（例：`new-post.md`）を作成し、Markdown 形式で記事を書く。
3. 同じディレクトリ内に `記事名.tsx` を作成し、以下のように Markdown ファイルを読み込んでレンダリングするコンポーネントを作る（`BlogMD/BMD.tsx` を参考に）。

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import markDownContent from './new-post.md?raw'; // 末尾に ?raw をつける
import BlogHead from "../BlogHead";

const NewPost = () => {
  return (
    <>
      <BlogHead title="新しい記事のタイトル" params="new-post" tags={["タグ1", "タグ2"]} />
      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markDownContent}
        </ReactMarkdown>
      </div>
    </>
  );
}

export default NewPost;
```

4. Tech Blog 一覧画面（`Home.tsx` や `Blogs.tsx` など）に表示する用の**カードコンポーネント**（`B[ブログのparams等]Card.tsx`）を作成する。
5. `@/components/ui/Contents/BlogRoutes.tsx` にて、手順3で作った `NewPost.tsx` などを import してルーティング (`<Route path="new-post" element={<NewPost />} />`) を追加する。
6. 一覧画面（`Blogs.tsx`など）および `@/components/ui/Contents/BlogSearch.tsx` にて、手順4で作ったカードコンポーネントを追加する。
7. 従来のタグにない新しいタグを指定する場合、`@/constants/tags.ts` にて該当のタグと表示色 (`colorPalette`) の設定を追加する。

# Changelog (変更履歴)

- **2026-03-01**
  - 技術ブログ専用からポートフォリオサイト(Home, Photography機能)を統合する形へリニューアル。
  - ルーティング構造を刷新し、ランディングページ(`/`)と写真ギャラリー(`/photography`)を追加。
  - Chakra UI v3 の最新仕様に合わせてコードを修正。
  - タグ情報を一元化(`src/constants/tags.ts`)し、冗長なハードコード設定を排除するリファクタリングを実施。
  - すべてのカードコンポーネントおよびUI上のテキストを日本語へ翻訳・統一。
