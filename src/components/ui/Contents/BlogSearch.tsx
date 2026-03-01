import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTagColor } from "../../../constants/tags";
import {
    Stack,
    Tag,
    VStack,
    Separator,
    Box,
    HStack,
    Text,
    Spinner,
    Center,
} from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi"
import BlogTest from "./BlogTest/BTestCard";
import BlogInitial from "./BlogInitial/BInitialCard";
import BMDCard from "./BlogMD/BMDCard";
import BExpoRoutingCard from "./BlogExpoRouting/BExpoRoutingCard";
import BExpoRoutingTipsCard from "./BlogExpoRoutingTips/BExpoRoutingTipsCard";
import DynamicBlogCard from "./DynamicBlogCard";
import { RiArrowDropRightLine } from "react-icons/ri"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";

// 静的な記事のタグ定義
const STATIC_BLOG_TAGS: { id: string; component: React.ComponentType; tags: string[] }[] = [
    { id: "static-0", component: BlogTest, tags: ["Chakra", "React", "learning"] },
    { id: "static-1", component: BlogInitial, tags: ["learning"] },
    { id: "static-2", component: BMDCard, tags: ["React", "learning", "Markdown"] },
    { id: "static-3", component: BExpoRoutingCard, tags: ["Expo", "expo-router", "ルーティング", "React Native"] },
    { id: "static-4", component: BExpoRoutingTipsCard, tags: ["Expo", "expo-router", "ルーティング", "React Native"] },
];

const BlogSearch = () => {
    const navigate = useNavigate();
    const goToTop = () => navigate("/");
    const goToTags = () => navigate("/blog/tag");

    const [selectedTags, setSelectedTags] = useState<Record<string, boolean>>({});
    const [hasTagBeenSelected, setHasTagBeenSelected] = useState(false);

    // Firestoreの動的な記事
    const [dynamicBlogs, setDynamicBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snapshot) => {
            setDynamicBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // 全タグ（静的 + 動的）
    const staticAllTags = Array.from(new Set(STATIC_BLOG_TAGS.flatMap(item => item.tags)));
    const dynamicAllTags = Array.from(new Set(dynamicBlogs.flatMap((b: any) => b.tags || [])));
    const AllTags = Array.from(new Set([...dynamicAllTags, ...staticAllTags]));

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => ({ ...prev, [tag]: !prev[tag] }));
        if (!hasTagBeenSelected) setHasTagBeenSelected(true);
    };

    // 選択されているタグ一覧
    const activeTags = Object.keys(selectedTags).filter(t => selectedTags[t]);

    return (
        <>
            <Separator orientation="vertical" />
            <Box borderBottom="2px solid" display="inline-block">
                <HStack gap={2}>
                    <Box onClick={goToTop} cursor="pointer">
                        <Text fontSize={{ base: "lg", md: "lg", lg: "3xl" }} whiteSpace="nowrap">Top</Text>
                    </Box>
                    <RiArrowDropRightLine size="2em" />
                    <Box onClick={goToTags} cursor="pointer">
                        <Text fontSize={{ base: "lg", md: "lg", lg: "3xl" }} whiteSpace="nowrap">Tech Blog</Text>
                    </Box>
                </HStack>
            </Box>
            <Separator orientation="vertical" />

            {/* タグフィルタ */}
            <Stack direction="row" gap={4} wrap="wrap">
                {AllTags.map(tag => (
                    <div key={tag} onClick={() => toggleTag(tag)}>
                        {selectedTags[tag] ? (
                            <Tag.Root variant="solid" cursor="pointer" colorPalette={getTagColor(tag)}>
                                <Tag.Label>{tag}</Tag.Label>
                                <Tag.CloseTrigger onClick={(e) => { e.stopPropagation(); toggleTag(tag); }} />
                            </Tag.Root>
                        ) : (
                            <Tag.Root cursor="pointer" colorPalette={getTagColor(tag)}>
                                <Tag.StartElement as={HiPlus} />
                                <Tag.Label>{tag}</Tag.Label>
                            </Tag.Root>
                        )}
                    </div>
                ))}
            </Stack>

            <Separator orientation="vertical" />

            {loading ? (
                <Center h="30vh"><Spinner size="xl" /></Center>
            ) : (
                <VStack gap={4} align="stretch">
                    {/* Firestoreの動的な記事 */}
                    {dynamicBlogs
                        .filter(blog =>
                            activeTags.length === 0 || activeTags.some(t => (blog.tags || []).includes(t))
                        )
                        .map(blog => (
                            <DynamicBlogCard
                                key={blog.id}
                                title={blog.title}
                                pathParams={blog.pathParams}
                                tags={blog.tags || []}
                                description={blog.description}
                            />
                        ))
                    }

                    {/* 静的な記事（タグフィルタ適用） */}
                    {STATIC_BLOG_TAGS
                        .filter(item =>
                            activeTags.length === 0 || activeTags.some(t => item.tags.includes(t))
                        )
                        .sort((a, b) => Number(b.id.split("-")[1]) - Number(a.id.split("-")[1]))
                        .map(item => (
                            <item.component key={item.id} />
                        ))
                    }

                    {/* 何も表示するものがない場合 */}
                    {hasTagBeenSelected && activeTags.length > 0 &&
                        dynamicBlogs.filter(b => activeTags.some(t => (b.tags || []).includes(t))).length === 0 &&
                        STATIC_BLOG_TAGS.filter(item => activeTags.some(t => item.tags.includes(t))).length === 0 && (
                            <Center h="10vh">
                                <Text color="fg.muted">選択したタグに一致する記事はありません。</Text>
                            </Center>
                        )
                    }
                </VStack>
            )}
        </>
    )
}

export default BlogSearch;