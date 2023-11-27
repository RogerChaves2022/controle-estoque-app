"use client";
import { Header } from './components/header';
import Intro from './components/map';
import ProdutosPage from './pages/produtos';


export default function Home() {

 

  return (
    <main>
      <Header/>
      <ProdutosPage/>
      <Intro />
    </main>
  )
}
