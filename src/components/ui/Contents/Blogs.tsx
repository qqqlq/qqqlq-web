import { Stack, Center, Spinner, Text } from "@chakra-ui/react"
import Trans from "../layout/TopTrans";
import DynamicBlogCard from "./DynamicBlogCard";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";

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
      ) : blogs.length === 0 ? (
        <Center h="20vh">
          <Text color="fg.muted">まだ記事がありません。</Text>
        </Center>
      ) : (
        <Stack gap={4}>
          {blogs.map(blog => (
            <DynamicBlogCard
              key={blog.id}
              title={blog.title}
              pathParams={blog.pathParams}
              tags={blog.tags}
            />
          ))}
        </Stack>
      )}
    </>
  )
}

export default Blogs;