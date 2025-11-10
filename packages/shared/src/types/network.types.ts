/**
 * Network Configuration Types
 */

import { Layer } from './layer.types'

export interface NetworkConfig {
  project: ProjectInfo
  layers: Layer[]
  hyperparameters: HyperParameters
  preprocessing?: PreprocessingConfig
  metadata?: NetworkMetadata
}

export interface ProjectInfo {
  name: string
  description: string
  taskType: TaskType
  dataType: DataType
  createdAt?: string
  updatedAt?: string
  author?: string
  tags?: string[]
}

export type TaskType =
  | 'classification'
  | 'regression'
  | 'segmentation'
  | 'object-detection'
  | 'nlp-classification'
  | 'nlp-generation'
  | 'time-series'
  | 'reinforcement'
  | 'recommendation'
  | 'gan'
  | 'autoencoder'
  | 'transfer'
  | 'multimodal'

export type DataType = 'image' | 'text' | 'audio' | 'video' | 'tabular' | 'time-series'

export interface HyperParameters {
  batchSize: number
  epochs: number
  learningRate: number
  optimizer: OptimizerType
  loss: LossType
  metrics?: MetricType[]
  validationSplit: number
  shuffle?: boolean
  earlyStopping?: EarlyStoppingConfig
  reduceLROnPlateau?: ReduceLRConfig
  modelCheckpoint?: ModelCheckpointConfig
}

export type OptimizerType =
  | 'adam'
  | 'sgd'
  | 'rmsprop'
  | 'adagrad'
  | 'adadelta'
  | 'adamax'
  | 'nadam'

export type LossType =
  | 'categorical_crossentropy'
  | 'binary_crossentropy'
  | 'sparse_categorical_crossentropy'
  | 'mse'
  | 'mae'
  | 'huber'
  | 'hinge'
  | 'cosine_similarity'

export type MetricType =
  | 'accuracy'
  | 'precision'
  | 'recall'
  | 'f1_score'
  | 'auc'
  | 'mae'
  | 'mse'
  | 'rmse'

export interface EarlyStoppingConfig {
  monitor: string
  patience: number
  minDelta?: number
  mode?: 'min' | 'max' | 'auto'
  restoreBestWeights?: boolean
}

export interface ReduceLRConfig {
  monitor: string
  factor: number
  patience: number
  minLr?: number
  mode?: 'min' | 'max' | 'auto'
}

export interface ModelCheckpointConfig {
  filepath: string
  monitor: string
  saveWeightsOnly?: boolean
  saveBestOnly?: boolean
  mode?: 'min' | 'max' | 'auto'
}

export interface PreprocessingConfig {
  resize?: ResizeConfig
  normalize?: NormalizeConfig
  augmentation?: AugmentationConfig
  split?: DataSplitConfig
  batchSize?: number
  shuffle?: boolean
  seed?: number
}

export interface ResizeConfig {
  strategy: 'none' | 'fixed' | 'custom' | 'aspect'
  width?: number
  height?: number
}

export interface NormalizeConfig {
  method: 'none' | '0-1' | '-1-1' | 'imagenet' | 'custom'
  mean?: number[]
  std?: number[]
}

export interface AugmentationConfig {
  flip?: boolean
  rotate?: boolean
  crop?: boolean
  brightness?: boolean
  noise?: boolean
  zoom?: boolean
  shear?: boolean
}

export interface DataSplitConfig {
  train: number
  validation: number
  test: number
}

export interface NetworkMetadata {
  totalLayers: number
  totalParameters: number
  trainableParameters: number
  nonTrainableParameters: number
  inputShape?: number[]
  outputShape?: number[]
  estimatedMemory?: number // in MB
  estimatedFLOPs?: number
}

/**
 * Version Control Types
 */
export interface NetworkVersion {
  id: string
  name: string
  tag: VersionTag
  notes: string
  architecture: NetworkConfig
  timestamp: string
  layerCount: number
  paramCount: number
  metrics?: TrainingMetrics
}

export type VersionTag = 'experimental' | 'stable' | 'production' | 'deprecated'

/**
 * Training Types
 */
export interface TrainingMetrics {
  final_loss: number
  final_accuracy: number
  val_loss: number
  val_accuracy: number
  best_epoch: number
  total_time: number
}

export interface TrainingHistory {
  epoch: number[]
  loss: number[]
  accuracy: number[]
  val_loss: number[]
  val_accuracy: number[]
}

export interface SavedModel {
  id: string
  name: string
  architecture: NetworkConfig
  metrics: TrainingMetrics
  history: TrainingHistory
  timestamp: string
  format: 'tfjs' | 'onnx' | 'savedmodel' | 'h5'
}
