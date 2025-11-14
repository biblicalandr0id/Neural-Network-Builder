import { create } from 'zustand'
import type { Dataset } from '@nn-builder/shared'

interface DatasetState {
  currentDataset: Dataset | null
  uploadProgress: number
  isLoading: boolean

  // Actions
  setDataset: (dataset: Dataset) => void
  setUploadProgress: (progress: number) => void
  setLoading: (loading: boolean) => void
  clearDataset: () => void
}

export const useDatasetStore = create<DatasetState>((set) => ({
  currentDataset: null,
  uploadProgress: 0,
  isLoading: false,

  setDataset: (dataset) => set({ currentDataset: dataset }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearDataset: () => set({ currentDataset: null, uploadProgress: 0 }),
}))
