import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectList from './ProjectList';
import CreateProject from './CreateProject';
import ProjectDetail from './ProjectDetail';

const Projects: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/create" element={<CreateProject />} />
            <Route path="/:id" element={<ProjectDetail />} />
        </Routes>
    );
};

export default Projects; 