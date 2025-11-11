/**
 * Dataset Types
 */

export interface Dataset {
  id: string
  name: string
  type: DatasetType
  files: DatasetFile[]
  stats: DatasetStats
  preprocessing?: PreprocessingPipeline
  splits?: DatasetSplits
  metadata?: DatasetMetadata
}

export type DatasetType = 'images' | 'csv' | 'text' | 'audio' | 'video' | 'custom'

export interface DatasetFile {
  id: string
  name: string
  path: string
  size: number
  type: string
  label?: string
  metadata?: Record<string, unknown>
}

export interface DatasetStats {
  totalFiles: number
  totalSize: number
  numClasses: number
  classes: Record<string, number>
  distribution?: ClassDistribution[]
  mean?: number[]
  std?: number[]
}

export interface ClassDistribution {
  className: string
  count: number
  percentage: number
}

export interface DatasetSplits {
  train: DatasetSplit
  validation: DatasetSplit
  test: DatasetSplit
}

export interface DatasetSplit {
  files: DatasetFile[]
  size: number
  percentage: number
}

export interface PreprocessingPipeline {
  steps: PreprocessingStep[]
  config: DatasetPreprocessingConfig
}

export interface PreprocessingStep {
  id: string
  type: PreprocessingStepType
  params: Record<string, unknown>
  enabled: boolean
}

export type PreprocessingStepType =
  | 'resize'
  | 'normalize'
  | 'augment'
  | 'crop'
  | 'flip'
  | 'rotate'
  | 'brightness'
  | 'contrast'
  | 'noise'
  | 'blur'

export interface DatasetPreprocessingConfig {
  resize?: {
    width: number
    height: number
    method: 'bilinear' | 'nearest' | 'bicubic'
  }
  normalize?: {
    method: 'min-max' | 'z-score' | 'imagenet'
    mean?: number[]
    std?: number[]
  }
  augmentation?: {
    horizontal_flip?: boolean
    vertical_flip?: boolean
    rotation_range?: number
    width_shift_range?: number
    height_shift_range?: number
    brightness_range?: [number, number]
    zoom_range?: number
  }
}

export interface DatasetMetadata {
  source?: string
  license?: string
  description?: string
  createdAt: string
  updatedAt: string
  tags?: string[]
  citation?: string
}

/**
 * Sample Datasets
 */
export interface SampleDataset {
  id: string
  name: string
  description: string
  type: DatasetType
  task: string
  files: number
  classes: number
  size: string
  shape: string
  url?: string
  citation?: string
}

export const SAMPLE_DATASETS: Record<string, SampleDataset> = {
  mnist: {
    id: 'mnist',
    name: 'MNIST',
    description: 'Handwritten digit recognition',
    type: 'images',
    task: 'classification',
    files: 70000,
    classes: 10,
    size: '11 MB',
    shape: '28,28,1',
    citation: 'LeCun et al., 1998',
  },
  cifar10: {
    id: 'cifar10',
    name: 'CIFAR-10',
    description: '60,000 32x32 color images in 10 classes',
    type: 'images',
    task: 'classification',
    files: 60000,
    classes: 10,
    size: '163 MB',
    shape: '32,32,3',
    citation: 'Krizhevsky, 2009',
  },
  imdb: {
    id: 'imdb',
    name: 'IMDB Reviews',
    description: 'Movie review sentiment classification',
    type: 'text',
    task: 'nlp-classification',
    files: 50000,
    classes: 2,
    size: '80 MB',
    shape: 'variable',
    citation: 'Maas et al., 2011',
  },
  fashionmnist: {
    id: 'fashionmnist',
    name: 'Fashion-MNIST',
    description: 'Fashion product images',
    type: 'images',
    task: 'classification',
    files: 70000,
    classes: 10,
    size: '29 MB',
    shape: '28,28,1',
    citation: 'Xiao et al., 2017',
  },
  iris: {
    id: 'iris',
    name: 'Iris',
    description: 'Classic iris flower dataset',
    type: 'csv',
    task: 'classification',
    files: 150,
    classes: 3,
    size: '5 KB',
    shape: '4',
    citation: 'Fisher, 1936',
  },
  titanic: {
    id: 'titanic',
    name: 'Titanic',
    description: 'Passenger survival prediction',
    type: 'csv',
    task: 'classification',
    files: 891,
    classes: 2,
    size: '60 KB',
    shape: '11',
  },
}
