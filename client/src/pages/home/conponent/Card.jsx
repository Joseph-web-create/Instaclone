import { Link } from "react-router";
import TimeAgo from "timeago-react";
import CardOption from "./CardOption";
import { useAuth } from "../../../store";

export default function Card({ post }) {
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
        </div>
      </div>
    </>
  );
}
