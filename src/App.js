import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import logo from './logo.svg';
import './App.css';
import Graph from "./Chart.js"
import Home from "./Home.js"
import AboutPage from "./About.js"
import {Navbar, Nav, Col, Row, Container} from "react-bootstrap"


function App() {
    return (
        <div className="bg-dark text-white lead" style={{overflow: 'hidden' }}>
          <Navbar bg="dark" variant="dark" expand="lg" style={{ borderBottom: "2px solid white"}}>
                <Container>
                    <Navbar.Brand href="/">Proton Projector</Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <Nav.Link href="/about">About</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/model" element={<Graph />} />
                <Route path="/about" element={<AboutPage />} />
               </Routes>
            </Router>
        </div>
  );
}

export default App;
