import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const ModalDeletar = ({ modalDeletar, handleDelete, setModalDeletar }) => {
	if (!modalDeletar.aberto) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
			<div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
				<div className="flex items-center mb-4">
					<FontAwesomeIcon icon={faExclamationCircle} className="text-red-600 mr-2" />
					<h3 className="text-2xl font-bold">Deletar Colchão</h3>
				</div>
				<p>Tem certeza que deseja deletar o colchão {modalDeletar.colchao?.marca}, {modalDeletar.colchao?.modelo}?</p>
				<div className="flex justify-end mt-6">
					<button
						onClick={() => setModalDeletar({ aberto: false, colchao: null })}
						className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
					>
						Cancelar
					</button>
					<button
						onClick={() => {
							handleDelete(modalDeletar.colchao.id);
							setModalDeletar({ aberto: false, colchao: null });
						}}
						className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ml-4"
					>
						Deletar
					</button>
				</div>
			</div>
		</div>
	);
};

export default ModalDeletar;
