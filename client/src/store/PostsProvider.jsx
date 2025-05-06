import { useState, useEffect } from "react";
import { PostContext, useAuth } from ".";
import { getAllPosts } from "../api/post";
import useFetch from "../hooks/useFetch";

export default function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { accessToken } = useAuth();
  const { data, setData } = useFetch({
    apiCall: getAllPosts,
    params: [page, limit, accessToken],
  });

  useEffect(() => {
    if (data.success) {
      setPosts(data.posts);
    }
  }, [data.posts, data.success]);

  return (
    <PostContext.Provider
      value={{ posts, setPosts, setPage, setLimit, setData }}
    >
      {children}
    </PostContext.Provider>
  );
}
