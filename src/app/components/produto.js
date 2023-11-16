import { FaMinusCircle, FaPencilAlt } from 'react-icons/fa';
import { BsFillCheckCircleFill, BsFillXCircleFill } from 'react-icons/bs'
import { useState } from 'react';
import axios from '../api/api-produtos';
import Modal from 'react-modal';

const Produto = ({ product, onDelete, onEdit, onUpdateProduct, products, lancamentos, setLancamentos }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState({ ...product });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLancamento, setNewLancamento] = useState({ tipoLancamento: 'entrada', quantidade: 0 });
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false); // Novo estado para controle do modal de confirmação
    const [productToDelete, setProductToDelete] = useState(null); // Novo estado para armazenar o produto a ser excluído
    const [isDeleteLancamentoConfirmationOpen, setIsDeleteLancamentoConfirmationOpen] = useState(false); // Novo estado para controle do modal de confirmação
    const [lancamentoToDelete, setLancamentoToDelete] = useState(null); // Novo estado para armazenar o produto a ser excluído

    const deletarProductModal = (id) => {
        // Abre o modal de confirmação e armazena o produto a ser excluído
        setIsDeleteConfirmationOpen(true);
        setProductToDelete(products.find((product) => product.id === id));
    };

    const confirmarExclusao = () => {
        // Executa a exclusão do produto
        deletarProduct(productToDelete.id);
        setIsDeleteConfirmationOpen(false);
    };

    const cancelarExclusao = () => {
        // Cancela a exclusão
        setIsDeleteConfirmationOpen(false);
        setProductToDelete(null);
    };

    const deletarProduct = async (id) => {
        console.log("executar delete");
        try {
            const response = ((await axios.delete('/produto/'.concat(id))))

            if (response.status === 204) {
                console.log('Produto excluído com sucesso.');
                onDelete(id);
            } else {
                console.log('A solicitação DELETE não foi bem-sucedida.');
            }
        } catch (error) {
            console.error('Erro ao remover produto:', error);
        }
    }

    const deletarLancamentoModal = (id) => {
        // Abre o modal de confirmação e armazena o Lancamento a ser excluído
        setIsDeleteLancamentoConfirmationOpen(true);
        setLancamentoToDelete(lancamentos.find((lancamento) => lancamento.id === id));
    };

    const confirmarExclusaoLancamento = () => {
        // Executa a exclusão do produto
        deletarLancamento(lancamentoToDelete.id);
        setIsDeleteLancamentoConfirmationOpen(false);
    };

    const cancelarExclusaoLancamento = () => {
        // Cancela a exclusão
        setIsDeleteLancamentoConfirmationOpen(false);
        setLancamentoToDelete(null);
    };

    const deletarLancamento = async (id) => {
        console.log("executar delete");
        try {
            const response = ((await axios.delete('/lancamento/'.concat(id))))

            if (response.status === 204) {
                console.log('Lançamento excluído com sucesso.');
                setLancamentos((prevlancamentos) =>
                    prevlancamentos.filter((lancamento) => lancamento.id !== id))
            } else {
                console.log('A solicitação DELETE não foi bem-sucedida.');
            }
        } catch (error) {
            console.error('Erro ao remover lancamento:', error);
        }
    }

    const handleEditClick = () => {
        onEdit(product);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedProduct({ ...product });
    };

    const handleSaveEdit = async () => {
        try {
            const response = ((await axios.put('/produto/'.concat(editedProduct.id), editedProduct)))

            if (response.status === 200) {
                console.log('Produto Alterado com sucesso.');
                const updatedProducts = products.map((product) =>
                    product.id === editedProduct.id ? editedProduct : product
                );
                onUpdateProduct(updatedProducts);
                setIsEditing(false);
            } else {
                console.log('A solicitação PUT não foi bem-sucedida.');
            }
        } catch (error) {
            console.error('Erro ao Alterar produto:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct({
            ...editedProduct,
            [name]: value,
        });
    };

    const openModal = async () => {
        try {
            const response = await axios.get(`/lancamento/${product.id}`);
            setLancamentos(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Erro ao buscar lançamentos:', error);
        }
    };

    const closeModal = () => {
        console.log(lancamentos)
        setLancamentos([]);
        setIsModalOpen(false);
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '10px',
        },

    }

    const isFormValid = () => {
        // Verifique se todos os campos obrigatórios estão preenchidos
        return newLancamento.tipoLancamento && newLancamento.quantidade > 0;
    };

    const handleLancamentoSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/lancamento/${newLancamento.tipoLancamento}?produtoId=${product.id}&quantidade=${newLancamento.quantidade}`);
            // Atualize a lista de lançamentos
            if (response.status === 200) {
                setLancamentos([...lancamentos, response.data]);
                setNewLancamento({ tipoLancamento: 'entrada', quantidade: 0 });
            } else {
                console.log('A solicitação POST não foi bem-sucedida.');
            }
        } catch (error) {
            console.error('Erro ao adicionar lançamento:', error);
        }
    };

    return (
        <div>
            {isEditing ? (
                <div>
                    <div className="edit-product-form">
                        <img src="/produto.png" alt="produto" width={100} />
                        <br />
                        Nome:<br />
                        <input
                            type="text"
                            name="nome"
                            placeholder="Nome do Produto"
                            value={editedProduct.nome}
                            onChange={handleInputChange}
                        /><br />
                        Classificação:<br />
                        <input
                            type="text"
                            name="classificacao"
                            placeholder="Classificação do Produto"
                            value={editedProduct.classificacao}
                            onChange={handleInputChange}
                        /><br />
                        Unidade de Medida:<br />
                        <input
                            type="text"
                            name="unidadeMedida"
                            placeholder="Unidade Medida do Produto"
                            value={editedProduct.unidadeMedida}
                            onChange={handleInputChange}
                        /><br />
                        Quantidade Maxima:<br />
                        <input
                            type="number"
                            name="quantidadeMaxima"
                            min={1}
                            placeholder="Quantidade Maxima do Produto"
                            value={editedProduct.quantidadeMaxima}
                            onChange={handleInputChange}
                        /><br />
                        <button onClick={handleSaveEdit}><BsFillCheckCircleFill color='green' size={20} /></button>
                        <button onClick={handleCancelEdit}><BsFillXCircleFill color='red' size={20} /></button>
                    </div>
                </div>
            ) : (
                <div className="product">
                    <button onClick={openModal}><img src="/produto.png" alt="produto" width={100} /></button>
                    <h2>{product.nome}</h2>
                    Classificação:
                    {product.classificacao}<br />
                    Quantidade:
                    {product.quantidade}<br />
                    Unidade de Medida:
                    {product.unidadeMedida}<br />
                    Quantidade Máxima:
                    {product.quantidadeMaxima}<br />
                    <button onClick={handleEditClick}><FaPencilAlt color="blue" size={20} /></button>
                    <button onClick={() => deletarProductModal(product.id)}>
                        <FaMinusCircle color="red" size={20} />
                    </button>
                </div>
            )}

            <div className='ReactModal'>
                {/* Modal de Lançamentos */}
                <Modal
                    style={customStyles}
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Lançamentos do Produto"
                >
                    <button className='close-button' onClick={closeModal}><BsFillXCircleFill color='red' size={20} /></button>
                    <h2>Lançamentos de {product.nome}</h2>
                    {lancamentos.length === 0 ? (<p>Sem Lançamentos</p>) : (<table>
                        <thead>
                            <tr>
                                <th>Tipo de Lançamento</th>
                                <th>Quantidade</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lancamentos.map((lancamento) => (
                                <tr key={lancamento.id}>
                                    <td>{lancamento.tipoLancamento}</td>
                                    <td>{lancamento.quantidade}</td>
                                    <td>{lancamento.dtHrCriacao}</td>
                                    <td><button onClick={() => deletarLancamentoModal(lancamento.id)}>
                                        <FaMinusCircle color="red" size={20} />
                                    </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>)}

                    <form className='form-lancamento' onSubmit={handleLancamentoSubmit}>
                        <label htmlFor="lancamento-novo">Tipo de Lançamento:</label>
                        <select
                            id="lancamento-novo"
                            name="tipoLancamento"
                            value={newLancamento.tipoLancamento}
                            onChange={(e) => setNewLancamento({ ...newLancamento, tipoLancamento: e.target.value })}
                        >
                            <option value="entrada">Entrada</option>
                            <option value="saida">Saída</option>
                        </select>

                        <label htmlFor="quantidade">Digite a quantidade:</label>
                        <input
                            type="number"
                            min={1}
                            id="quantidade"
                            name="quantidade"
                            value={newLancamento.quantidade}
                            onChange={(e) => setNewLancamento({ ...newLancamento, quantidade: parseInt(e.target.value) })}
                        />

                        <button type="submit" disabled={!isFormValid()}>Enviar</button>
                    </form>

                </Modal>

                <Modal
                    style={customStyles}
                    isOpen={isDeleteConfirmationOpen}
                    contentLabel="Confirmação de Exclusão"
                >
                    <h2>Confirmar Exclusão</h2>
                    {productToDelete && (
                        <div className='modal'>
                            <p>Tem certeza de que deseja excluir o produto {productToDelete.nome}?</p>
                            <button onClick={confirmarExclusao}>Sim</button>
                            <button onClick={cancelarExclusao}>Não</button>
                        </div>
                    )}
                </Modal>

                <Modal
                    style={customStyles}
                    isOpen={isDeleteLancamentoConfirmationOpen}
                    contentLabel="Confirmação de Exclusão"
                >
                    <h2>Confirmar Exclusão</h2>
                    {lancamentoToDelete && (
                        <div className='modal'>
                            <p>Tem certeza de que deseja excluir o Lancamento?</p>
                            <button onClick={confirmarExclusaoLancamento}>Sim</button>
                            <button onClick={cancelarExclusaoLancamento}>Não</button>
                        </div>
                    )}
                </Modal>

            </div>
        </div>
    );
};

export default Produto;
