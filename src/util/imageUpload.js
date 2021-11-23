
import { useEffect, useRef, useState } from 'react';

const MAX_FILE_SIZE_BYTES = 5000000; // 5 mb

const FileUpload = (props) => {
    const postUpload = props.postUpload;
    const fetchAccepted = props.getAccepted;
    let [accepted, setAccepted] = useState("");
    let uploadInput = useRef();

    async function getAccepted() {
        let acceptedResponse = await fetchAccepted();
        let acceptedJson = await acceptedResponse.json();
        setAccepted(acceptedJson.join(", "));
    }

    async function uploadFile() {
        if (uploadInput.current.files.length === 0) return;

        let file = uploadInput.current.files[0];
        if (file.size > MAX_FILE_SIZE_BYTES) {
            alert("File size too large! Maximum is " + (MAX_FILE_SIZE_BYTES/1000000) + " mb.");
            return;
        }

        let formData = new FormData();
        formData.append("image", uploadInput.current.files[0]);
        let uploadResponse = await postUpload(formData);
        if (!uploadResponse.ok) {
            alert("Failed to upload!");
        }
    }

    useEffect(() => getAccepted(), []);

    return (accepted.length === 0 
        ? <p>Loading...</p>
        : <div>
            <input type="file" accept={accepted} ref={uploadInput}/>
            <button onClick={uploadFile}>Upload</button>
        </div>
    );
}

export default FileUpload;