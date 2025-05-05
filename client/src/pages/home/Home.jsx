import { lazy, Suspense } from "react";
import Container from "../../componet/Container";
import MetaArgs from "../../componet/MetaArgs";
import Skeleton from "../../componet/Skeleton";
import { usePost } from "../../store";

const Card = lazy(() => import("./conponent/Card"));

export default function Home() {
  const { posts, loading } = usePost();

  return (
    <>
      <MetaArgs title="Instashot feed" content="Discover post" />
      <Container classname="container">
        <div className="grid grid-cols-12 gap-4 justify-between">
          <div className="col-span-12 lg:col-span-8">
            <div className="w-full md:max-w-[600px] 2xl:max-w-[700px] mx-auto">
              {loading ? (
                <Skeleton />
              ) : (
                <div className="w-full md:max-w-[450px] 2xl:max-w-[600px] mx-auto">
                  {posts?.length > 0 ? (
                    <Suspense fallback={<Skeleton />}>
                      {posts?.map((post) => (
                        <Card key={post?._id} post={post} />
                      ))}
                    </Suspense>
                  ) : (
                    <p className="my-8 text-center text-lg font-bold">
                      No post to display
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
