import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import KategorijaPregled from './pages/kategorije/KategorijaPregled'
import Home from './pages/Home'
import KategorijaNovi from './pages/kategorije/KategorijaNovi'
function App() {
  

  return (
    <Container>
      <Izbornik />
      <Routes>
       <Route path={RouteNames.HOME} element={<Home />} />
       <Route path={RouteNames.KATEGORIJE} element={<KategorijaPregled />} />
       <Route path={RouteNames.KATEGORIJE_NOVI} element={<KategorijaNovi />} />
      </Routes>
      <hr />
      &copy; Slatkiši
      
    </Container>
    
  )
}
export default App
