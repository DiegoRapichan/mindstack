import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { api } from "../services/api";
import {
  Plus,
  X,
  Trash2,
  Edit2,
  BookOpen,
  ArrowLeft,
  CalendarClock,
  Filter,
} from "lucide-react";

interface Disciplina {
  id: string;
  nome: string;
}

interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  disciplinaId?: string;
  disciplina?: {
    nome: string;
  };
  dataEntrega?: string;
  ordem: number;
}

interface Colunas {
  [key: string]: {
    nome: string;
    items: Tarefa[];
  };
}

export function Kanban() {
  const navigate = useNavigate();
  const [colunas, setColunas] = useState<Colunas>({
    TODO: { nome: "A Fazer", items: [] },
    IN_PROGRESS: { nome: "Fazendo", items: [] },
    DONE: { nome: "Concluído", items: [] },
  });
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [filtroDisciplina, setFiltroDisciplina] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disciplinaId, setDisciplinaId] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [tarefaEditandoId, setTarefaEditandoId] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resTarefas, resDisciplinas] = await Promise.all([
        api.get("/tarefas"),
        api.get("/disciplinas"),
      ]);

      const tarefasDB: Tarefa[] = resTarefas.data;
      tarefasDB.sort((a, b) => a.ordem - b.ordem);

      setDisciplinas(resDisciplinas.data);

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
      console.error("Erro ao carregar dados", error);
    } finally {
      setCarregando(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    const colunasAtualizadas = { ...colunas };
    const colunaOrigem = colunasAtualizadas[source.droppableId];
    const colunaDestino = colunasAtualizadas[destination.droppableId];

    const itensOrigem = [...colunaOrigem.items];
    const itensDestino =
      source.droppableId === destination.droppableId
        ? itensOrigem
        : [...colunaDestino.items];

    const realSourceIndex = itensOrigem.findIndex((t) => t.id === draggableId);
    if (realSourceIndex === -1) return;

    const [itemArrastado] = itensOrigem.splice(realSourceIndex, 1);
    itemArrastado.status = destination.droppableId as
      | "TODO"
      | "IN_PROGRESS"
      | "DONE";

    let realDestinationIndex = destination.index;

    if (filtroDisciplina !== "") {
      const itensDestinoFiltrados = itensDestino.filter(
        (t) => t.disciplinaId === filtroDisciplina,
      );
      if (destination.index === 0) {
        realDestinationIndex = 0;
      } else {
        const itemAcima = itensDestinoFiltrados[destination.index - 1];
        if (itemAcima) {
          realDestinationIndex =
            itensDestino.findIndex((t) => t.id === itemAcima.id) + 1;
        } else {
          realDestinationIndex = itensDestino.length;
        }
      }
    }

    itensDestino.splice(realDestinationIndex, 0, itemArrastado);

    colunasAtualizadas[source.droppableId] = {
      ...colunaOrigem,
      items: itensOrigem,
    };
    if (source.droppableId !== destination.droppableId) {
      colunasAtualizadas[destination.droppableId] = {
        ...colunaDestino,
        items: itensDestino,
      };
    }

    setColunas(colunasAtualizadas);

    const tarefasParaAtualizar = itensDestino.map((item, index) => ({
      id: item.id,
      status: item.status,
      ordem: index,
    }));

    try {
      await api.put("/tarefas/reordenar", { tarefas: tarefasParaAtualizar });
    } catch (error) {
      console.error("Erro ao salvar ordem", error);
      carregarDados();
    }
  };

  const handleExcluirTarefa = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;
    try {
      await api.delete(`/tarefas/${id}`);
      carregarDados();
    } catch (error) {
      alert("Erro ao excluir tarefa.");
    }
  };

  const abrirModalEditar = (tarefa: Tarefa) => {
    setTitulo(tarefa.titulo);
    setDescricao(tarefa.descricao || "");
    setDisciplinaId(tarefa.disciplinaId || "");
    setDataEntrega(tarefa.dataEntrega ? tarefa.dataEntrega.split("T")[0] : "");
    setTarefaEditandoId(tarefa.id);
    setIsModalOpen(true);
  };

  const abrirModalNovaTarefa = () => {
    setTitulo("");
    setDescricao("");
    setDisciplinaId(filtroDisciplina !== "" ? filtroDisciplina : "");
    setDataEntrega("");
    setTarefaEditandoId(null);
    setIsModalOpen(true);
  };

  const handleSalvarTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const ordemInicial = colunas["TODO"].items.length;
    const payload = {
      titulo,
      descricao,
      disciplinaId: disciplinaId || null,
      dataEntrega: dataEntrega || null,
      ordem: tarefaEditandoId ? undefined : ordemInicial,
    };

    try {
      if (tarefaEditandoId) {
        await api.put(`/tarefas/${tarefaEditandoId}`, payload);
      } else {
        await api.post("/tarefas", { ...payload, status: "TODO" });
      }
      setIsModalOpen(false);
      carregarDados();
    } catch (error) {
      alert("Erro ao salvar tarefa.");
    }
  };

  const formatarDataBR = (dataIso: string) => {
    const [ano, mes, dia] = dataIso.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const verificarAtraso = (dataIso: string, status: string) => {
    if (status === "DONE") return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataPrazo = new Date(dataIso.split("T")[0] + "T00:00:00");
    return dataPrazo < hoje;
  };

  if (carregando)
    return (
      <div className="p-8 text-center text-white">Carregando seu Kanban...</div>
    );

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">Meu Kanban</h1>
          <p className="text-gray-400">
            Arraste os cards para priorizar e atualizar o status
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium text-gray-300 transition"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar
          </button>

          <button
            onClick={abrirModalNovaTarefa}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
          >
            <Plus className="w-5 h-5" /> Nova Tarefa
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 mb-8 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
        <div className="flex items-center gap-2 text-gray-400 mr-2">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtrar por:</span>
        </div>

        <button
          onClick={() => setFiltroDisciplina("")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            filtroDisciplina === ""
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700"
          }`}
        >
          Todas
        </button>

        {disciplinas.map((d) => (
          <button
            key={d.id}
            onClick={() => setFiltroDisciplina(d.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filtroDisciplina === d.id
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {d.nome}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-280px)]">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(colunas).map(([idColuna, coluna]) => {
            const itensFiltrados =
              filtroDisciplina === ""
                ? coluna.items
                : coluna.items.filter(
                    (t) => t.disciplinaId === filtroDisciplina,
                  );

            return (
              <div
                key={idColuna}
                className="flex flex-col bg-gray-800 border border-gray-700 rounded-xl w-full md:w-1/3 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="font-bold text-gray-200">{coluna.nome}</h2>
                  <span className="bg-gray-700 text-gray-300 text-xs font-bold px-2 py-1 rounded-full">
                    {itensFiltrados.length}
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
                      {itensFiltrados.map((item, index) => {
                        const isAtrasado = item.dataEntrega
                          ? verificarAtraso(item.dataEntrega, item.status)
                          : false;

                        return (
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
                                className={`group relative p-4 mb-3 min-h-[100px] bg-gray-900 text-gray-200 rounded-lg shadow-md border-l-4 ${
                                  item.status === "DONE"
                                    ? "border-green-500"
                                    : item.status === "IN_PROGRESS"
                                      ? "border-yellow-500"
                                      : "border-blue-500"
                                } ${snapshot.isDragging ? "shadow-2xl ring-2 ring-blue-500 opacity-90" : ""}`}
                                style={{ ...provided.draggableProps.style }}
                              >
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => abrirModalEditar(item)}
                                    className="text-gray-400 hover:text-blue-500 transition"
                                    title="Editar"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) =>
                                      handleExcluirTarefa(item.id, e)
                                    }
                                    className="text-gray-400 hover:text-red-500 transition"
                                    title="Excluir"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                  {item.disciplina && (
                                    <div className="flex items-center gap-1 text-xs font-medium text-purple-400 bg-purple-900/30 w-fit px-2 py-1 rounded-md border border-purple-800/50">
                                      <BookOpen className="w-3 h-3" />
                                      {item.disciplina.nome}
                                    </div>
                                  )}

                                  {item.dataEntrega && (
                                    <div
                                      className={`flex items-center gap-1 text-xs font-medium w-fit px-2 py-1 rounded-md border ${
                                        isAtrasado
                                          ? "bg-red-900/30 text-red-400 border-red-800/50 animate-pulse"
                                          : "bg-gray-700/50 text-gray-300 border-gray-600"
                                      }`}
                                    >
                                      <CalendarClock className="w-3 h-3" />
                                      {formatarDataBR(item.dataEntrega)}
                                      {isAtrasado && (
                                        <span className="ml-1 font-bold">
                                          (Atrasado)
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <div className="font-bold text-lg mb-1 pr-12">
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
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {tarefaEditandoId ? "Editar Tarefa" : "Nova Tarefa"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSalvarTarefa} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Entregar Trabalho"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Disciplina (Opcional)
                  </label>
                  <select
                    value={disciplinaId}
                    onChange={(e) => setDisciplinaId(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Nenhuma</option>
                    {disciplinas.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Prazo (Opcional)
                  </label>
                  <input
                    type="date"
                    value={dataEntrega}
                    onChange={(e) => setDataEntrega(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descrição (Opcional)
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Detalhes da tarefa..."
                  rows={3}
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
                  {tarefaEditandoId ? "Salvar Alterações" : "Salvar Tarefa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
