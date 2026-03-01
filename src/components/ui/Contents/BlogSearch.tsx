import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TagColor } from "../../../constants/tags";
import {
    Stack,
    Tag,
    VStack,
    Separator,
    Box,
    HStack,
    Text,
} from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi"
import BlogTest from "./BlogTest/BTestCard";
import BlogInitial from "./BlogInitial/BInitialCard";
import BMDCard from "./BlogMD/BMDCard";
import BExpoRoutingCard from "./BlogExpoRouting/BExpoRoutingCard";
import BExpoRoutingTipsCard from "./BlogExpoRoutingTips/BExpoRoutingTipsCard";
import { RiArrowDropRightLine } from "react-icons/ri"

const BlogSearch = () => {
    const navigate = useNavigate();
    const goToTop = () => {
        navigate("/");
    }
    const goToTags = () => {
        navigate("/blog/tag");
    };

    // タグごとの状態を管理する
    const [selectedTags, setSelectedTags] = useState<Record<string, boolean>>({});

    // タグが一度でも選択されたかどうかを管理
    const [hasTagBeenSelected, setHasTagBeenSelected] = useState(false);

    // タグの選択状態をトグルする関数
    const toggleTag = (tag: string) => {
        setSelectedTags(prev => ({
            ...prev,
            [tag]: !prev[tag]
        }));
        // 初回のタグ選択を記録
        if (!hasTagBeenSelected) {
            setHasTagBeenSelected(true);
        }
    };

    // ここでタグのデータを定義
    const BTags = [
        { id: 0, component: BlogTest, tags: ["Chakra", "React", "learning"] },
        { id: 1, component: BlogInitial, tags: ["learning",] },
        { id: 2, component: BMDCard, tags: ["React", "learning", "Markdown"] },
        { id: 3, component: BExpoRoutingCard, tags: ["Expo", "expo-router", "ルーティング", "React Native"] },
        { id: 4, component: BExpoRoutingTipsCard, tags: ["Expo", "expo-router", "ルーティング", "React Native"] },
    ];

    // タグのデータを定義
    // const BTags = ...


    // 全てのタグをマージした配列
    const AllTags = Array.from(new Set(BTags.flatMap(item => item.tags)));

    // 全てのコンポーネントを取得する関数
    const getAllComponents = () => {
        return BTags
            .map(item => ({ id: item.id, Component: item.component }))
            .sort((a, b) => b.id - a.id);
    };

    // 選択されているタグに対応するコンポーネントのリスト取得
    const getSearchedComponents = () => {
        return Object.keys(selectedTags)
            .filter(tag => selectedTags[tag])
            .flatMap(tag =>
                BTags.filter(item => item.tags.includes(tag))
                    .map(item => ({ id: item.id, Component: item.component }))
            );
    }

    // 表示するコンポーネントを決定
    const getDisplayComponents = () => {
        // タグが選択されたことがない場合は全てのコンポーネントを表示
        if (!hasTagBeenSelected) {
            return getAllComponents();
        }

        // タグが選択されている場合はフィルタリング結果を表示
        const SearchedComponents = Object.values(
            getSearchedComponents().reduce((acc, item) => {
                acc[item.id] = item; // 同じidなら上書きされる
                return acc;
            }, {} as Record<number, { id: number; Component: any }>)
        );
        return SearchedComponents.sort((a, b) => b.id - a.id);
    };

    const DisplayComponents = getDisplayComponents();

    return (
        <>
            <Separator orientation="vertical" />
            <Box borderBottom="2px solid" display="inline-block">
                <HStack gap={2}>
                    <Box onClick={goToTop} cursor="pointer">
                        <Text
                            fontSize={{ base: "lg", md: "lg", lg: "3xl" }}
                            whiteSpace="nowrap"
                        >Top</Text>
                    </Box>
                    <RiArrowDropRightLine size="2em" />
                    <Box onClick={goToTags} cursor="pointer">
                        <Text
                            fontSize={{ base: "lg", md: "lg", lg: "3xl" }}
                            whiteSpace="nowrap"
                        >Tech Blog</Text>
                    </Box>
                </HStack>
            </Box>
            <Separator orientation="vertical" />

            <Stack direction="row" gap={4} wrap="wrap">
                {AllTags.map(tag => (
                    <div key={tag} onClick={() => toggleTag(tag)}>
                        {selectedTags[tag] ? (
                            <Tag.Root variant="solid" cursor="pointer" colorPalette={TagColor[tag] || "gray"}>
                                <Tag.Label>{tag}</Tag.Label>
                                <Tag.CloseTrigger onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTag(tag);
                                }} />
                            </Tag.Root>
                        ) : (
                            <Tag.Root cursor="pointer" colorPalette={TagColor[tag] || "gray"}>
                                <Tag.StartElement as={HiPlus} />
                                <Tag.Label>{tag}</Tag.Label>
                            </Tag.Root>
                        )}
                    </div>
                ))}
            </Stack>

            <Separator orientation="vertical" />

            <VStack>
                {DisplayComponents.map((item) => (
                    <item.Component key={item.id} />
                ))}
            </VStack>
        </>
    )
}

export default BlogSearch;