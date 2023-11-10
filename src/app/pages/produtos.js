import { useState, useEffect } from 'react';
import axios from '../api/api-produtos';
import Produto from '../components/produto';
import { FaPlusCircle } from 'react-icons/fa';

const ProdutosPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ nome: '', classificacao: '', unidadeMedida: '' });
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
  }, []);

  const handleDeleteProduto = (produtoId) => {
    setProducts((prevProdutos) =>
      prevProdutos.filter((produto) => produto.id !== produtoId)
    );
  };

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('/produto', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ nome: '', classificacao: '', unidadeMedida: '' });
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const handleEditProduto = (produto) => {
    setProdutoEmEdicao(produto);
  };

  const handleCancelEdit = () => {
    setProdutoEmEdicao(null);
  };


  const filteredProducts = products.filter((product) =>
  product.nome.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="container">
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
        <br />
        <button onClick={handleAddProduct}> <FaPlusCircle /></button>
      </div>
      <h1>Lista de Produtos</h1>
      <input className='barra-pesquisa'
  type="text"
  placeholder="Pesquisar produtos..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/><br/>
{filteredProducts.length === 0 ? (
  <p>Nenhum produto corresponde à pesquisa.</p>
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