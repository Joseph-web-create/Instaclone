import { Link } from "react-router";
import TimeAgo from "timeago-react";
import CardOption from "./CardOption";
import { useAuth } from "../../../store";
import LazyLoadingImage from "../../../componet/LazyLoadingImage";
import useSlideControle from "../../../hooks/useSlideControle";

export default function Card({ post }) {
  const { currentImageIndex, handlePrevious, handleNext } = useSlideControle(
    post?.media
  );

  const { user } = useAuth();
  const formatTime = (time) => {
    return <TimeAgo datetime={time} locale="en-US" />;
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
                  role="button"
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
                  role="button"
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
        </div>
      </div>
    </>
  );
}
