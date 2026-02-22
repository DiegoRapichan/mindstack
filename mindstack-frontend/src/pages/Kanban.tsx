import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { api } from "../services/api";
import { Plus, X } from "lucide-react"; // Importando ícones

interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

interface Colunas {
  [key: string]: {
    nome: string;
    items: Tarefa[];
  };
}

export function Kanban() {
  const [colunas, setColunas] = useState<Colunas>({
    TODO: { nome: "A Fazer", items: [] },
    IN_PROGRESS: { nome: "Fazendo", items: [] },
    DONE: { nome: "Concluído", items: [] },
  });
  const [carregando, setCarregando] = useState(true);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const response = await api.get("/tarefas");
      const tarefasDB: Tarefa[] = response.data;

      const novasColunas = {
        TODO: {
          nome: "A Fazer",
          items: tarefasDB.filter((t) => t.status === "TODO"),
        },
        IN_PROGRESS: {
          nome: "Fazendo",
          items: tarefasDB.filter((t) => t.status === "IN_PROGRESS"),
        },
        DONE: {
          nome: "Concluído",
          items: tarefasDB.filter((t) => t.status === "DONE"),
        },
      };

      setColunas(novasColunas);
    } catch (error) {
      console.error("Erro ao carregar Kanban", error);
    } finally {
      setCarregando(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const colunaOrigem = colunas[source.droppableId];
      const colunaDestino = colunas[destination.droppableId];

      const itensOrigem = [...colunaOrigem.items];
      const itensDestino = [...colunaDestino.items];

      const [itemRemovido] = itensOrigem.splice(source.index, 1);

      itemRemovido.status = destination.droppableId as
        | "TODO"
        | "IN_PROGRESS"
        | "DONE";
      itensDestino.splice(destination.index, 0, itemRemovido);

      setColunas({
        ...colunas,
        [source.droppableId]: { ...colunaOrigem, items: itensOrigem },
        [destination.droppableId]: { ...colunaDestino, items: itensDestino },
      });

      try {
        await api.patch(`/tarefas/${draggableId}/status`, {
          status: destination.droppableId,
        });
      } catch (error) {
        console.error("Erro ao salvar movimento no banco", error);
        carregarTarefas();
      }
    } else {
      const coluna = colunas[source.droppableId];
      const itensCopias = [...coluna.items];
      const [itemRemovido] = itensCopias.splice(source.index, 1);
      itensCopias.splice(destination.index, 0, itemRemovido);

      setColunas({
        ...colunas,
        [source.droppableId]: { ...coluna, items: itensCopias },
      });
    }
  };

  // Nova função de criar tarefa DE VERDADE
  const handleCriarTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    try {
      await api.post("/tarefas", {
        titulo,
        descricao,
        status: "TODO",
      });

      // Limpa o formulário e fecha o modal
      setTitulo("");
      setDescricao("");
      setIsModalOpen(false);

      // Recarrega o quadro
      carregarTarefas();
    } catch (error) {
      alert("Erro ao criar tarefa.");
      console.error(error);
    }
  };

  if (carregando)
    return (
      <div className="p-8 text-center text-white">Carregando seu Kanban...</div>
    );

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">Meu Kanban</h1>
          <p className="text-gray-400">
            Arraste os cards para atualizar o status
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" /> Nova Tarefa
        </button>
      </header>

      {/* Quadro Kanban */}
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)]">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(colunas).map(([idColuna, coluna]) => {
            return (
              <div
                key={idColuna}
                className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl w-full md:w-1/3 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="font-bold text-gray-200">{coluna.nome}</h2>
                  <span className="bg-gray-700 text-gray-300 text-xs font-bold px-2 py-1 rounded-full">
                    {coluna.items.length}
                  </span>
                </div>

                <Droppable droppableId={idColuna}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 transition-colors rounded-lg p-2 ${
                        snapshot.isDraggingOver
                          ? "bg-gray-700/50"
                          : "bg-transparent"
                      }`}
                    >
                      {coluna.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`user-select-none p-4 mb-3 min-h-[100px] bg-gray-900 text-gray-200 rounded-lg shadow-md border-l-4 ${
                                item.status === "DONE"
                                  ? "border-green-500"
                                  : item.status === "IN_PROGRESS"
                                    ? "border-yellow-500"
                                    : "border-blue-500"
                              } ${snapshot.isDragging ? "shadow-2xl ring-2 ring-blue-500 opacity-90" : ""}`}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <div className="font-bold text-lg mb-1">
                                {item.titulo}
                              </div>
                              {item.descricao && (
                                <p className="text-sm text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                                  {item.descricao}
                                </p>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>

      {/* Modal de Criar Tarefa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Nova Tarefa</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCriarTarefa} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Estudar Node.js"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descrição (Opcional)
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Detalhes da tarefa..."
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
                >
                  Salvar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
