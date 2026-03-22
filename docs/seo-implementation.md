# SEO対策 実装まとめ

実施日: 2026-03-22
対象サイト: https://blog.nodewalker.app/

---

## 背景

このサイトは純粋なSPA（React 19 + Vite 7）であり、実装前はSEO対策がほぼゼロの状態だった。

**実装前の問題点:**
- `<html lang="en">` （日本語サイトなのに英語設定）
- メタタグ・OGPタグが一切なし
- `robots.txt` / `sitemap.xml` なし
- 動的メタタグの仕組みなし（ページタイトルが全ページ共通）
- Google Search Console 未登録

---

## 実施内容

### 1. `index.html` の修正

- `lang="en"` → `lang="ja"` に変更
- デフォルトのメタタグをheadに追加:
  - `<meta name="description">`
  - OGPタグ（`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, `og:site_name`）
  - Twitterカード（`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`）

これらはJavaScript実行前のフォールバックとして機能する。

### 2. `public/robots.txt` の作成

```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://blog.nodewalker.app/sitemap.xml
```

※ Cloudflareが追加でAIクローラー（GPTBot, ClaudeBot等）のブロック設定を自動付加している。

### 3. `public/sitemap.xml` の作成（暫定静的版）

ビルド前のフォールバックとして静的な sitemap.xml を `public/` に配置。
実際のビルド時は `scripts/generate-sitemap.ts` によって `dist/sitemap.xml` に上書きされる。

### 4. `react-helmet-async` の導入

```bash
npm install react-helmet-async
```

`src/main.tsx` でアプリ全体を `<HelmetProvider>` でラップ。

### 5. 共通SEOコンポーネントの作成 (`src/components/SEO.tsx`)

ページごとのメタタグを一元管理するコンポーネント。

**Props:**
| Prop | 型 | 説明 |
|---|---|---|
| `title` | `string?` | ページタイトル（`タイトル \| NodeWalker Web` の形式で出力） |
| `description` | `string?` | メタディスクリプション |
| `path` | `string` | パス（例: `/blog/my-post`）。canonical URLの生成に使用 |
| `image` | `string?` | OGP画像URL（省略時はアイコン画像） |
| `type` | `'website' \| 'article'` | OGPタイプ |
| `publishedTime` | `string?` | 記事公開日時（ISO 8601形式） |
| `tags` | `string[]?` | 記事タグ（`article:tag` として出力） |
| `noindex` | `boolean?` | 検索インデックスから除外する場合 `true` |
| `jsonLd` | `Record<string, unknown>?` | JSON-LD構造化データ |

**出力内容:**
- `<title>`, `<meta name="description">`, `<link rel="canonical">`
- OGPタグ（`og:*`）
- Twitterカード（`twitter:*`）
- JSON-LD（`<script type="application/ld+json">`）
- `noindex=true` のとき `<meta name="robots" content="noindex,nofollow">`

### 6. 各ページへのSEOコンポーネント適用

| ページ | ファイル | noindex | 備考 |
|---|---|---|---|
| Home | `Home.tsx` | No | |
| Tech Blog一覧 | `Blogs.tsx` | No | |
| ブログ記事 | `BlogView.tsx` | No | 動的タイトル・description・JSON-LD（BlogPosting）付き |
| Photography | `Photography.tsx` | No | |
| ブログ検索 | `BlogSearch.tsx` | Yes | 検索UIなのでインデックス不要 |
| Admin Login | `Admin/Login.tsx` | Yes | |
| Admin Dashboard | `Admin/Dashboard.tsx` | Yes | |

**BlogView の JSON-LD（構造化データ）:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "記事タイトル",
  "description": "記事冒頭120文字",
  "url": "https://blog.nodewalker.app/blog/slug",
  "datePublished": "ISO8601形式",
  "author": { "@type": "Person", "name": "qqqlq" },
  "publisher": { "@type": "Person", "name": "qqqlq" },
  "keywords": "タグ1, タグ2"
}
```

### 7. ビルド時 sitemap.xml 自動生成スクリプト

**ファイル:** `scripts/generate-sitemap.ts`

ビルド時にFirestoreから全ブログ記事のスラッグを取得し、静的ルートと合わせて `dist/sitemap.xml` を生成する。

```bash
# buildコマンドに追加済み
tsc -b && vite build && tsx scripts/generate-sitemap.ts
```

**生成されるURL:**
- `/`（priority: 1.0, weekly）
- `/blog`（priority: 0.8, weekly）
- `/photography`（priority: 0.7, weekly）
- `/blog/{slug}` × ブログ記事数（priority: 0.6, monthly）

Firebase接続に失敗した場合は静的ルートのみで生成してビルドを継続する（エラーで止まらない）。

### 8. Google Search Console 登録

- プロパティ: `https://blog.nodewalker.app/`
- 所有権確認: HTMLファイル方式（`public/googlef0d1cc21183a662f.html`）
- sitemap送信: `https://blog.nodewalker.app/sitemap.xml`（10URL検出・正常処理済み）

---

## 追加・変更したファイル一覧

**新規作成:**
- `public/robots.txt`
- `public/sitemap.xml`（静的フォールバック）
- `public/googlef0d1cc21183a662f.html`（Search Console所有権確認用）
- `src/components/SEO.tsx`
- `scripts/generate-sitemap.ts`
- `docs/seo-implementation.md`（このファイル）

**変更:**
- `index.html` — lang修正、デフォルトメタタグ追加
- `src/main.tsx` — HelmetProvider追加
- `src/components/ui/Contents/Home.tsx`
- `src/components/ui/Contents/Blogs.tsx`
- `src/components/ui/Contents/BlogView.tsx`
- `src/components/ui/Contents/Photography.tsx`
- `src/components/ui/Contents/BlogSearch.tsx`
- `src/components/ui/Admin/Login.tsx`
- `src/components/ui/Admin/Dashboard.tsx`
- `package.json` — react-helmet-async追加、buildスクリプト変更

---

## 今後の検討事項

- **プリレンダリング（SSG）**: Googlebot はJSを実行できるため現時点では不要。Search Consoleでインデックス状況を確認し、必要なら追加検討。
- **Vercel Edge Function（SNS OGP）**: TwitterやSlackでブログ記事URLをシェアした際のOGPプレビュー精度を上げたい場合に検討。ただし個人サイトなので優先度低。
- **OGPバナー画像**: 現在はアイコン画像（小さい）をOGP画像として使用。SNSシェア映えを改善するなら1200×630pxのバナー画像を用意するとよい。
