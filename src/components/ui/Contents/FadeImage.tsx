import { useState } from "react";
import { Box, Image, Skeleton } from "@chakra-ui/react";

interface FadeImageProps {
    src: string;
    alt: string;
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
    h?: string | { [key: string]: string };
    w?: string;
}

/**
 * スケルトンローダー + フェードインを組み合わせた画像コンポーネント。
 * 画像が読み込まれるまでスケルトンを表示し、
 * 読み込み完了後に opacity 0 → 1 のアニメーションで滑らかに表示する。
 */
const FadeImage = ({ src, alt, objectFit = "cover", h, w = "100%" }: FadeImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <Box position="relative" h={h} w={w} overflow="hidden">
            {/* スケルトン（画像が読み込まれるまで表示） */}
            {!isLoaded && (
                <Skeleton
                    position="absolute"
                    inset={0}
                    h="100%"
                    w="100%"
                    borderRadius={0}
                />
            )}

            {/* 画像本体（読み込み後にフェードイン） */}
            <Image
                src={src}
                alt={alt}
                objectFit={objectFit}
                h={h}
                w={w}
                opacity={isLoaded ? 1 : 0}
                transition="opacity 0.4s ease-in-out"
                onLoad={() => setIsLoaded(true)}
            />
        </Box>
    );
};

export default FadeImage;
