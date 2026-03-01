import { Container, VStack, Flex } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/ui/layout/NavBar';
import Footer from './components/ui/layout/Footer';
import BlogRoutes from './components/ui/Contents/BlogRoutes';
import Home from './components/ui/Contents/Home';
import Photography from './components/ui/Contents/Photography';

function App() {

  function NotFound() {
    return <div>Page Not Found</div>;
  };

  return (
    <Router>
      <Flex direction="column" minH="100vh">
        <NavBar />
        <Container maxW="100%" mx="auto" p={4} flex="1">
          <VStack width={{ base: "90%", md: "90%", lg: "90%" }} mx="auto" align="stretch">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog/*" element={<BlogRoutes />} />
              <Route path="/photography" element={<Photography />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </VStack>
        </Container>
        <Footer />
      </Flex>
    </Router>
  )
}

export default App;