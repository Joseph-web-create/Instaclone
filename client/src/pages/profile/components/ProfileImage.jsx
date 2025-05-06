import React, { useRef, useState } from "react";
import Modal from "../../../componet/Modal";

export default function ProfileImage({ data, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const fileRef = useRef();
  const hasSubmitted = useRef(false);
  return (
    <>
      <div
        className={`avatar flex justify-center ${
          user?.username === data?.user?.username ? "cursor-pointer" : ""
        }`}
        onClick={
          user?.username === data?.user?.username
            ? () => setIsOpen(true)
            : () => {}
        }
      >
        <div className="avatar avatar-placeholder">
          <div
            className={`w-20 md:w-[160px] rounded-full border border-gray-300`}
          >
            {data?.user?.priflePicture ? (
              <img
                src={data?.user?.ProfileImage}
                alt={data?.user?.username}
                title="Change profile image"
              />
            ) : (
              <span className="text-7xl" title="Change profile image">
                {data?.user?.username.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        id="updateProfileImage"
        title="change profile image"
        classname="w-[90%] max-w-[400px] mx-auto py-3 px-0"
        onClose={() => setIsOpen(false)}
      >
        <div className="divider"></div>
        <form className="px-4 text-center">
          <div className="form-control w-full">
            <label htmlFor="profilePicture" className="label">
              <span className="cursor-pointer">Upload new profile image</span>
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                className="hidden"
              />
            </label>
          </div>
        </form>
      </Modal>
    </>
  );
}
