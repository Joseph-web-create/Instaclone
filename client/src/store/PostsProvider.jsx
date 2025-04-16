import { useState, useEffect } from "react";
import { PostContext, useAuth } from ".";
import { getAllPosts } from "../api/post";
import handleError from "../utils/handlleError";

export default function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await getAllPosts(page, limit, accessToken, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setPosts((prev) =>
            page === 1 ? res.data.posts : [...prev, res.data.posts]
          );
        }
      } catch (error) {
        if (!controller.signal.aborted && error.name !== "AbortError") {
          handleError(error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchPost();
    return () => {
      controller.abort;
    };
  }, [accessToken, limit, page]);

  console.log(posts);

  return (
    <PostContext.Provider value={{ posts, setPosts, loading, error }}>
      {children}
    </PostContext.Provider>
  );
}
