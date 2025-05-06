import { useParams, Link, NavLink } from "react-router";
import { useAuth } from "../../store";
import MetaArgs from "../../componet/MetaArgs";
import ProfileImage from "./components/ProfileImage";
import useFetch from "../../hooks/useFetch";
import { getAUser } from "../../api/auth";
import { DataSpinner } from "../../componet/Spinner";
import EditProfile from "../../componet/EditProfile";

export default function Profile() {
  const { username } = useParams();
  const { accessToken, user } = useAuth();
  const { data, loading, setData } = useFetch({
    apiCall: getAUser,
    params: [username, accessToken],
  });

  console.log(data);

  return (
    <>
      <MetaArgs
        title={`Your InstaShots profile - (@${username})`}
        content="Profile page"
      />
      <div className="py-5 px-4 lg:px-8 max-w-[950px] xl:max-w-[1024] mx-auto">
        {loading ? (
          <DataSpinner />
        ) : (
          <div className="mt-2 grid md:grid-cols-12 gap-4 md:gap-8 max-w-[700px] justify-center mx-auto px-4">
            <div className="md:col-span-4">
              <div className="flex gap-6">
                <ProfileImage data={data} user={user} setData={setData} />
                {/* Mobile view */}
              </div>
            </div>
            <div className="md:col-span-8">
              {/* large screen */}
              <div className="hidden md:flex items-center gap-4">
                <h1 className="text-lg font-semibold flex-1">{username}</h1>
                <div className="flex items-center gap-4">
                  {user?.username !== data?.user?.username && <EditProfile />}
                  {user?._id !== data?.user?._id && (
                    <button
                      className="btn btn-primary focus:outline-none w-[120px]"
                      title={
                        data?.user?.following?.includes(user?._id)
                          ? "Unfollow"
                          : "Follow"
                      }
                    >
                      {data?.user?.following?.includes(user?._id)
                        ? "Following"
                        : "Follow"}
                    </button>
                  )}
                  <button className="btn btn-soft btn-neutral focus:outline-none w-[120px] cursor-not-allowed">
                    Verify <i className="ri-verified-badge-fill"></i>
                  </button>
                </div>
              </div>
              <div className="hidden mt-6 md:flex items-center">
                <h1 className="text-lg flex-1">
                  <span className="font-bold mr-2">
                    {data?.userPostsCreated}
                  </span>
                  <span className="text-gray-500">Posts</span>
                </h1>
                <div className="flex items-center gap-4 text-center">
                  <Link to={`/profile/${username}/followers/mutuals`}>
                    <h1 className="text-lg w-[130px] cursor-pointer">
                      <span className="font-bold">
                        {data?.user?.followers?.length}
                      </span>
                      <span className="text-gray-500 ml-1">Followers</span>
                    </h1>
                  </Link>
                  <Link to={`/profile/${username}/following/connect`}>
                    <h1 className="text-lg w-[130px] cursor-pointer">
                      <span className="font-bold">
                        {data?.user?.following?.length}
                      </span>
                      <span className="text-gray-500 ml-1">Following</span>
                    </h1>
                  </Link>
                </div>
              </div>
              <h1 className="text-sm font-bold my-2">{data?.user?.fullname}</h1>
              <p>{data?.user?.bio || "Like what you see, my profile"}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
