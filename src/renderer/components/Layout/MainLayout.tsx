import React from 'react';
import TitleBar from '../TitleBar/TitleBar';
import Sidebar from '../Sidebar/Sidebar';
import Editor from '../Editor/Editor';
import Preview from '../Preview/Preview';
import StatusBar from '../StatusBar/StatusBar';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout" data-testid="main-layout">
      <TitleBar />
      <div className="main-content">
        <Sidebar />
        <Editor />
        <Preview />
      </div>
      <StatusBar />
    </div>
  );
};

export default MainLayout;

