import { create } from 'zustand'
import type { Dataset } from '@nn-builder/shared'
import type * as tf from '@tensorflow/tfjs'
import type { DatasetInfo } from '@/services/datasetService'

export interface LoadedDataset {
  xs: tf.Tensor | null
  ys: tf.Tensor | null
  info: DatasetInfo | null
}

interface DatasetState {
  currentDataset: Dataset | null
  loadedData: LoadedDataset
  uploadProgress: number
  isLoading: boolean

  // Actions
  setDataset: (dataset: Dataset) => void
  setLoadedData: (xs: tf.Tensor, ys: tf.Tensor, info: DatasetInfo) => void
  setUploadProgress: (progress: number) => void
  setLoading: (loading: boolean) => void
  clearDataset: () => void
}

export const useDatasetStore = create<DatasetState>((set) => ({
  currentDataset: null,
  loadedData: {
    xs: null,
    ys: null,
    info: null,
  },
  uploadProgress: 0,
  isLoading: false,

  setDataset: (dataset) => set({ currentDataset: dataset }),
  setLoadedData: (xs, ys, info) =>
    set({
      loadedData: { xs, ys, info },
    }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearDataset: () =>
    set({
      currentDataset: null,
      loadedData: { xs: null, ys: null, info: null },
      uploadProgress: 0,
    }),
}))
