import { Routes, Route } from 'react-router-dom';
import StartApplication from './pages/StartApplication';
import ResumeApplication from './pages/ResumeApplication';
import NoMatch from './pages/NoMatch';
import { Container } from './components/styled-components';

function App() {
    return (
        <Container>
            <Routes>
                <Route path="/" element={<StartApplication />} />
                <Route path="/resume/:id" element={<ResumeApplication />} />
                <Route path="*" element={<NoMatch />} />
            </Routes>
        </Container>
    );
}

export default App;
