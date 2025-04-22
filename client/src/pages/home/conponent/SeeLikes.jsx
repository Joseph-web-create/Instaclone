import { useState } from "react";
import Modal from "../../../componet/Modal";
import { seePostLikes } from "../../../api/post";
import { useAuth } from "../../../store";
// import useFetch from "../../../hooks/useFetch";
import { Link } from "react-router";
import handleError from "../../../utils/handlleError";
import { followUser } from "../../../api/auth";
import { toast } from "sonner";

export default function SeeLikes({ likeCount, post, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { accessToken, setUser } = useAuth();
  // const { data, loading } = useFetch({
  //   apiCall: seePostLikes,
  //   params: [post?._id, accessToken],
  // });

  // console.log(data);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const res = await seePostLikes(post?._id, accessToken);
      if (res.status === 200) {
        setData(res.data.users);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollowUser = async (followerId) => {
    setLoading(true);
    try {
      const res = await followUser(followerId, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message, { id: "Follow Post" });
        setUser((prev) => ({
          ...prev,
          ...res.data.user,
        }));
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeFn = () => {
    setIsModalOpen(true);
    fetchLikes();
  };

  return (
    <>
      <p
        className="font-semibold cursor-pointer hover:text-gray-600 px-4 md:px-0 mt-2"
        title="See who liked the post"
        onClick={handleLikeFn}
      >
        {likeCount} likes
      </p>
      <Modal
        isOpen={isModalOpen}
        id="likesPost"
        title="Likes"
        classname="w-[90%] max-w-[400px] mx-auto py-3 px-0"
        onClose={() => setIsModalOpen(false)}
      >
        {post?.likes?.length === 0 && (
          <p className="text-center my-6">
            No likes yet! Be the first one to like😔
          </p>
        )}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="loading loading-spinner text-fuchsia-900"></span>
          </div>
        ) : (
          <>
            {data?.map((item, index) => (
              <div
                className="flex justify-between items-center p-3"
                key={item._id}
              >
                <Link
                  to={`/profile/${item.username}`}
                  className="flex items-center "
                >
                  <div className="avatar avatar-placeholder">
                    <div
                      className={`w-11 rounded-full ${
                        item.profilePicture ? "" : "border"
                      }`}
                    >
                      {item.profilePicture ? (
                        <img
                          src={item.profilePicture}
                          alt={item.username}
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-3xl">
                          {item.username.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-2">
                    <p className="font-semibold">{item.username}</p>
                    <p className="text-sm">{item.fullname}</p>
                  </div>
                </Link>
                <button
                  disabled={user?._id === item._id}
                  className="btn bg-fuchsia-950 w-[110px] text-white"
                  onClick={() => {
                    toggleFollowUser(item._id);
                    setActive(index);
                  }}
                >
                  {active === index && loading
                    ? "Updating..."
                    : user?.following?.includes(item._id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            ))}
          </>
        )}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          role="button"
          onClick={() => setIsModalOpen(false)}
        >
          <i className="ri-close-line text-xl"></i>
        </button>
      </Modal>
    </>
  );
}
