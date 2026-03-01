import { Stack, Center, Spinner, Text } from "@chakra-ui/react"
import Trans from "../layout/TopTrans";
import DynamicBlogCard from "./DynamicBlogCard";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";

// 静的な旧記事のデータ
import BlogTest from "./BlogTest/BTestCard";
import BlogInitial from "./BlogInitial/BInitialCard";
import BMDCard from "./BlogMD/BMDCard";
import BExpoRoutingCard from "./BlogExpoRouting/BExpoRoutingCard";
import BExpoRoutingTipsCard from "./BlogExpoRoutingTips/BExpoRoutingTipsCard";

const STATIC_BLOGS: { id: string; component: React.ComponentType }[] = [
  { id: "static-4", component: BExpoRoutingTipsCard },
  { id: "static-3", component: BExpoRoutingCard },
  { id: "static-2", component: BMDCard },
  { id: "static-1", component: BlogInitial },
  { id: "static-0", component: BlogTest },
];

const Blogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Trans />

      {loading ? (
        <Center h="50vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        <Stack gap={4}>
          {/* Firestoreの動的記事 */}
          {blogs.map(blog => (
            <DynamicBlogCard
              key={blog.id}
              title={blog.title}
              pathParams={blog.pathParams}
              tags={blog.tags}
              description={blog.description}
            />
          ))}

          {/* 静的な旧記事 */}
          {STATIC_BLOGS.map(item => (
            <item.component key={item.id} />
          ))}

          {/* 全て空のケース */}
          {blogs.length === 0 && STATIC_BLOGS.length === 0 && (
            <Center h="20vh">
              <Text color="fg.muted">まだ記事がありません。</Text>
            </Center>
          )}
        </Stack>
      )}
    </>
  )
}

export default Blogs;