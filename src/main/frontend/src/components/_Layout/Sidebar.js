import React from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    return (
        <SidebarContainer>
            <LogoContainer onClick={() => navigate("/")}>
                <span>METASEARCH</span>
            </LogoContainer>

        </SidebarContainer>
    );
};

const SidebarContainer = styled.aside`
    display: table-cell;
    width: 280px;
    position: fixed;
    overflow-x: hidden;
    overflow-y: auto;
    top: 0;
    bottom: 0;
    z-index: 1;
    // padding-right: 20px;
    padding-top: 80px;
    background-color: white;

    @media screen and (max-width: 1360px) {
        display: none;
    }
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 40px;
    cursor: pointer;
    font-size: 1.4rem;
    color: #333;
    gap: 10px;
    font-family: 'SUIT', sans-serif;
    span {
        background-color: var(--point_color);
    }
    
`;



export default Sidebar;