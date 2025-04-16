import {useState} from "react";
import axios from "axios";

function KMeans() {
    const [imageData, setImageData] = useState([]);
    const [numClusters, setNumClusters] = useState(3);  // 기본 클러스터 수
    const [result, setResult] = useState([]);

    // 파일 업로드 핸들러
    const handleFileChange = (event) => {
        const files = event.target.files;
        const data = [];

        // 파일에서 이미지 데이터를 추출하여 데이터 배열에 추가
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgData = extractImageData(e.target.result);
                data.push(imgData);
            };
            reader.readAsDataURL(file);
        });

        setImageData(data);  // 업로드된 이미지 데이터 상태 설정
    };

    // 이미지를 숫자 데이터로 변환하는 함수 (여기서는 임의로 숫자 데이터를 사용)
    const extractImageData = (imageSrc) => {
        // 이미지를 숫자 데이터로 변환하는 로직 필요 (예: 이미지 크기, 색상 값 등)
        // 현재는 임시로 [1, 2, 3] 형식의 데이터로 가정
        return [Math.random() * 10, Math.random() * 10, Math.random() * 10];
    };

    // 클러스터링 요청을 백엔드로 전송하는 함수
    const handleClusterImages = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/kmeans', imageData, {
                params: { numClusters },
            });
            setResult(response.data);  // 클러스터링 결과 설정
        } catch (error) {
            console.error("Error clustering images:", error);
        }
    };

    return (
        <div className="App">
            <h1>Image Clustering</h1>
            <div>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                />
            </div>
            <div>
                <label>Number of Clusters: </label>
                <input
                    type="number"
                    value={numClusters}
                    onChange={(e) => setNumClusters(Number(e.target.value))}
                />
            </div>
            <button onClick={handleClusterImages}>Cluster Images</button>

            <div>
                <h2>Cluster Results:</h2>
                <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
        </div>
    );
}

export default KMeans;