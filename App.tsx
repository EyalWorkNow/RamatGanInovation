
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SuggestionsFeed from './pages/SuggestionsFeed';
import SubmitSuggestion from './pages/SubmitSuggestion';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<SuggestionsFeed />} />
          <Route path="/submit" element={<SubmitSuggestion />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
