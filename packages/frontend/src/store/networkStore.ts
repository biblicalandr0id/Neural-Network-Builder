import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Layer, NetworkConfig } from '@nn-builder/shared'

interface NetworkState {
  config: NetworkConfig
  selectedLayerId: string | null
  history: NetworkConfig[]
  historyIndex: number

  // Actions
  addLayer: (layer: Layer) => void
  updateLayer: (id: string, updates: Partial<Layer>) => void
  deleteLayer: (id: string) => void
  duplicateLayer: (id: string) => void
  reorderLayers: (newLayers: Layer[]) => void
  selectLayer: (id: string | null) => void
  undo: () => void
  redo: () => void
  reset: () => void
}

const initialConfig: NetworkConfig = {
  project: {
    name: 'Untitled Project',
    description: '',
    taskType: 'classification',
    dataType: 'image',
  },
  layers: [],
  hyperparameters: {
    batchSize: 32,
    epochs: 10,
    learningRate: 0.001,
    optimizer: 'adam',
    loss: 'categorical_crossentropy',
    validationSplit: 0.2,
  },
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    immer((set, get) => ({
      config: initialConfig,
      selectedLayerId: null,
      history: [initialConfig],
      historyIndex: 0,

      addLayer: (layer) =>
        set((state) => {
          state.config.layers.push(layer)
          // Save to history
          state.history = state.history.slice(0, state.historyIndex + 1)
          state.history.push(JSON.parse(JSON.stringify(state.config)))
          state.historyIndex++
        }),

      updateLayer: (id, updates) =>
        set((state) => {
          const index = state.config.layers.findIndex((l) => l.id === id)
          if (index !== -1) {
            state.config.layers[index] = { ...state.config.layers[index], ...updates }
          }
        }),

      deleteLayer: (id) =>
        set((state) => {
          state.config.layers = state.config.layers.filter((l) => l.id !== id)
          if (state.selectedLayerId === id) {
            state.selectedLayerId = null
          }
        }),

      duplicateLayer: (id) =>
        set((state) => {
          const layerIndex = state.config.layers.findIndex((l) => l.id === id)
          if (layerIndex !== -1) {
            const layer = state.config.layers[layerIndex]
            const duplicate = {
              ...JSON.parse(JSON.stringify(layer)),
              id: `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: layer.name ? `${layer.name}_copy` : undefined,
            }
            state.config.layers.splice(layerIndex + 1, 0, duplicate)
          }
        }),

      reorderLayers: (newLayers) =>
        set((state) => {
          state.config.layers = newLayers
        }),

      selectLayer: (id) => set({ selectedLayerId: id }),

      undo: () =>
        set((state) => {
          if (state.historyIndex > 0) {
            state.historyIndex--
            state.config = JSON.parse(JSON.stringify(state.history[state.historyIndex]))
          }
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            state.historyIndex++
            state.config = JSON.parse(JSON.stringify(state.history[state.historyIndex]))
          }
        }),

      reset: () =>
        set({
          config: initialConfig,
          selectedLayerId: null,
          history: [initialConfig],
          historyIndex: 0,
        }),
    })),
    {
      name: 'network-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
