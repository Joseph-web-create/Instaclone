import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import Modal from "../../componet/Modal";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../store";
import { getAPost } from "../../api/post";
import MetaArgs from "../../componet/MetaArgs";
import useSlideControle from "../../hooks/useSlideControle";
import LazyLoadingImage from "../../componet/LazyLoadingImage";

export default function Comment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname === `/post/${id}`;
  const { accessToken } = useAuth();

  const { data, setData } = useFetch({
    apiCall: getAPost,
    params: [id, accessToken],
  });
  const { comments, post } = data ?? {};

  const { currentImageIndex, handlePrevious, handleNext } = useSlideControle(
    post?.media
  );
  console.log(data);

  useEffect(() => {
    if (path) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
      navigate("/");
    }
  }, [navigate, path]);

  const handleClose = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  return (
    <>
      <MetaArgs
        title={`${post?.userId?.username} - ${post?.caption}`}
        content="View post details"
      />
      <Modal
        isOpen={isModalOpen}
        id="postModalComment"
        classname="w-[90%] max-w-[1024px] mx-auto p-0"
      >
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={handleClose}
        >
          <i className="ri-close-line text-xl"></i>
        </button>
        <div className="grid grid-cols-12 h-[700px]">
          <div className="col-span-12 lg:col-span-6">
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
                          classname="w-full h-[300px] lg:h-[700px] object-cover aspect-square shrink-0"
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
          </div>
          <div className="col-span-12 lg:col-span-6 lg:relative h-auto overflow-auto">
            <div className="p-4 w-[90%] mb-1 flex items-center justify-between border-b border-gray-300">
              <div className="flex gap-2 items-center">
                
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
