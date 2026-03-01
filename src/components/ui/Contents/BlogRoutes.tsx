import { Routes, Route } from "react-router-dom"
import Blogs from "./Blogs"
import BlogView from "./BlogView"
import BlogSearch from "./BlogSearch"

const BlogRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Blogs />} />
      <Route path="tag" element={<BlogSearch />} />
      <Route path=":path" element={<BlogView />} />
      <Route path="*" element={<div>Blog Not Found</div>} />
    </Routes>
  )
}

export default BlogRoutes;