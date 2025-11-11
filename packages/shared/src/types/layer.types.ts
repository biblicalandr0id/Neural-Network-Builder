/**
 * Core Layer Type Definitions
 */

export type LayerType =
  | 'input'
  | 'conv2d'
  | 'conv3d'
  | 'dense'
  | 'dropout'
  | 'flatten'
  | 'pooling'
  | 'batchnorm'
  | 'lstm'
  | 'gru'
  | 'embedding'
  | 'transformer'
  | 'attention'
  | 'residual'
  | 'globalavgpool'
  | 'globalmaxpool'

export type ActivationType =
  | 'relu'
  | 'sigmoid'
  | 'tanh'
  | 'softmax'
  | 'linear'
  | 'elu'
  | 'selu'
  | 'gelu'
  | 'swish'
  | 'leaky_relu'

export type PaddingType = 'valid' | 'same' | 'causal'

export type PoolingType = 'max' | 'avg'

/**
 * Base Layer Interface
 */
export interface BaseLayer {
  id: string
  type: LayerType
  name?: string
  trainable?: boolean
}

/**
 * Input Layer
 */
export interface InputLayer extends BaseLayer {
  type: 'input'
  shape: string // e.g., "224,224,3"
  preprocessing?: 'normalize' | 'standardize' | 'none'
  batchSize?: number
}

/**
 * Convolutional Layer
 */
export interface Conv2DLayer extends BaseLayer {
  type: 'conv2d'
  filters: number
  kernelSize: number
  strides?: number
  padding?: PaddingType
  activation?: ActivationType
  useBias?: boolean
  batchNorm?: boolean
  kernelInitializer?: string
  biasInitializer?: string
  kernelRegularizer?: RegularizerConfig
}

/**
 * Dense Layer
 */
export interface DenseLayer extends BaseLayer {
  type: 'dense'
  units: number
  activation?: ActivationType
  useBias?: boolean
  kernelInitializer?: string
  biasInitializer?: string
  kernelRegularizer?: RegularizerConfig
  activityRegularizer?: RegularizerConfig
}

/**
 * Dropout Layer
 */
export interface DropoutLayer extends BaseLayer {
  type: 'dropout'
  rate: number
  noiseShape?: number[]
  seed?: number
}

/**
 * Pooling Layer
 */
export interface PoolingLayer extends BaseLayer {
  type: 'pooling'
  poolType: PoolingType
  poolSize: number
  strides?: number
  padding?: PaddingType
}

/**
 * LSTM Layer
 */
export interface LSTMLayer extends BaseLayer {
  type: 'lstm'
  units: number
  returnSequences?: boolean
  returnState?: boolean
  goBackwards?: boolean
  stateful?: boolean
  dropout?: number
  recurrentDropout?: number
  activation?: ActivationType
  recurrentActivation?: ActivationType
}

/**
 * GRU Layer
 */
export interface GRULayer extends BaseLayer {
  type: 'gru'
  units: number
  returnSequences?: boolean
  returnState?: boolean
  goBackwards?: boolean
  stateful?: boolean
  dropout?: number
  recurrentDropout?: number
}

/**
 * Transformer Layer
 */
export interface TransformerLayer extends BaseLayer {
  type: 'transformer'
  heads: number
  keyDim: number
  ffDim: number
  dropout?: number
  usePositionalEncoding?: boolean
}

/**
 * Attention Layer
 */
export interface AttentionLayer extends BaseLayer {
  type: 'attention'
  heads: number
  keyDim: number
  dropout?: number
  useCausalMask?: boolean
}

/**
 * Conv3D Layer
 */
export interface Conv3DLayer extends BaseLayer {
  type: 'conv3d'
  filters?: number
  kernelSize?: number
  strides?: number
  padding?: PaddingType
  activation?: ActivationType
}

/**
 * Flatten Layer
 */
export interface FlattenLayer extends BaseLayer {
  type: 'flatten'
}

/**
 * Batch Normalization Layer
 */
export interface BatchNormLayer extends BaseLayer {
  type: 'batchnorm'
  momentum?: number
  epsilon?: number
  center?: boolean
  scale?: boolean
}

/**
 * Embedding Layer
 */
export interface EmbeddingLayer extends BaseLayer {
  type: 'embedding'
  inputDim?: number
  outputDim?: number
  inputLength?: number
}

/**
 * Residual Layer
 */
export interface ResidualLayer extends BaseLayer {
  type: 'residual'
}

/**
 * Global Average Pooling Layer
 */
export interface GlobalAvgPoolLayer extends BaseLayer {
  type: 'globalavgpool'
}

/**
 * Global Max Pooling Layer
 */
export interface GlobalMaxPoolLayer extends BaseLayer {
  type: 'globalmaxpool'
}

/**
 * Regularizer Configuration
 */
export interface RegularizerConfig {
  type: 'l1' | 'l2' | 'l1_l2'
  l1?: number
  l2?: number
}

/**
 * Union type of all layers
 */
export type Layer =
  | InputLayer
  | Conv2DLayer
  | Conv3DLayer
  | DenseLayer
  | DropoutLayer
  | PoolingLayer
  | FlattenLayer
  | BatchNormLayer
  | LSTMLayer
  | GRULayer
  | TransformerLayer
  | AttentionLayer
  | EmbeddingLayer
  | ResidualLayer
  | GlobalAvgPoolLayer
  | GlobalMaxPoolLayer
  | BaseLayer

/**
 * Layer Configuration for UI
 */
export interface LayerConfig {
  type: LayerType
  name: string
  icon: string
  category: 'input' | 'convolutional' | 'dense' | 'recurrent' | 'normalization' | 'pooling' | 'other'
  description: string
  defaultParams: Partial<Layer>
  requiredParams: string[]
  commonUses: string[]
}
