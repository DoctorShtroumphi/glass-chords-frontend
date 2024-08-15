// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import ChordGenerator from './components/ChordGenerator';
import ConsentPage from './components/ConsentPage';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ExplanationPanel from './components/ExplanationPanel';

const App = () => {
  const [chordData, setChordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);

  const [panelsVisible, setPanelsVisible] = useState(false);
  const [activePanel, setActivePanel] = useState(null);

  const handleConsent = () => {
    setConsentGiven(true)

    // Trigger resize event after consent is given to ensure the grid displays correctly
    window.dispatchEvent(new Event('resize'));
  };

  useEffect(() => {
    // Fetch the chord data from the backend API
    const fetchChordData = async () => {
      try {
        const response = await axios.get('https://glass-chords-backend-ddebb2ffdbec.herokuapp.com/chord_data');
        setChordData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chord data", error);
        setLoading(false);
      }
    };

    fetchChordData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">GlassChords</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/consent-info">Consent Info</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Routes>
          {/* Consent Info Page */}
          <Route path="/consent-info" element={<ConsentPage onConsent={() => {}} hasConsented={consentGiven} />} />

          {/* Main Chord Generator Page */}
          <Route
            path="/"
            element={
              consentGiven ? (
                <>
                  <ExplanationPanel 
                    panelsVisible={panelsVisible}
                    activePanel={activePanel} 
                  />
                  <h1>GlassChords Generator</h1>
                  <ChordGenerator 
                    chordData={chordData} 
                    panelsVisible={panelsVisible}
                    setPanelsVisible={setPanelsVisible}
                    activePanel={activePanel}
                    setActivePanel={setActivePanel}
                  />
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', marginBottom: '35px' }}>
                    <Button 
                      variant="secondary" 
                      href="https://forms.gle/v9WmaiTCzu6aoijx7" 
                      target="_blank"
                      style={{ padding: '15px 30px', fontSize: '18px' }}
                    >
                      Move on to Survey
                    </Button>
                  </div>
                </>
              ) : (
                <ConsentPage onConsent={handleConsent} hasConsented={consentGiven} />
              )
            }
          />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
