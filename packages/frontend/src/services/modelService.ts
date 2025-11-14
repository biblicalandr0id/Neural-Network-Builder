/**
 * TensorFlow.js Model Service
 * Handles model compilation, training, and inference
 */

import * as tf from '@tensorflow/tfjs'
import type { NetworkConfig, Layer } from '@nn-builder/shared'

export class ModelService {
  private model: tf.LayersModel | null = null

  /**
   * Compile a TensorFlow.js model from network configuration
   */
  async compileModel(config: NetworkConfig): Promise<tf.LayersModel> {
    const layers: tf.layers.Layer[] = []

    for (let i = 0; i < config.layers.length; i++) {
      const layer = config.layers[i]
      const tfLayer = this.createLayer(layer)
      if (tfLayer) layers.push(tfLayer)
    }

    const model = tf.sequential({ layers })

    // Compile with optimizer and loss
    model.compile({
      optimizer: this.getOptimizer(config.hyperparameters.optimizer, config.hyperparameters.learningRate),
      loss: config.hyperparameters.loss,
      metrics: config.hyperparameters.metrics || ['accuracy'],
    })

    this.model = model
    return model
  }

  /**
   * Create TensorFlow.js layer from layer configuration
   */
  private createLayer(layer: Layer): tf.layers.Layer | null {
    switch (layer.type) {
      case 'input':
        if ('shape' in layer) {
          const shape = layer.shape.split(',').map(Number)
          return tf.layers.inputLayer({ inputShape: shape })
        }
        return null

      case 'dense':
        if ('units' in layer) {
          return tf.layers.dense({
            units: layer.units,
            activation: (layer.activation || 'linear') as any,
            useBias: layer.useBias ?? true,
            kernelInitializer: layer.kernelInitializer || 'glorotUniform',
          })
        }
        return null

      case 'conv2d':
        if ('filters' in layer && 'kernelSize' in layer) {
          return tf.layers.conv2d({
            filters: layer.filters,
            kernelSize: layer.kernelSize,
            strides: layer.strides || 1,
            padding: layer.padding || 'valid',
            activation: (layer.activation || 'linear') as any,
            useBias: layer.useBias ?? true,
          })
        }
        return null

      case 'pooling':
        if ('poolType' in layer && 'poolSize' in layer) {
          if (layer.poolType === 'max') {
            return tf.layers.maxPooling2d({
              poolSize: layer.poolSize,
              strides: layer.strides,
              padding: layer.padding || 'valid',
            })
          } else {
            return tf.layers.averagePooling2d({
              poolSize: layer.poolSize,
              strides: layer.strides,
              padding: layer.padding || 'valid',
            })
          }
        }
        return null

      case 'dropout':
        if ('rate' in layer) {
          return tf.layers.dropout({ rate: layer.rate })
        }
        return null

      case 'flatten':
        return tf.layers.flatten()

      case 'batchnorm':
        return tf.layers.batchNormalization()

      case 'lstm':
        if ('units' in layer) {
          return tf.layers.lstm({
            units: layer.units,
            returnSequences: layer.returnSequences,
            dropout: layer.dropout || 0,
            recurrentDropout: layer.recurrentDropout || 0,
          })
        }
        return null

      case 'gru':
        if ('units' in layer) {
          return tf.layers.gru({
            units: layer.units,
            returnSequences: layer.returnSequences,
            dropout: layer.dropout || 0,
            recurrentDropout: layer.recurrentDropout || 0,
          })
        }
        return null

      case 'globalavgpool':
        return tf.layers.globalAveragePooling2d({})

      case 'globalmaxpool':
        return tf.layers.globalMaxPooling2d({})

      default:
        console.warn(`Layer type ${layer.type} not yet implemented`)
        return null
    }
  }

  /**
   * Get TensorFlow.js optimizer
   */
  private getOptimizer(type: string, learningRate: number): tf.Optimizer {
    switch (type) {
      case 'adam':
        return tf.train.adam(learningRate)
      case 'sgd':
        return tf.train.sgd(learningRate)
      case 'rmsprop':
        return tf.train.rmsprop(learningRate)
      case 'adagrad':
        return tf.train.adagrad(learningRate)
      case 'adamax':
        return tf.train.adamax(learningRate)
      case 'adadelta':
        return tf.train.adadelta()
      default:
        return tf.train.adam(learningRate)
    }
  }

  /**
   * Train the model
   */
  async train(
    x: tf.Tensor,
    y: tf.Tensor,
    config: {
      epochs: number
      batchSize: number
      validationSplit: number
      callbacks?: tf.CustomCallbackArgs
    }
  ): Promise<tf.History> {
    if (!this.model) {
      throw new Error('Model not compiled. Call compileModel first.')
    }

    return await this.model.fit(x, y, {
      epochs: config.epochs,
      batchSize: config.batchSize,
      validationSplit: config.validationSplit,
      callbacks: config.callbacks,
    })
  }

  /**
   * Make predictions
   */
  predict(input: tf.Tensor): tf.Tensor {
    if (!this.model) {
      throw new Error('Model not compiled')
    }
    return this.model.predict(input) as tf.Tensor
  }

  /**
   * Get model summary
   */
  getSummary(): string {
    if (!this.model) return 'No model compiled'

    const lines: string[] = []
    this.model.summary(undefined, undefined, (line) => lines.push(line))
    return lines.join('\n')
  }

  /**
   * Count total parameters
   */
  countParams(): { total: number; trainable: number } {
    if (!this.model) return { total: 0, trainable: 0 }

    const total = this.model.countParams()
    // TensorFlow.js doesn't provide trainable param count directly
    return { total, trainable: total }
  }

  /**
   * Save model
   */
  async saveModel(name: string): Promise<tf.io.SaveResult> {
    if (!this.model) {
      throw new Error('No model to save')
    }
    return await this.model.save(`localstorage://${name}`)
  }

  /**
   * Load model
   */
  async loadModel(name: string): Promise<tf.LayersModel> {
    const model = await tf.loadLayersModel(`localstorage://${name}`)
    this.model = model
    return model
  }

  /**
   * Dispose model to free memory
   */
  dispose() {
    if (this.model) {
      this.model.dispose()
      this.model = null
    }
  }
}

export const modelService = new ModelService()
