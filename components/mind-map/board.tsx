"use client";

import { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CustomNode from "./custom-node";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Save } from "lucide-react";
import { mindMapService } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    data: { label: "Ideia Central" },
    position: { x: 250, y: 25 },
    selected: true,
  },
];

const initialEdges: Edge[] = [];

let id = 2;
const getId = () => `${id++}`;

function MindMapBoardContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onAddNode = useCallback(() => {
    const newNode: Node = {
      id: getId(),
      type: "custom",
      data: { label: "Nova Ideia" },
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);
  
  // Load initial data
  useEffect(() => {
      const loadMindMap = async () => {
          try {
              setLoading(true);
              const data = await mindMapService.getMindMap();
              if (data) {
                  const savedNodes = data.nodesJson ? JSON.parse(data.nodesJson) : [];
                  const savedEdges = data.edgesJson ? JSON.parse(data.edgesJson) : [];
                  
                  if (savedNodes.length > 0) {
                      setNodes(savedNodes);
                      // Update id counter to avoid collisions
                      const maxId = savedNodes.reduce((acc: number, node: Node) => {
                          const nodeId = parseInt(node.id);
                          return !isNaN(nodeId) && nodeId > acc ? nodeId : acc;
                      }, 0);
                      id = maxId + 1;
                  }
                  
                  if (savedEdges.length > 0) {
                      setEdges(savedEdges);
                  }
              }
          } catch (error) {
              console.error("Failed to load mind map:", error);
          } finally {
              setLoading(false);
          }
      };
      loadMindMap();
  }, [setNodes, setEdges]);

  const onSave = useCallback(async () => {
      if (reactFlowInstance) {
          const flow = reactFlowInstance.toObject();
          try {
              await mindMapService.saveMindMap(
                  JSON.stringify(flow.nodes),
                  JSON.stringify(flow.edges)
              );
              toast({
                  title: "Sucesso",
                  description: "Mapa mental salvo com sucesso!",
              });
          } catch (error) {
              console.error("Erro ao salvar:", error);
              toast({
                  variant: "destructive",
                  title: "Erro",
                  description: "Não foi possível salvar o mapa mental.",
              });
          }
      }
  }, [reactFlowInstance, toast]);


  if (loading) {
    return (
        <div className="w-full h-full flex items-center justify-center bg-purple-500/5 dark:bg-background">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
  }


  return (
    <div className="w-full h-full bg-purple-500/30">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        fitView
        className="bg-purple-500/30"
      >
        <Background color="#9333ea" gap={24} size={1} className="opacity-[0.2]" />
        <Controls 
          className="bg-card border-border fill-purple-600 stroke-purple-600 text-purple-600 [&>button]:border-border hover:[&>button]:bg-purple-100 hover:[&>button]:text-purple-700 dark:fill-purple-400 dark:stroke-purple-400 dark:text-purple-400 dark:hover:[&>button]:bg-purple-900/20 dark:hover:[&>button]:text-purple-300" 
          style={{ padding: '4px', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
        />
        <Panel position="bottom-right" className="text-[10px] text-muted-foreground opacity-50">
           MindForge Map
        </Panel>
        <Panel position="top-right" className="flex gap-2">
            <Button onClick={onSave} size="sm" variant="default" className="gap-2 bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4" />
                Salvar
            </Button>
            <Button onClick={onAddNode} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Nó
            </Button>
            <Button onClick={onDeleteSelected} size="sm" variant="destructive" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Excluir Selecionado
            </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function MindMapBoard() {
  return (
    <ReactFlowProvider>
      <MindMapBoardContent />
    </ReactFlowProvider>
  );
}
