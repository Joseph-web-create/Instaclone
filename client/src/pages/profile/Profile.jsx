import { useParams, Link, NavLink } from "react-router";
import { useAuth } from "../../store";
import MetaArgs from "../../componet/MetaArgs";
import ProfileImage from "./components/ProfileImage";

export default function Profile() {
  const { username } = useParams();
  const { accessToken, user } = useAuth();
  return (
    <>
      <MetaArgs
        title={`Your InstaShots profile - (@${username})`}
        content="Profile page"
      />
      <div className="py-5 px-4 lg:px-8 max-w-[950px] xl:max-w-[1024] mx-auto">
        <div className="mt-2 grid md:grid-cols-12 gap-4 md:gap-8 max-w-[700px] justify-center mx-auto px-4">
          <div className="md:col-span-4">
            <div className="flex gap-6">
              <ProfileImage />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
