import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FileContext } from "../contexts/FileContext";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

function Metadata() {
    const { selectedFile } = useContext(FileContext);
    const [metadata, setMetadata] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
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
                setError(null);              // 에러 메시지 초기화
            } catch (error) {
                let message = "메타데이터 추출 오류";
                if (error.response && error.response.data && error.response.data.error) {
                    message = error.response.data.error;
                }
                setError(message);           // 에러 메시지 상태에 저장
                setMetadata(null);           // 메타데이터 초기화
                console.error("메타데이터 추출 오류:", error);
            }
        };

        fetchMetadata();
    }, [selectedFile]);

    return (
        <div>
            <ResultWrap>
                <h1>이미지 메타데이터 추출하기</h1>
                <h3>📸 업로드 된 이미지</h3>
                {selectedFile ? (
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="업로드된 이미지"
                    />
                ) : (
                    <PreviewPlaceholder>
                        이미지 없음
                    </PreviewPlaceholder>
                )}


                <h3>📰 추출된 EXIF 메타데이터</h3>
                {error && <div style={{ color: 'red' }}>{error}</div>}

                {metadata && (
                    <pre>{JSON.stringify(metadata, null, 2)}</pre>
                )}

            </ResultWrap>
            <ButtonContainer>
            {/*<DateTimeFilter/>*/}

                <FloatingButton
                    onClick={() => navigate("/searchfilter", {
                        state: {
                            fileName: selectedFile?.name
                        }
                    })}
                    disabled={!selectedFile}
                    style={{
                        backgroundColor: selectedFile ? '#000' : '#666',
                        cursor: selectedFile ? 'pointer' : 'default'
                    }}
                >
                    📸 + 이미지 검색하기
                </FloatingButton>
            </ButtonContainer>
        </div>
    );
}

const ResultWrap = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column; 
    overflow-y: auto;
    position: relative;
    margin-top:20px;
`;

const ButtonContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column; 
    overflow-y: auto;
    position: relative; 
`;

const FloatingButton = styled.button`
  align-self: flex-end;
  margin: 50px 0;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(55, 58, 61);
  }
`;

const PreviewPlaceholder = styled.div`
  width: 100%;
  min-height: 400px;
  background-color: #ccc;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  border-radius: 8px;
  font-size: 1rem;
`;
export default Metadata;
