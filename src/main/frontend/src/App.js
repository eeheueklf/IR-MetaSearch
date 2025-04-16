import {BrowserRouter, Meta, Route, Routes} from 'react-router-dom';
import Metadata from "./page/Metadata";
import KMeans from "./page/KMeans";
import Metasearch from "./page/Metasearch";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Metadata />} />
                    <Route path="/kmeans" element={<KMeans />} />
                    <Route path="/search" element={<Metasearch/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}


export default App;