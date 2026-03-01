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

# 記事・写真の追加方法

本サイトは現在 **Firebase (Firestore / Storage / Authentication)** をヘッドレスCMSとして利用しています。
新しい記事や写真を追加する際の推奨手順（CMS）と、従来のソースコードを編集する手順（静的ファイル）の2通りが存在します。

## 1. 推奨手順 (Firebase CMS経由)
1. ブラウザで `/admin` にアクセスし、管理用のメールアドレスとパスワードでログインする。
2. **Dashboard** から「新しい記事を書く」または「写真をアップロード」を選択する。
3. フォームに従って入力し、「投稿」ボタンを押す。
   - **ブログ記事について**: 内容は Markdown 形式で記述でき、自動でパースサれます。概要（Description）を入力すると、カード一覧で表示されます。
   - **タグについて**: `"React"` や `"Firebase"` といったプレーンテキストを入力してください。未定義のタグであっても、ハッシュベースで決定論的に（常に同じ）色が自動で割り当てられるため、ソースコードを編集する必要はありません。

## 2. 従来の記事追加方法 (静的ファイル・ハードコーディング)

CMSを利用せず、ソースコード（React コンポーネント）上に直接記事を追加・管理する従来の手順です。

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
7. （必要に応じて）特定の静的色を強制したい場合は、`@/constants/tags.ts` にて該当のタグと表示色 (`colorPalette`) の定義を追加する。

# Changelog (変更履歴)

- **2026-03** (Firebase CMS導入)
  - Firebase Authentication を用いたセキュアな管理者専用画面 (`/admin`) を構築。
  - Firebase Firestore を用いたブログ記事・写真メタデータの動的取得およびリアルタイム更新(`onSnapshot`)に対応。
  - Firebase Storage への写真アップロード機能を実装。
  - トップページ(`Home`)、ブログ一覧(`Blogs`)、タグ検索ページ(`BlogSearch`)をすべてFirestoreから動的にデータを読み込むようにリライト。
  - 未定義タグに対して、文字列のハッシュ値から一貫したテーマカラーを自動設定する機能を導入。

- **2026-03-01** (ポートフォリオ化)
  - 技術ブログ専用からポートフォリオサイト(Home, Photography機能)を統合する形へリニューアル。
  - ルーティング構造を刷新し、ランディングページ(`/`)と写真ギャラリー(`/photography`)を追加。
  - Chakra UI v3 の最新仕様に合わせてコードを修正。
  - タグ情報を一元化(`src/constants/tags.ts`)し、冗長なハードコード設定を排除するリファクタリングを実施。
  - すべてのカードコンポーネントおよびUI上のテキストを日本語へ翻訳・統一。
