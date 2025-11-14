/**
 * Dataset Service
 * Handles dataset loading, preprocessing, and augmentation
 */

import * as tf from '@tensorflow/tfjs'

export interface DatasetInfo {
  id: string
  name: string
  type: 'images' | 'text' | 'tabular' | 'timeseries'
  shape: number[]
  numClasses: number
  numSamples: number
}

export interface DatasetSplit {
  xs: tf.Tensor
  ys: tf.Tensor
  info: DatasetInfo
}

export class DatasetService {
  /**
   * Load MNIST-like dataset (28x28 grayscale images)
   */
  async loadMNIST(): Promise<DatasetSplit> {
    const numSamples = 1000
    const imageSize = 28

    // Generate synthetic MNIST-like data
    // In production, you would fetch actual MNIST data from a CDN or API
    const xs = tf.randomNormal([numSamples, imageSize, imageSize, 1])
    const labels = tf.randomUniform([numSamples], 0, 10, 'int32')
    const ys = tf.oneHot(labels, 10)

    labels.dispose()

    return {
      xs,
      ys,
      info: {
        id: 'mnist',
        name: 'MNIST',
        type: 'images',
        shape: [28, 28, 1],
        numClasses: 10,
        numSamples,
      },
    }
  }

  /**
   * Load CIFAR-10 dataset (32x32 RGB images)
   */
  async loadCIFAR10(): Promise<DatasetSplit> {
    const numSamples = 1000
    const imageSize = 32

    // Generate synthetic CIFAR-10 like data
    const xs = tf.randomNormal([numSamples, imageSize, imageSize, 3])
    const labels = tf.randomUniform([numSamples], 0, 10, 'int32')
    const ys = tf.oneHot(labels, 10)

    labels.dispose()

    return {
      xs,
      ys,
      info: {
        id: 'cifar10',
        name: 'CIFAR-10',
        type: 'images',
        shape: [32, 32, 3],
        numClasses: 10,
        numSamples,
      },
    }
  }

  /**
   * Load Fashion MNIST dataset (28x28 grayscale images)
   */
  async loadFashionMNIST(): Promise<DatasetSplit> {
    const numSamples = 1000
    const imageSize = 28

    const xs = tf.randomNormal([numSamples, imageSize, imageSize, 1])
    const labels = tf.randomUniform([numSamples], 0, 10, 'int32')
    const ys = tf.oneHot(labels, 10)

    labels.dispose()

    return {
      xs,
      ys,
      info: {
        id: 'fashion_mnist',
        name: 'Fashion MNIST',
        type: 'images',
        shape: [28, 28, 1],
        numClasses: 10,
        numSamples,
      },
    }
  }

  /**
   * Load tabular dataset (for classification)
   */
  async loadTabularClassification(features: number = 10, classes: number = 2): Promise<DatasetSplit> {
    const numSamples = 1000

    // Generate synthetic tabular data with some correlation
    const xs = tf.randomNormal([numSamples, features])
    const labels = tf.randomUniform([numSamples], 0, classes, 'int32')
    const ys = tf.oneHot(labels, classes)

    labels.dispose()

    return {
      xs,
      ys,
      info: {
        id: 'tabular_classification',
        name: 'Tabular Classification',
        type: 'tabular',
        shape: [features],
        numClasses: classes,
        numSamples,
      },
    }
  }

  /**
   * Load tabular dataset (for regression)
   */
  async loadTabularRegression(features: number = 10): Promise<DatasetSplit> {
    const numSamples = 1000

    // Generate synthetic tabular data
    const xs = tf.randomNormal([numSamples, features])
    const ys = tf.randomNormal([numSamples, 1]) // Continuous output

    return {
      xs,
      ys,
      info: {
        id: 'tabular_regression',
        name: 'Tabular Regression',
        type: 'tabular',
        shape: [features],
        numClasses: 1,
        numSamples,
      },
    }
  }

  /**
   * Load time series dataset
   */
  async loadTimeSeries(sequenceLength: number = 50, features: number = 1): Promise<DatasetSplit> {
    const numSamples = 500

    // Generate synthetic time series (sine wave with noise)
    const data: number[][][] = []
    const labels: number[] = []

    for (let i = 0; i < numSamples; i++) {
      const sequence: number[][] = []
      const phase = Math.random() * Math.PI * 2

      for (let t = 0; t < sequenceLength; t++) {
        const value = Math.sin((t + phase) * 0.1) + Math.random() * 0.1
        sequence.push([value])
      }

      data.push(sequence)
      // Binary classification: upward or downward trend
      labels.push(sequence[sequenceLength - 1][0] > sequence[0][0] ? 1 : 0)
    }

    const xs = tf.tensor3d(data)
    const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), 2)

    return {
      xs,
      ys,
      info: {
        id: 'timeseries',
        name: 'Time Series',
        type: 'timeseries',
        shape: [sequenceLength, features],
        numClasses: 2,
        numSamples,
      },
    }
  }

  /**
   * Preprocess images: normalize to [0, 1]
   */
  normalizeImages(images: tf.Tensor): tf.Tensor {
    return tf.tidy(() => {
      const normalized = images.div(255.0)
      return normalized
    })
  }

  /**
   * Standardize features: zero mean, unit variance
   */
  standardizeFeatures(features: tf.Tensor): tf.Tensor {
    return tf.tidy(() => {
      const mean = features.mean(0)
      const std = tf.sqrt(features.sub(mean).square().mean(0))
      const standardized = features.sub(mean).div(std.add(1e-7))
      return standardized
    })
  }

  /**
   * Split dataset into train and validation sets
   */
  splitDataset(
    xs: tf.Tensor,
    ys: tf.Tensor,
    validationSplit: number = 0.2
  ): {
    trainXs: tf.Tensor
    trainYs: tf.Tensor
    valXs: tf.Tensor
    valYs: tf.Tensor
  } {
    const numSamples = xs.shape[0]
    const numVal = Math.floor(numSamples * validationSplit)
    const numTrain = numSamples - numVal

    // Shuffle indices
    const indices = Array.from({ length: numSamples }, (_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }

    const trainIndices = indices.slice(0, numTrain)
    const valIndices = indices.slice(numTrain)

    return tf.tidy(() => {
      const trainXs = tf.gather(xs, trainIndices) as tf.Tensor
      const trainYs = tf.gather(ys, trainIndices) as tf.Tensor
      const valXs = tf.gather(xs, valIndices) as tf.Tensor
      const valYs = tf.gather(ys, valIndices) as tf.Tensor

      return { trainXs, trainYs, valXs, valYs }
    })
  }

  /**
   * Apply data augmentation to images
   */
  augmentImages(images: tf.Tensor): tf.Tensor {
    return tf.tidy(() => {
      // Random horizontal flip (requires 4D tensor)
      let augmented = images.rank === 4 ? (tf.image.flipLeftRight(images as tf.Tensor4D) as tf.Tensor) : images

      // Random brightness adjustment
      const brightness = tf.randomUniform([1], -0.2, 0.2)
      augmented = tf.add(augmented, brightness)

      // Clip to valid range
      augmented = tf.clipByValue(augmented, 0, 1)

      return augmented
    })
  }

  /**
   * Create batched dataset for training
   */
  createBatchedDataset(xs: tf.Tensor, ys: tf.Tensor, batchSize: number): tf.data.Dataset<tf.TensorContainer> {
    const xsArray = xs.arraySync() as number[][]
    const ysArray = ys.arraySync() as number[][]
    const dataset = tf.data.zip({ xs: tf.data.array(xsArray), ys: tf.data.array(ysArray) }).batch(batchSize).shuffle(100)

    return dataset
  }

  /**
   * Load dataset by ID
   */
  async loadDataset(datasetId: string): Promise<DatasetSplit> {
    switch (datasetId) {
      case 'mnist':
        return this.loadMNIST()
      case 'cifar10':
        return this.loadCIFAR10()
      case 'fashion_mnist':
        return this.loadFashionMNIST()
      case 'tabular':
        return this.loadTabularClassification()
      case 'regression':
        return this.loadTabularRegression()
      case 'timeseries':
        return this.loadTimeSeries()
      default:
        throw new Error(`Unknown dataset: ${datasetId}`)
    }
  }

  /**
   * Load custom dataset from file
   */
  async loadFromFile(file: File): Promise<DatasetSplit> {
    const fileType = file.type
    const fileName = file.name.toLowerCase()

    if (fileType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png|gif)$/)) {
      return this.loadImageFile(file)
    } else if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      return this.loadCSVFile(file)
    } else if (fileType === 'application/json' || fileName.endsWith('.json')) {
      return this.loadJSONFile(file)
    } else {
      throw new Error(`Unsupported file type: ${fileType}`)
    }
  }

  /**
   * Load image file
   */
  private async loadImageFile(file: File): Promise<DatasetSplit> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const img = new Image()
          img.onload = () => {
            const xs = tf.browser.fromPixels(img).expandDims(0)
            const ys = tf.zeros([1, 1]) // Placeholder label

            resolve({
              xs,
              ys,
              info: {
                id: 'custom_image',
                name: file.name,
                type: 'images',
                shape: [img.height, img.width, 3],
                numClasses: 1,
                numSamples: 1,
              },
            })
          }
          img.onerror = () => reject(new Error('Failed to load image'))
          img.src = e.target?.result as string
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Load CSV file
   */
  private async loadCSVFile(file: File): Promise<DatasetSplit> {
    const text = await file.text()
    const lines = text.trim().split('\n')
    // const headers = lines[0].split(',') // Reserved for future use

    const data: number[][] = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(Number)
      if (values.every((v) => !isNaN(v))) {
        data.push(values)
      }
    }

    const numFeatures = data[0].length - 1 // Assume last column is label
    const xs = tf.tensor2d(data.map((row) => row.slice(0, numFeatures)))
    const labels = tf.tensor1d(data.map((row) => row[numFeatures]), 'int32')
    const numClasses = labels.max().dataSync()[0] + 1
    const ys = tf.oneHot(labels, numClasses)

    labels.dispose()

    return {
      xs,
      ys,
      info: {
        id: 'custom_csv',
        name: file.name,
        type: 'tabular',
        shape: [numFeatures],
        numClasses,
        numSamples: data.length,
      },
    }
  }

  /**
   * Load JSON file
   */
  private async loadJSONFile(file: File): Promise<DatasetSplit> {
    const text = await file.text()
    const json = JSON.parse(text)

    // Expect format: { features: number[][], labels: number[] }
    if (!json.features || !json.labels) {
      throw new Error('JSON must contain "features" and "labels" arrays')
    }

    const xs = tf.tensor2d(json.features)
    const labels = tf.tensor1d(json.labels, 'int32')
    const numClasses = labels.max().dataSync()[0] + 1
    const ys = tf.oneHot(labels, numClasses)

    labels.dispose()

    return {
      xs,
      ys,
      info: {
        id: 'custom_json',
        name: file.name,
        type: 'tabular',
        shape: [json.features[0].length],
        numClasses,
        numSamples: json.features.length,
      },
    }
  }

  /**
   * Dispose dataset tensors to free memory
   */
  disposeDataset(dataset: DatasetSplit): void {
    dataset.xs.dispose()
    dataset.ys.dispose()
  }
}

export const datasetService = new DatasetService()
