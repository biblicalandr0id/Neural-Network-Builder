import { create } from 'zustand'

export interface TrainingMetrics {
  epoch: number
  loss: number
  accuracy: number
  val_loss?: number
  val_accuracy?: number
  timestamp: number
}

export type TrainingStatus = 'idle' | 'preparing' | 'training' | 'paused' | 'completed' | 'error'

interface TrainingState {
  status: TrainingStatus
  currentEpoch: number
  totalEpochs: number
  metrics: TrainingMetrics[]
  error: string | null

  // Actions
  setStatus: (status: TrainingStatus) => void
  setEpochs: (current: number, total: number) => void
  addMetrics: (metrics: TrainingMetrics) => void
  reset: () => void
  setError: (error: string) => void
}

export const useTrainingStore = create<TrainingState>((set) => ({
  status: 'idle',
  currentEpoch: 0,
  totalEpochs: 0,
  metrics: [],
  error: null,

  setStatus: (status) => set({ status }),
  setEpochs: (current, total) => set({ currentEpoch: current, totalEpochs: total }),
  addMetrics: (metrics) => set((state) => ({ metrics: [...state.metrics, metrics] })),
  reset: () => set({ status: 'idle', currentEpoch: 0, totalEpochs: 0, metrics: [], error: null }),
  setError: (error) => set({ error, status: 'error' }),
}))
