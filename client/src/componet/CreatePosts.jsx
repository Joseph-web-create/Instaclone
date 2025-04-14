import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";

const CreatePosts = () => {
  const [isModalOpen, setIsModalOpen] = useState();
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

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
          x
        </button>
        <form className="mt-4">
          <>
            {step === 1 && (
              <div className="form-contol w-full">
                <label
                  htmlFor="media"
                  className="h-[300px] border-2 border-dashed rounded-lg flex items-center justify-center overflow-auto p-2 cursor-pointer"
                >
                  <div className="text-center">
                    <i className="ri-image-add-fill text-4xl"></i>
                    <p className="text-xs text-gray-500">
                      Upload up to 10 files (max 10mb each)
                    </p>
                  </div>
                </label>
                <input
                  type="file"
                  name="media"
                  accept="image/*, video/*"
                  multiple
                  id="media"
                  className="hidden"
                />
              </div>
            )}
          </>
        </form>
      </Modal>
    </>
  );
};

export default CreatePosts;
