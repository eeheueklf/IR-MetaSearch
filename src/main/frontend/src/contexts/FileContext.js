import React, { createContext, useState } from 'react';

export const FileContext = createContext();

export function FileProvider({ children }) {
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <FileContext.Provider value={{ selectedFile, setSelectedFile }}>
            {children}
        </FileContext.Provider>
    );
}
