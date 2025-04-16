import {useState} from "react";
import axios from "axios";

function Metasearch() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [metadata, setMetadata] = useState(null);

    // 파일 선택 핸들러
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // 파일 업로드 및 메타데이터 요청
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("파일을 선택하세요.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post('http://localhost:8080/api/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setMetadata(response.data);  // GPS 정보와 메타데이터 표시
        } catch (error) {
            console.error("메타데이터 추출 오류:", error);
        }
    };

    return (
        <div>
            <h2>이미지 메타데이터 추출</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>업로드</button>

            {metadata && (
                <div>
                    <h3>📸 EXIF 메타데이터</h3>
                    <pre>{JSON.stringify(metadata, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Metasearch;