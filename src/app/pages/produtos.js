import { useState, useEffect } from 'react';
import axios from '../api/api-produtos';
import Produto from '../components/produto';
import { FaPlusCircle } from 'react-icons/fa';
import { FiAlertTriangle } from "react-icons/fi";
import {BsFillXCircleFill} from 'react-icons/bs';
const ProdutosPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ nome: '', classificacao: '', unidadeMedida: '', quantidadeMaxima: null });
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);
  const [lancamentos, setLancamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productsAlert, setProductsAlert] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/produto');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    
    fetchProducts();
  }, [lancamentos]);
  
  useEffect(() =>{
    const filtro = products.filter((product)=> product.quantidadeMaxima <= product.quantidade);
    setProductsAlert(filtro);
  },[products]);

  const handleDeleteProduto = (produtoId) => {
    setProducts((prevProdutos) =>
      prevProdutos.filter((produto) => produto.id !== produtoId)
    );
  };

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('/produto', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ nome: '', classificacao: '', unidadeMedida: '', quantidadeMaxima: 1});
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const handleEditProduto = (produto) => {
    setProdutoEmEdicao(produto);
  };

  // const handleCancelEdit = () => {
  //   setProdutoEmEdicao(null);
  // };


  const filteredProducts = products.filter((product) =>
  product.nome.toLowerCase().includes(searchTerm.toLowerCase())
);

 const closeAlert = (produto) => {
    setProductsAlert((prevProdutos) => prevProdutos.filter((alert) => alert.id !== produto.id))
  }

  return (
    <div className="container">
        {productsAlert && productsAlert.map((product)=>(
          <div key={product.id} className='alerta'><FiAlertTriangle size={30} className='icon'/>{product.nome} está com a quantidade máxima em estoque!<button onClick={()=>closeAlert(product)}><BsFillXCircleFill size={30} /></button></div>
        ))}
      <div className="add-product-form">
      <h2>Adicionar Produto</h2>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={newProduct.nome}
          onChange={(e) => setNewProduct({ ...newProduct, nome: e.target.value })}
        />
        <input
          type="text"
          placeholder="Classificação do Produto"
          value={newProduct.classificacao}
          onChange={(e) => setNewProduct({ ...newProduct, classificacao: e.target.value })}
        />
        <input
          type="text"
          placeholder="Unidade Medida do Produto"
          value={newProduct.unidadeMedida}
          onChange={(e) => setNewProduct({ ...newProduct, unidadeMedida: e.target.value })}
        />
        <input
          type="number"
          min={1}
          placeholder="Quantidade Maxima do Produto"
          value={newProduct.quantidadeMaxima}
          onChange={(e) => setNewProduct({ ...newProduct, quantidadeMaxima: e.target.value })}
        />
        <br />
        <button onClick={handleAddProduct}> <FaPlusCircle /></button>
      </div>
      <h2>Lista de Produtos</h2>
      <input className='barra-pesquisa'
  type="text"
  placeholder="Pesquisar produtos..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/><br/>
{filteredProducts.length === 0 ? (
  <div className='sem-resultados-pesquisa'>
  <p >Nenhum produto corresponde à pesquisa.</p>
  </div>
) : (
      <div className="product-list">
        {filteredProducts.map((product) => (
          <div key={product.id}>
            <Produto
              key={product.id}
              product={product}
              onDelete={handleDeleteProduto}
              onEdit={handleEditProduto}
              onUpdateProduct={setProducts}
              lancamentos={lancamentos}
              setLancamentos={setLancamentos}
              products={products}
            />
            {/* <button onClick={() => handleCancelEdit(null)}>Cancelar Edição</button> */}
          </div>
        ))}
      </div>)}
    </div>
  );
};

export default ProdutosPage;