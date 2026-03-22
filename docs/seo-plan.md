# SEO対策 実装計画

作成日: 2026-03-22

## 背景と目的
サイト（https://blog.nodewalker.app/）は純粋なSPA（React 19 + Vite 7）で、SEO対策がほぼゼロの状態だった。`<html lang="en">`、メタタグなし、robots.txtなし、sitemap.xmlなし。Googleクローラーから見るとほぼ空のページに見えていた。

## 実施内容

### Step 1: `index.html` の基本修正
- `<html lang="en">` → `<html lang="ja">` に変更
- デフォルトのメタタグを追加: description, OGP, Twitterカード

### Step 2: `robots.txt` の作成 (`public/robots.txt`)
- 全ページ許可、`/admin/` はブロック
- sitemap.xml へのリンク

### Step 3: 静的 `sitemap.xml` の作成 (`public/sitemap.xml`)
- 既知の静的ルート: `/`, `/blog`, `/photography`
- 動的ブログルートは Step 7 のスクリプトで補完

### Step 4: `react-helmet-async` の導入
- `npm install react-helmet-async`
- `src/main.tsx` に `<HelmetProvider>` を追加

### Step 5: 共通 SEO コンポーネントの作成 (`src/components/SEO.tsx`)
- Props: `title`, `description`, `path`, `image?`, `type?`, `noindex?`, `jsonLd?`
- title, description, canonical, OGP, Twitterカード, JSON-LD を出力

### Step 6: 各ページに SEO コンポーネントを追加
| ファイル | noindex |
|---|---|
| `Home.tsx` | No |
| `Blogs.tsx` | No |
| `BlogView.tsx` | No（動的 + JSON-LD構造化データ） |
| `Photography.tsx` | No |
| `BlogSearch.tsx` | Yes |
| Admin系ページ | Yes |

### Step 7: ビルド時 sitemap.xml 生成スクリプト (`scripts/generate-sitemap.ts`)
- Firebase から全ブログスラッグを取得して sitemap.xml を `dist/` に生成
- `package.json` の build コマンドに追加

### Step 8: Google Search Console 登録（手動作業）
1. https://search.google.com/search-console にアクセス
2. `https://blog.nodewalker.app/` をプロパティ追加
3. 所有権確認（HTMLファイルアップロードが最も簡単 → `public/` に配置してデプロイ）
4. sitemap.xml を送信
5. URL検査ツールでインデックス状態を確認

## 今回対応しないもの（将来検討）
- **プリレンダリング（SSG）**: GooglebotはJSを実行できるので、まずはメタタグ対応で十分
- **Vercel Edge Function（SNS OGP用）**: 個人サイトなので優先度低

## 変更ファイル一覧
- `index.html`
- `src/main.tsx`
- `src/components/ui/Contents/Home.tsx`
- `src/components/ui/Contents/Blogs.tsx`
- `src/components/ui/Contents/BlogView.tsx`
- `src/components/ui/Contents/Photography.tsx`
- `src/components/ui/Contents/BlogSearch.tsx`
- `package.json`

## 新規作成ファイル
- `public/robots.txt`
- `public/sitemap.xml`
- `src/components/SEO.tsx`
- `scripts/generate-sitemap.ts`
- `docs/seo-plan.md`（このファイル）
