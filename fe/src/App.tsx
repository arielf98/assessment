
import { Container } from '@mantine/core';
import Dashboard from './features/dashboard/pages';

function App() {

  return (
    <Container strategy="grid" h={"100svh"} fluid style={{ background: "linear-gradient(180deg,rgba(219, 218, 204, 1) 0%, rgba(255, 255, 255, 1) 100%)" }}>
      <Dashboard />
    </Container>
  )
}

export default App
