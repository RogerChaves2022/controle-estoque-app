import { useEffect, useState } from 'react';
import { BsFillXCircleFill } from 'react-icons/bs';
import { FiAlertTriangle } from "react-icons/fi";
import axios from '../api/api-produtos';
import { Input } from '../components/input';
import Produto from '../components/produto';
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
        <Input 
          value={newProduct.nome}
          label={'Nome'}
          handleChange={e => setNewProduct({ ...newProduct, nome: e.target.value })}
          placeholder='Nome do Produto'
        />
        <Input 
          value={newProduct.classificacao}
          label={'Classificação'}
          handleChange={e => setNewProduct({ ...newProduct, classificacao: e.target.value })}
          placeholder='Classificação do Produto'
        />
        <Input
          value={newProduct.unidadeMedida}
          label={'Unidade de Medida'}
          placeholder="Unidade de Medida do Produto"
          handleChange={(e) => setNewProduct({ ...newProduct, unidadeMedida: e.target.value })}
        />
        <Input
          type="number"
          min={1}
          label={'Quantidade Máxima'}
          placeholder="Quantidade Máxima do Produto"
          value={newProduct.quantidadeMaxima}
          handleChange={(e) => setNewProduct({ ...newProduct, quantidadeMaxima: e.target.value })}
        />
        <br />
        <button onClick={handleAddProduct}> Adicionar</button>
      </div>
      <h2>Lista de Produtos</h2>
      <Input 
      type="text"
      placeholder="Pesquisar produtos..."
      value={searchTerm}
      handleChange={(e) => setSearchTerm(e.target.value)}
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