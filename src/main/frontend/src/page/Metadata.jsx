import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FileContext } from "../contexts/FileContext";

function Metadata() {
    const { selectedFile } = useContext(FileContext);
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        console.log("selectedFile:", selectedFile);

        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        // 비동기 함수 선언 후 즉시 실행
        const fetchMetadata = async () => {
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

        fetchMetadata();
    }, [selectedFile]);

    return (
        <div>
            <h2>이미지 메타데이터 추출</h2>
            {selectedFile && (
                <div>
                    <h3>📸 업로드 된 이미지</h3>
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="업로드된 이미지"
                        style={{maxWidth: 300, marginBottom: 16}}
                    />
                </div>
            )}
            {metadata && (
                <div>
                    <h3>📸 추출된 EXIF 메타데이터</h3>
                    <pre>{JSON.stringify(metadata, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Metadata;
