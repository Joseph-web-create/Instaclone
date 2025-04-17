import { Link, useNavigate } from "react-router";
import TimeAgo from "timeago-react";
import CardOption from "./CardOption";
import { useAuth } from "../../../store";
import LazyLoadingImage from "../../../componet/LazyLoadingImage";
import useSlideControle from "../../../hooks/useSlideControle";
import { useState } from "react";
import SeeLikes from "./SeeLikes";
import { useForm } from "react-hook-form";

export default function Card({ post }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { currentImageIndex, handlePrevious, handleNext } = useSlideControle(
    post?.media
  );

  const { user } = useAuth();
  const [isPostLiked, setIsPostLiked] = useState(
    post?.likes?.some((like) => like._id === user?._id)
  );

  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);

  const [isPostSaved, setIsPostSaved] = useState(
    post?.savedBy?.some((save) => save._id === user?._id)
  );

  const navigate = useNavigate();

  const formatTime = (time) => {
    return <TimeAgo datetime={time} locale="en-US" />;
  };

  const postComment = (data) => {
    console.log(data);
  };

  return (
    <>
      <div className="lg:w-[450px] md:rounded-md">
        <div className="py-2">
          <div className="mb-2 flex items-center justify-between px-4 md:px-0">
            <Link
              className="flex items-center gap-3"
              to={`/profile/${post?.userId?.username}`}
            >
              <div className="avatar avatar-placeholder">
                <div className="w-12 rounded-full border border-gray-300">
                  {post?.userId?.profilePicture ? (
                    <img />
                  ) : (
                    <span className="text-3xl">
                      {post?.userId?.username?.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="font-sem">{post?.userId?.username}</p>
                <p className="text-sm text-gray-500">
                  {formatTime(post?.createdAt)}
                </p>
              </div>
            </Link>
            <CardOption post={post} user={user} />
          </div>
          <figure className="relative overflow-hidden">
            {post?.media.map((item, index) => (
              <div
                key={index}
                className={`transition-transform duration-300 ease-in-out transform ${
                  index === currentImageIndex
                    ? "fade-enter-active"
                    : "fade-exit-active"
                }`}
              >
                {index === currentImageIndex && (
                  <>
                    {item.endsWith(".mp4") || item.endsWith(".webm") ? (
                      <>
                        <video
                          src={item}
                          controls={false}
                          loop
                          playsInline
                          autoPlay
                          className="w-full h-auto lg:h-[550px] object-cover aspect-square md:rounded-md"
                        />
                      </>
                    ) : (
                      <LazyLoadingImage
                        image={item}
                        classname="w-full h-[400px] lg:h-[550px] object-cover aspect-square shrink-0 md:rounded-md"
                      />
                    )}
                  </>
                )}
              </div>
            ))}
            <>
              {currentImageIndex < post?.media?.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 btn btn-circle btn-sm opacity-75 hover:opacity-100"
                >
                  <i className="ri-arrow-right-s-line text-lg"></i>
                </button>
              )}
            </>
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className=" absolute left-2 top-1/2 btn btn-circle btn-sm opacity-75 hover:opacity-100"
                >
                  <i className="ri-arrow-left-s-line text-lg"></i>
                </button>
              )}
            </>
            {post?.media?.length > 1 && (
              <div className=" absolute bottom-4 left-1/2 transform-translate-x-1/2 flex gap-3">
                {post?.media?.map((_, index) => (
                  <div
                    key={index}
                    className={`w-[8px] h-[8px] rounded-full ${
                      index === currentImageIndex
                        ? "bg-fuchsia-900"
                        : "bg-white"
                    }`}
                  />
                ))}
              </div>
            )}
          </figure>
          <div className="mt-1 flex justify-between items-center px-4 md:px-0">
            <div className="flex gap-4">
              <i
                className={`${
                  isPostLiked ? "ri-heart-line text-red-700" : "ri-heart-line"
                } text-2xl cursor-pointer`}
                role="button"
                title={isPostLiked ? "Unlike" : "Like"}
              ></i>
              <i
                className="ri-chat-3-line text-gray-800 text-2xl cursor-pointer"
                role="button"
                title="Comment"
                onClick={() => navigate(`/post/${post?._id}`)}
              ></i>
            </div>
            <i
              className={`${
                isPostSaved
                  ? "ri-bookmark-fill text-gray-800"
                  : "ri-bookmark-line"
              } text-2xl cursor-pointer`}
              role="button"
              title={isPostSaved ? "Unsave" : "Save"}
            ></i>
          </div>
          <SeeLikes likeCount={likeCount} post={post} user={user} />

          <p className="px-4 md:px-0">
            <Link
              className="font-semibold mr-2"
              to={`/profile/${post?.userId?.username}`}
            >
              {post?.userId?.username}
            </Link>
            {post?.caption}
          </p>
          {post?.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 px-4 md:px-0">
              {post?.tags?.map((tag, index) => (
                <Link
                  to={`/tag/${tag}`}
                  key={index}
                  title={`Discover ${tag} posts`}
                >
                  <span className="text-fuchsia-900">#{tag}</span>
                </Link>
              ))}
            </div>
          )}
          <p className="text-gray-600 cursor-pointer px-4 md:px-0 mt-1">
            <Link to={`/post/${post?._id}`}>View all comments</Link>
          </p>
          <form
            onSubmit={handleSubmit(postComment)}
            className="relative px-4 md:px-0 mt-2"
          >
            <textarea
              className="w-full border-0 h-[40px] focus:border-0 focus:outline-none text-sm"
              placeholder="Add a comment..."
              id="comment"
              {...register("comment", { required: true })}
            ></textarea>
            <button
              className="btn btn-ghost btn-sm text-fuchsia-900 font-bold absolute inset-y-0 right-0"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting" : "Post"}
            </button>
            {errors?.comment && (
              <p className="text-xs text-red-600">Comment is required</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
