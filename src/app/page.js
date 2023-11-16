"use client";
import ProdutosPage from './pages/produtos'
import MapContainer from './pages/enderecos';
import FindLocation from './components/findLocation';
import { LoadScript, useLoadScript } from '@react-google-maps/api';
import Intro from './components/map';


export default function Home() {

 

  return (
    <main>
      <ProdutosPage/>
      <Intro />
    </main>
  )
}

