import { useNetworkStore } from '@/store/networkStore'
import { LAYER_CONFIGS } from '@nn-builder/shared'
import type { Layer, Conv2DLayer, DenseLayer, DropoutLayer, PoolingLayer, LSTMLayer, GRULayer } from '@nn-builder/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Layers } from 'lucide-react'

export function LayerConfigPanel() {
  const { config, selectedLayerId, updateLayer } = useNetworkStore()

  const selectedLayer = config.layers.find((l) => l.id === selectedLayerId)

  if (!selectedLayer) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Layers className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Select a layer to configure</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const layerConfig = LAYER_CONFIGS[selectedLayer.type]

  const handleUpdate = (field: string, value: any) => {
    updateLayer(selectedLayer.id, { [field]: value })
  }

  const renderConfig = () => {
    switch (selectedLayer.type) {
      case 'input':
        return (
          <div className="space-y-4">
            <div>
              <Label>Input Shape</Label>
              <div className="flex gap-2 mt-2">
                {selectedLayer.shape.map((dim, i) => (
                  <Input
                    key={i}
                    type="number"
                    value={dim || ''}
                    onChange={(e) => {
                      const newShape = [...selectedLayer.shape]
                      newShape[i] = parseInt(e.target.value) || 0
                      handleUpdate('shape', newShape)
                    }}
                    placeholder={`Dim ${i + 1}`}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleUpdate('shape', [...selectedLayer.shape, 0])
                  }}
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Shape: [{selectedLayer.shape.join(', ')}]
              </p>
            </div>
          </div>
        )

      case 'conv2d':
      case 'conv3d':
        const convLayer = selectedLayer as Conv2DLayer
        return (
          <div className="space-y-4">
            <div>
              <Label>Filters</Label>
              <Input
                type="number"
                value={convLayer.filters}
                onChange={(e) => handleUpdate('filters', parseInt(e.target.value) || 0)}
                min={1}
              />
            </div>
            <div>
              <Label>Kernel Size</Label>
              <Input
                type="number"
                value={convLayer.kernelSize}
                onChange={(e) => handleUpdate('kernelSize', parseInt(e.target.value) || 0)}
                min={1}
              />
            </div>
            <div>
              <Label>Strides</Label>
              <Input
                type="number"
                value={convLayer.strides || 1}
                onChange={(e) => handleUpdate('strides', parseInt(e.target.value) || 1)}
                min={1}
              />
            </div>
            <div>
              <Label>Padding</Label>
              <Select
                value={convLayer.padding || 'valid'}
                onValueChange={(value) => handleUpdate('padding', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valid">Valid</SelectItem>
                  <SelectItem value="same">Same</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Activation</Label>
              <Select
                value={convLayer.activation || 'relu'}
                onValueChange={(value) => handleUpdate('activation', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relu">ReLU</SelectItem>
                  <SelectItem value="tanh">Tanh</SelectItem>
                  <SelectItem value="sigmoid">Sigmoid</SelectItem>
                  <SelectItem value="softmax">Softmax</SelectItem>
                  <SelectItem value="leaky_relu">Leaky ReLU</SelectItem>
                  <SelectItem value="elu">ELU</SelectItem>
                  <SelectItem value="selu">SELU</SelectItem>
                  <SelectItem value="linear">Linear</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'dense':
        const denseLayer = selectedLayer as DenseLayer
        return (
          <div className="space-y-4">
            <div>
              <Label>Units</Label>
              <Input
                type="number"
                value={denseLayer.units}
                onChange={(e) => handleUpdate('units', parseInt(e.target.value) || 0)}
                min={1}
              />
            </div>
            <div>
              <Label>Activation</Label>
              <Select
                value={denseLayer.activation || 'relu'}
                onValueChange={(value) => handleUpdate('activation', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relu">ReLU</SelectItem>
                  <SelectItem value="tanh">Tanh</SelectItem>
                  <SelectItem value="sigmoid">Sigmoid</SelectItem>
                  <SelectItem value="softmax">Softmax</SelectItem>
                  <SelectItem value="leaky_relu">Leaky ReLU</SelectItem>
                  <SelectItem value="elu">ELU</SelectItem>
                  <SelectItem value="linear">Linear</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'dropout':
        const dropoutLayer = selectedLayer as DropoutLayer
        return (
          <div className="space-y-4">
            <div>
              <Label>Dropout Rate</Label>
              <Input
                type="number"
                step="0.1"
                value={dropoutLayer.rate}
                onChange={(e) => handleUpdate('rate', parseFloat(e.target.value) || 0)}
                min={0}
                max={1}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(dropoutLayer.rate * 100).toFixed(0)}% of units will be dropped
              </p>
            </div>
          </div>
        )

      case 'pooling':
        const poolingLayer = selectedLayer as PoolingLayer
        return (
          <div className="space-y-4">
            <div>
              <Label>Pool Type</Label>
              <Select
                value={poolingLayer.poolType}
                onValueChange={(value) => handleUpdate('poolType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="max">Max Pooling</SelectItem>
                  <SelectItem value="average">Average Pooling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pool Size</Label>
              <Input
                type="number"
                value={poolingLayer.poolSize}
                onChange={(e) => handleUpdate('poolSize', parseInt(e.target.value) || 2)}
                min={1}
              />
            </div>
            <div>
              <Label>Strides</Label>
              <Input
                type="number"
                value={poolingLayer.strides || poolingLayer.poolSize}
                onChange={(e) => handleUpdate('strides', parseInt(e.target.value) || 2)}
                min={1}
              />
            </div>
          </div>
        )

      case 'lstm':
      case 'gru':
        const rnnLayer = selectedLayer as LSTMLayer | GRULayer
        return (
          <div className="space-y-4">
            <div>
              <Label>Units</Label>
              <Input
                type="number"
                value={rnnLayer.units}
                onChange={(e) => handleUpdate('units', parseInt(e.target.value) || 0)}
                min={1}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="returnSequences"
                checked={rnnLayer.returnSequences || false}
                onChange={(e) => handleUpdate('returnSequences', e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="returnSequences" className="cursor-pointer">
                Return Sequences
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="returnState"
                checked={rnnLayer.returnState || false}
                onChange={(e) => handleUpdate('returnState', e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="returnState" className="cursor-pointer">
                Return State
              </Label>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-sm text-muted-foreground">
            Configuration for {layerConfig.name} layer coming soon
          </div>
        )
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{layerConfig.icon}</span>
          <div>
            <CardTitle>{layerConfig.name} Layer</CardTitle>
            <CardDescription>{layerConfig.description}</CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="secondary" className="text-xs">
            {layerConfig.category}
          </Badge>
          {layerConfig.commonUses?.map((use) => (
            <Badge key={use} variant="outline" className="text-xs">
              {use}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            <div>
              <Label>Layer Name (Optional)</Label>
              <Input
                value={selectedLayer.name || ''}
                onChange={(e) => handleUpdate('name', e.target.value)}
                placeholder="e.g., feature_extractor"
              />
            </div>

            {renderConfig()}

            {layerConfig.requiredParams && (
              <div className="pt-4 border-t">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Required Parameters
                </p>
                <div className="flex flex-wrap gap-1">
                  {layerConfig.requiredParams.map((param) => (
                    <Badge key={param} variant="secondary" className="text-xs">
                      {param}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
