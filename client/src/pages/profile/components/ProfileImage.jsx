import React, { useRef, useState, useEffect, useCallback } from "react";
import Modal from "../../../componet/Modal";
import { useFile } from "../../../hooks/useFile";
import handleError from "../../../utils/handlleError";
import { updateProfilePicture } from "../../../api/auth";
import { useAuth } from "../../../store";
import { toast } from "sonner";

export default function ProfileImage({ data, user, setData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef(null);
  const hasSubmitted = useRef(false);
  const { selectedFile, setSelectedFile, handleFile } = useFile();
  const { accessToken, setUser } = useAuth();

  const onFormSubmit = useCallback(async () => {
    if (fileRef.current && !hasSubmitted.current) {
      setIsSubmitting(true);
      const formdata = {
        profilePicture: selectedFile,
      };
      try {
        const res = await updateProfilePicture(formdata, accessToken);
        if (res.status === 200) {
          toast.success(res.data.message);
          setData((prev) => ({
            ...prev,
            user: {
              ...prev.user,
              profilePicture: res.data.user.profilePicture,
            },
          }));
          setUser(res.data.user);
          setIsOpen(false);
          setSelectedFile("");
        }
      } catch (error) {
        handleError(error);
        setSelectedFile("");
        hasSubmitted.current = false;
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [selectedFile, accessToken, setData, setUser, setSelectedFile]);

  useEffect(() => {
    fileRef.current = selectedFile;
    if (selectedFile !== "") {
      onFormSubmit();
    }
  }, [onFormSubmit, selectedFile, setSelectedFile]);

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
            {data?.user?.profilePicture ? (
              <img
                src={data?.user?.profilePicture}
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
              <span className="cursor-pointer">
                {isSubmitting ? "Uploading..." : "Upload new profile image"}
              </span>
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                className="hidden"
                onChange={handleFile}
              />
            </label>
          </div>
        </form>
        <div className="divider"></div>
        <p
          className="text-center cursor-pointer"
          role="buttong"
          onClick={() => {
            setSelectedFile("");
            setIsOpen(false);
            hasSubmitted.current = false;
          }}
        >
          Cancel
        </p>
      </Modal>
    </>
  );
}
