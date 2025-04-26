import { BrowserRouter as Router } from 'react-router-dom';
import Index from "./components/_Layout/index";
import { FileProvider } from "./contexts/FileContext";


function App() {
    return (
        <FileProvider>
            <Router>
                <Index />
            </Router>
        </FileProvider>
    );
}


export default App;