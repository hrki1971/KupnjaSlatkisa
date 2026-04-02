import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { Route, Routes } from 'react-router-dom'
import { IME_APLIKACIJE, RouteNames } from './constants'
import KategorijaPregled from './pages/kategorije/KategorijaPregled'
import Home from './pages/Home'
import KategorijaNovi from './pages/kategorije/KategorijaNovi'
import KategorijaPromjena from './pages/kategorije/KategorijaPromjena'
function App() {
  

  return (
    <Container style={ {backgroundColor: window.location.hostname === 'localhoast' ? '#ffefea' : 'none'}}>
      <Izbornik />
      <Container className='app'>
      <Routes>
       <Route path={RouteNames.HOME} element={<Home />} />
       <Route path={RouteNames.KATEGORIJE} element={<KategorijaPregled />} />
       <Route path={RouteNames.KATEGORIJE_NOVI} element={<KategorijaNovi />} />
       <Route path={RouteNames.KATEGORIJE_PROMJENA} element={<KategorijaPromjena />} />
      </Routes>
      </Container>
      <hr />
      &copy; {IME_APLIKACIJE}
      
    </Container>
    
  )
}
export default App
