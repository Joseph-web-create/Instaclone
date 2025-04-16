import { useState } from "react";
import Modal from "../../../componet/Modal";
import { Link } from "react-router";

export default function CardOption({ post, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    user?.isFollowing?.includes(post?.userId._id || "")
  );
  return (
    <>
      <i
        className="ri-more-line text-2xl cursor-pointer"
        role="buttom"
        title="More options"
        onClick={() => setIsOpen(true)}
      ></i>
      <Modal
        isOpen={isOpen}
        id="cardOptionsModal"
        classname="w-[90%] max-w-[400px] mx-auto p-0"
        onClose={() => setIsOpen(false)}
      >
        <div className="text-center p-3">
          {user._id !== post?.userId?._id && (
            <>
              <p>{isFollowing ? "Unfollow" : "Follow"}</p>
              <div className="divider"></div>
            </>
          )}
          <p className="font-medium " title="view post">
            <Link to={`/post/${post?._id}`}>Go to post</Link>
          </p>
          <div className="divider my-2"></div>
          <p
            className="font-medium cursor-pointer"
            role="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </p>
        </div>
      </Modal>
    </>
  );
}
