import { useState } from "react";



export function useFiles() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [err, setErr] = useState(null);

  const handleFiles = (e) => {
    const files = e.target.files;
    if (files) {
      const fileArray = [...Array.from(files || [])];

      if (fileArray.length > 10) {
        setErr("You can only upload up to 10 media files");
        return;
      }

      const validFiles = fileArray.filter((file) => {
        if (
          !file.type.startsWith("image/") &&
          !file.type.startsWith("video/")
        ) {
          setErr("Please upload only image and video files");
          return false;
        }

        if (file.size > 10 * 1024 * 1024) {
          setErr("File size should not exceed 10MB");
          return false;
        }

        return true;
      });
      // clear previous files before adding new ones

      setSelectedFiles([]);
      setErr(null);

      // cover file to base64

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedFiles((prev) => [
            ...prev,
            { file, preview: reader.result },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  return { selectedFiles, setSelectedFiles, err, setErr, handleFiles };
}

export function useFile() {
  const [selectedFile, setSelectedFile] = useState("");
  const [err, setErr] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1000 * 1000) {
      setErr("File with maximum size of 5MB is allowed");
      return false;
    }
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onerror = () => {
        console.error("Error reading file:", file.name);
        setErr("Error reading file");
      };
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
    }
  };
  return { selectedFile, setSelectedFile, err, handleFile, setErr };
}