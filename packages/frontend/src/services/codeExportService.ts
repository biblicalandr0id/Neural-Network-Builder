/**
 * Code Export Service
 * Generates framework-specific code from network configuration
 */

import type { NetworkConfig, Layer } from '@nn-builder/shared'

export type ExportFormat = 'pytorch' | 'keras' | 'tensorflow' | 'jax' | 'onnx'

export class CodeExportService {
  /**
   * Export network configuration as code
   */
  export(config: NetworkConfig, format: ExportFormat): string {
    switch (format) {
      case 'pytorch':
        return this.exportPyTorch(config)
      case 'keras':
        return this.exportKeras(config)
      case 'tensorflow':
        return this.exportTensorFlow(config)
      case 'jax':
        return this.exportJAX(config)
      case 'onnx':
        return this.exportONNX(config)
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }

  /**
   * Export as PyTorch code
   */
  private exportPyTorch(config: NetworkConfig): string {
    const layers = config.layers
      .map((layer, i) => this.layerToPyTorch(layer, i))
      .filter(Boolean)
      .join('\n        ')

    return `import torch
import torch.nn as nn
import torch.nn.functional as F

class NeuralNetwork(nn.Module):
    def __init__(self):
        super(NeuralNetwork, self).__init__()
        ${layers}

    def forward(self, x):
${this.generatePyTorchForward(config.layers)}
        return x

# Training configuration
learning_rate = ${config.hyperparameters.learningRate}
batch_size = ${config.hyperparameters.batchSize}
epochs = 10

# Initialize model
model = NeuralNetwork()
criterion = nn.${this.getLossPyTorch(config.hyperparameters.loss)}()
optimizer = torch.optim.${this.getOptimizerPyTorch(config.hyperparameters.optimizer)}(
    model.parameters(),
    lr=learning_rate
)

# Training loop
for epoch in range(epochs):
    optimizer.zero_grad()
    outputs = model(inputs)
    loss = criterion(outputs, labels)
    loss.backward()
    optimizer.step()
    print(f'Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}')
`
  }

  /**
   * Export as Keras code
   */
  private exportKeras(config: NetworkConfig): string {
    const layers = config.layers
      .map((layer, i) => this.layerToKeras(layer, i))
      .filter(Boolean)
      .join(',\n    ')

    return `import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Define model
model = keras.Sequential([
    ${layers}
])

# Compile model
model.compile(
    optimizer='${config.hyperparameters.optimizer}',
    loss='${config.hyperparameters.loss}',
    metrics=['accuracy']
)

# Model summary
model.summary()

# Training configuration
batch_size = ${config.hyperparameters.batchSize}
epochs = 10
learning_rate = ${config.hyperparameters.learningRate}

# Train model
history = model.fit(
    x_train, y_train,
    batch_size=batch_size,
    epochs=epochs,
    validation_split=0.2,
    verbose=1
)

# Evaluate model
test_loss, test_acc = model.evaluate(x_test, y_test)
print(f'Test accuracy: {test_acc:.4f}')
`
  }

  /**
   * Export as TensorFlow code
   */
  private exportTensorFlow(config: NetworkConfig): string {
    const layers = config.layers
      .map((layer, i) => this.layerToTensorFlow(layer, i))
      .filter(Boolean)
      .join('\n')

    return `import tensorflow as tf

# Build model
${layers}

model = tf.keras.Sequential(layers)

# Compile model
model.compile(
    optimizer=tf.keras.optimizers.${this.getOptimizerTensorFlow(config.hyperparameters.optimizer)}(
        learning_rate=${config.hyperparameters.learningRate}
    ),
    loss='${config.hyperparameters.loss}',
    metrics=['accuracy']
)

# Training configuration
batch_size = ${config.hyperparameters.batchSize}
epochs = 10

# Train model
history = model.fit(
    x_train, y_train,
    batch_size=batch_size,
    epochs=epochs,
    validation_split=0.2,
    callbacks=[
        tf.keras.callbacks.EarlyStopping(patience=3),
        tf.keras.callbacks.ModelCheckpoint('best_model.h5', save_best_only=True)
    ]
)

# Save model
model.save('final_model.h5')
`
  }

  /**
   * Export as JAX/Flax code
   */
  private exportJAX(config: NetworkConfig): string {
    return `import jax
import jax.numpy as jnp
from flax import linen as nn
import optax

class NeuralNetwork(nn.Module):
    @nn.compact
    def __call__(self, x, training: bool = False):
${this.generateJAXLayers(config.layers)}
        return x

# Initialize model
model = NeuralNetwork()
rng = jax.random.PRNGKey(0)
params = model.init(rng, jnp.ones([1, input_shape]))

# Optimizer
learning_rate = ${config.hyperparameters.learningRate}
optimizer = optax.${this.getOptimizerJAX(config.hyperparameters.optimizer)}(learning_rate)
opt_state = optimizer.init(params)

# Training step
@jax.jit
def train_step(params, opt_state, batch):
    def loss_fn(params):
        logits = model.apply(params, batch['image'], training=True)
        loss = optax.softmax_cross_entropy_with_integer_labels(
            logits, batch['label']
        ).mean()
        return loss

    loss, grads = jax.value_and_grad(loss_fn)(params)
    updates, opt_state = optimizer.update(grads, opt_state)
    params = optax.apply_updates(params, updates)
    return params, opt_state, loss

# Training loop
epochs = 10
for epoch in range(epochs):
    for batch in train_loader:
        params, opt_state, loss = train_step(params, opt_state, batch)
    print(f'Epoch {epoch+1}, Loss: {loss:.4f}')
`
  }

  /**
   * Export as ONNX metadata
   */
  private exportONNX(_config: NetworkConfig): string {
    return `# ONNX Export Instructions
# First, train your model in PyTorch or TensorFlow, then export:

# PyTorch to ONNX:
import torch
import torch.onnx

# After training your PyTorch model:
dummy_input = torch.randn(1, input_shape)
torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    export_params=True,
    opset_version=11,
    input_names=['input'],
    output_names=['output'],
    dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
)

# TensorFlow/Keras to ONNX:
import tf2onnx
import onnx

# After training your TensorFlow model:
spec = (tf.TensorSpec((None, input_shape), tf.float32, name="input"),)
output_path = "model.onnx"
model_proto, _ = tf2onnx.convert.from_keras(model, input_signature=spec, opset=13)
onnx.save(model_proto, output_path)

# Verify ONNX model:
import onnx
onnx_model = onnx.load("model.onnx")
onnx.checker.check_model(onnx_model)
print("ONNX model is valid!")
`
  }

  /**
   * Convert layer to PyTorch code
   */
  private layerToPyTorch(layer: Layer, index: number): string | null {
    switch (layer.type) {
      case 'dense':
        if ('units' in layer) {
          return `self.fc${index} = nn.Linear(in_features, ${layer.units})`
        }
        return null

      case 'conv2d':
        if ('filters' in layer && 'kernelSize' in layer) {
          const stride = 'strides' in layer ? layer.strides : 1
          const padding = 'padding' in layer && layer.padding === 'same' ? 1 : 0
          return `self.conv${index} = nn.Conv2d(in_channels, ${layer.filters}, kernel_size=${layer.kernelSize}, stride=${stride}, padding=${padding})`
        }
        return null

      case 'pooling':
        if ('poolType' in layer && 'poolSize' in layer) {
          const poolType = layer.poolType === 'max' ? 'MaxPool2d' : 'AvgPool2d'
          return `self.pool${index} = nn.${poolType}(kernel_size=${layer.poolSize})`
        }
        return null

      case 'dropout':
        if ('rate' in layer) {
          return `self.dropout${index} = nn.Dropout(p=${layer.rate})`
        }
        return null

      case 'batchnorm':
        return `self.bn${index} = nn.BatchNorm2d(num_features)`

      case 'lstm':
        if ('units' in layer) {
          return `self.lstm${index} = nn.LSTM(input_size, ${layer.units}, batch_first=True)`
        }
        return null

      case 'gru':
        if ('units' in layer) {
          return `self.gru${index} = nn.GRU(input_size, ${layer.units}, batch_first=True)`
        }
        return null

      case 'flatten':
        return `# Flatten will be done in forward()`

      default:
        return `# ${layer.type} layer - implement manually`
    }
  }

  /**
   * Convert layer to Keras code
   */
  private layerToKeras(layer: Layer, _index: number): string | null {
    switch (layer.type) {
      case 'input':
        if ('shape' in layer) {
          return `layers.InputLayer(input_shape=(${layer.shape}))`
        }
        return null

      case 'dense':
        if ('units' in layer) {
          const activation = ('activation' in layer && layer.activation) || 'linear'
          return `layers.Dense(${layer.units}, activation='${activation}')`
        }
        return null

      case 'conv2d':
        if ('filters' in layer && 'kernelSize' in layer) {
          const activation = ('activation' in layer && layer.activation) || 'linear'
          const padding = 'padding' in layer ? layer.padding : 'valid'
          return `layers.Conv2D(${layer.filters}, (${layer.kernelSize}, ${layer.kernelSize}), activation='${activation}', padding='${padding}')`
        }
        return null

      case 'pooling':
        if ('poolType' in layer && 'poolSize' in layer) {
          const poolType = layer.poolType === 'max' ? 'MaxPooling2D' : 'AveragePooling2D'
          return `layers.${poolType}(pool_size=(${layer.poolSize}, ${layer.poolSize}))`
        }
        return null

      case 'dropout':
        if ('rate' in layer) {
          return `layers.Dropout(${layer.rate})`
        }
        return null

      case 'flatten':
        return `layers.Flatten()`

      case 'batchnorm':
        return `layers.BatchNormalization()`

      case 'lstm':
        if ('units' in layer) {
          const returnSeq = 'returnSequences' in layer && layer.returnSequences
          return `layers.LSTM(${layer.units}, return_sequences=${returnSeq})`
        }
        return null

      case 'gru':
        if ('units' in layer) {
          const returnSeq = 'returnSequences' in layer && layer.returnSequences
          return `layers.GRU(${layer.units}, return_sequences=${returnSeq})`
        }
        return null

      case 'globalavgpool':
        return `layers.GlobalAveragePooling2D()`

      case 'globalmaxpool':
        return `layers.GlobalMaxPooling2D()`

      default:
        return `# layers.${layer.type} - not implemented`
    }
  }

  /**
   * Convert layer to TensorFlow code
   */
  private layerToTensorFlow(layer: Layer, index: number): string | null {
    const keras = this.layerToKeras(layer, index)
    return keras ? `layers.append(tf.keras.${keras})` : null
  }

  /**
   * Generate PyTorch forward pass
   */
  private generatePyTorchForward(layers: Layer[]): string {
    const forwards: string[] = []

    layers.forEach((layer, i) => {
      switch (layer.type) {
        case 'dense':
          forwards.push(`        x = self.fc${i}(x)`)
          if ('activation' in layer && layer.activation && layer.activation !== 'linear') {
            forwards.push(`        x = F.${layer.activation}(x)`)
          }
          break

        case 'conv2d':
          forwards.push(`        x = self.conv${i}(x)`)
          if ('activation' in layer && layer.activation && layer.activation !== 'linear') {
            forwards.push(`        x = F.${layer.activation}(x)`)
          }
          break

        case 'pooling':
          forwards.push(`        x = self.pool${i}(x)`)
          break

        case 'dropout':
          forwards.push(`        x = self.dropout${i}(x)`)
          break

        case 'batchnorm':
          forwards.push(`        x = self.bn${i}(x)`)
          break

        case 'flatten':
          forwards.push(`        x = x.view(x.size(0), -1)`)
          break

        case 'lstm':
        case 'gru':
          forwards.push(`        x, _ = self.${layer.type}${i}(x)`)
          break

        default:
          forwards.push(`        # ${layer.type} forward pass`)
      }
    })

    return forwards.join('\n')
  }

  /**
   * Generate JAX layers
   */
  private generateJAXLayers(layers: Layer[]): string {
    const jaxLayers: string[] = []

    layers.forEach((layer) => {
      switch (layer.type) {
        case 'dense':
          if ('units' in layer) {
            const activation = layer.activation || 'linear'
            jaxLayers.push(`        x = nn.Dense(${layer.units})(x)`)
            if (activation !== 'linear') {
              jaxLayers.push(`        x = nn.${activation}(x)`)
            }
          }
          break

        case 'conv2d':
          if ('filters' in layer && 'kernelSize' in layer) {
            jaxLayers.push(
              `        x = nn.Conv(${layer.filters}, (${layer.kernelSize}, ${layer.kernelSize}))(x)`
            )
          }
          break

        case 'dropout':
          if ('rate' in layer) {
            jaxLayers.push(`        x = nn.Dropout(${layer.rate}, deterministic=not training)(x)`)
          }
          break

        case 'batchnorm':
          jaxLayers.push(`        x = nn.BatchNorm(use_running_average=not training)(x)`)
          break

        default:
          jaxLayers.push(`        # ${layer.type} layer`)
      }
    })

    return jaxLayers.join('\n')
  }

  /**
   * Get PyTorch loss function name
   */
  private getLossPyTorch(loss: string): string {
    const mapping: Record<string, string> = {
      categoricalCrossentropy: 'CrossEntropyLoss',
      binaryCrossentropy: 'BCELoss',
      meanSquaredError: 'MSELoss',
      meanAbsoluteError: 'L1Loss',
    }
    return mapping[loss] || 'CrossEntropyLoss'
  }

  /**
   * Get PyTorch optimizer name
   */
  private getOptimizerPyTorch(optimizer: string): string {
    const mapping: Record<string, string> = {
      adam: 'Adam',
      sgd: 'SGD',
      rmsprop: 'RMSprop',
      adagrad: 'Adagrad',
    }
    return mapping[optimizer] || 'Adam'
  }

  /**
   * Get TensorFlow optimizer name
   */
  private getOptimizerTensorFlow(optimizer: string): string {
    const mapping: Record<string, string> = {
      adam: 'Adam',
      sgd: 'SGD',
      rmsprop: 'RMSprop',
      adagrad: 'Adagrad',
      adamax: 'Adamax',
      adadelta: 'Adadelta',
    }
    return mapping[optimizer] || 'Adam'
  }

  /**
   * Get JAX optimizer name
   */
  private getOptimizerJAX(optimizer: string): string {
    const mapping: Record<string, string> = {
      adam: 'adam',
      sgd: 'sgd',
      rmsprop: 'rmsprop',
      adagrad: 'adagrad',
    }
    return mapping[optimizer] || 'adam'
  }

  /**
   * Download code as file
   */
  downloadCode(code: string, format: ExportFormat): void {
    const extensions: Record<ExportFormat, string> = {
      pytorch: 'py',
      keras: 'py',
      tensorflow: 'py',
      jax: 'py',
      onnx: 'txt',
    }

    const filename = `neural_network_${format}.${extensions[format]}`
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }
}

export const codeExportService = new CodeExportService()
