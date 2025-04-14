import { useState } from "react";

export function useFiles() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [err, setErr] = useState(null);

  const handleFiles = (e) => {
    const files = e.target.files;
    if (files) {
      const fileArray = [...Array.from(files || [])];
      const errors = [];
      
      if (fileArray.length > 10) {
      }
    }
  };
}
