import { useState } from "react";
import Modal from "../../../componet/Modal";
import { seePostLikes } from "../../../api/post";
import { useAuth } from "../../../store";
import useFetch from "../../../hooks/useFetch";

export default function SeeLikes({ likeCount, post, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [active, setActive] = useState(0);
  const { accessToken } = useAuth();
  const { data, loading } = useFetch();

  return (
    <>
      <p
        className="font-semibold cursor-pointer hover:text-gray-600 px-4 md:px-0 mt-2"
        title="See who liked the post"
        onClick={() => setIsModalOpen(true)}
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
