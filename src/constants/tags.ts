export const TagColor: { [key: string]: string } = {
    learning: "purple",
    Chakra: "teal",
    React: "orange",
    Markdown: "red",
    Expo: "purple",
    "expo-router": "orange",
    ルーティング: "red",
    "React Native": "green",
    Firebase: "yellow",
    CMS: "cyan",
    Portfolio: "blue",
};

// Chakra UI v3 で利用可能なカラーパレット
const COLOR_PALETTE = ["red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink"];

/**
 * タグ名に対して色を返す。
 * 定義済みのタグはその色、未定義のタグは文字列のハッシュ値から一貫した色を割り当てる。
 */
export const getTagColor = (tag: string): string => {
    if (TagColor[tag]) return TagColor[tag];

    // 文字列を決定論的にハッシュして、常に同じ色が返るようにする
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
};

