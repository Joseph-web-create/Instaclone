import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import { useFiles } from "../hooks/useFile";
import useTags from "../hooks/useTags";
import { createPost } from "../api/post";
import { toast } from "sonner";
import { useAuth } from "../store";
import handleError from "../utils/handlleError";

const CreatePosts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const { selectedFiles, setSelectedFiles, err, handleFiles } = useFiles();

  const { tags, setTags, handleTags, removeTag } = useTags();

  const { accessToken } = useAuth();

  function handlePrev() {
    setStep((prev) => prev - 1);
  }
  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const formSubmit = async (data) => {
    const formData = {
      ...data,
      tags,
      media: selectedFiles.map(({ preview }) => preview),
    };
    try {
      const res = await createPost(formData, accessToken);
      if (res.status === 201) {
        toast.success(res.data.message, { id: "Image" });
        reset();
        setTags([]);
        setSelectedFiles([]);
        setIsModalOpen(false);
        setStep(1);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div
        className="tooltip tooltip-right flex gap-3 items-center p-2 cursor-pointer hover:font-bold hover:text-zinc-800 hover:transition duration-150 ease-out rounded-lg z-50 hover:bg-zinc-100"
        data-tip="Create Post"
        onClick={() => setIsModalOpen(true)}
      >
        <i className="ri-add-box-line text-2xl"></i>
        <span className="text-lg">Create post</span>
      </div>
      <Modal
        isOpen={isModalOpen}
        title={step === 1 ? "Create new post" : "Add post details"}
        id="createPostModal"
        classname="max-w-xl"
      >
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={() => setIsModalOpen(false)}
        >
          <i className="ri-close-line text-xl"></i>
        </button>
        <form className="mt-4" onSubmit={handleSubmit(formSubmit)}>
          <>
            {step === 1 && (
              <div className="form-contol w-full">
                <label
                  htmlFor="media"
                  className="h-[300px] border-2 border-dashed rounded-lg flex items-center justify-center overflow-auto p-2 cursor-pointer"
                >
                  {selectedFiles.length === 0 ? (
                    <div className="text-center">
                      <i className="ri-image-add-fill text-4xl"></i>
                      <p className="text-xs text-gray-500">
                        Upload up to 10 files (max 10mb each)
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 w-full relative z-20">
                      {selectedFiles.map(({ file, preview }, index) => (
                        <div key={index} className="relative group">
                          {file.type.startsWith("image") && (
                            <img
                              src={preview}
                              alt="preview"
                              className="w-full h-[120px] object-cover rounded-lg"
                            />
                          )}
                          {file.type.startsWith("video") && (
                            <video
                              src={preview}
                              controls
                              className="w-full h-[120px] object-contain rounded-lg"
                            />
                          )}
                          <button
                            type="button"
                            className="absolute top-1 right-1 btn btn-circle btn-xs bg-[#8D0D76] text-white opacity-0 group-hover:opacity-100 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedFiles((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  name="media"
                  accept="image/*, video/*"
                  multiple
                  id="media"
                  className="hidden"
                  onChange={handleFiles}
                />
                {err && (
                  <span className="mt-4 text-xs text-red-600">{err}</span>
                )}
              </div>
            )}
          </>
          <>
            {step === 2 && (
              <>
                <div>
                  <label className="floating-label">
                    <span>Caption</span>
                    <input
                      type="text"
                      placeholder="Caption"
                      id="caption"
                      className="input input-md w-full"
                      {...register("caption", { required: true })}
                    />
                  </label>
                  {errors?.caption && (
                    <span className="text-xs text-red-600">
                      Give your post a caption
                    </span>
                  )}
                </div>
                <div className="my-6">
                  <label className="floating-label">
                    <span>Description</span>
                    <textarea
                      placeholder="Description"
                      className="textarea textarea-md w-full"
                      id="description"
                      {...register("description")}
                    ></textarea>
                  </label>
                </div>
                <div className="my-6">
                  <label className="floating-label">
                    <span>Tags</span>
                    <input
                      type="text"
                      className="input input-md w-full"
                      id="tags"
                      placeholder="Add Tags, press enter key to add a tag"
                      onKeyDown={handleTags}
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2 text-gray-400">
                  {tags.map((tag, index) => (
                    <div
                      className="badge badge-neutral gap-2 cursor-pointer "
                      key={index}
                      onClick={() => removeTag(index)}
                    >
                      {tag}
                      <span className="text-white">
                        <i className="ri-close-line text-xl"></i>
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="btn bg-[#8D0D76] text-white mt-4 w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sharing post..." : "Share"}
                </button>
              </>
            )}
          </>
          <div className="modal-action items-center">
            {step && selectedFiles.length > 0 && (
              <div className="flex gap-4">
                <button
                  className={`btn btn-sm ${
                    step === 2 ? "bg-[#8D0D76] text-white" : ""
                  }`}
                  type="button"
                  disabled={step === 1}
                  onClick={handlePrev}
                >
                  Prev
                </button>
                <button
                  className="btn btn-sm bg-[#8d0d76] text-white"
                  type="button"
                  disabled={step === 2}
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreatePosts;
