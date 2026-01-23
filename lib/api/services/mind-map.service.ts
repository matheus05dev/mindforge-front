import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";

export interface MindMapData {
  id: number;
  name: string;
  nodesJson: string;
  edgesJson: string;
}

export const mindMapService = {
  getMindMap: async (): Promise<MindMapData> => {
    return apiClient.get<MindMapData>(API_ENDPOINTS.mindMap);
  },

  saveMindMap: async (nodesJson: string, edgesJson: string): Promise<MindMapData> => {
    return apiClient.post<MindMapData>(API_ENDPOINTS.mindMap, {
      nodesJson,
      edgesJson,
    });
  },
};
