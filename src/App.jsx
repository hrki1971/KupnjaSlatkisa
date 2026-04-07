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

import SlatkisPregled from './pages/slatkisi/SlatkisPregled'
import SlatkisNovi from './pages/slatkisi/SlatkisNovi'
import SlatkisPromjena from './pages/slatkisi/SlatkisPromjena'

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

       <Route path={RouteNames.SLATKIŠI} element={<SlatkisPregled />} />
       <Route path={RouteNames.SLATKIŠI_NOVI} element={<SlatkisNovi />} />
       <Route path={RouteNames.SLATKIŠI_PROMJENA} element={<SlatkisPromjena />} />
      </Routes>
      </Container>
      <hr />
      &copy; {IME_APLIKACIJE}
      
    </Container>
    
  )
}
export default App
