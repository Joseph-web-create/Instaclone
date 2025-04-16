import Container from "../../componet/Container";
import MetaArgs from "../../componet/MetaArgs";
import { usePost } from "../../store";

export default function Home() {
  const { posts, error, loading } = usePost();
  return (
    <>
      <MetaArgs title="Instashot feed" content="Discover post" />
      <Container classname="container">
        <div className="grid grid-cols-12 gap-4 justify-between">
          <div className="col-span-12 lg:col-span-8">
            <div className="w-full md:max-w-[450px] mx-auto"></div>
          </div>
        </div>
      </Container>
    </>
  );
}
