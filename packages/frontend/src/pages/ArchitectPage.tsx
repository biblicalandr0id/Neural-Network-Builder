import { useState } from 'react'
import { useNetworkStore } from '@/store/networkStore'
import { LAYER_CONFIGS } from '@nn-builder/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Copy, MoveUp, MoveDown, Save, Upload, Code } from 'lucide-react'
import { generateId, formatNumber } from '@/lib/utils'
import type { Layer, LayerType } from '@nn-builder/shared'

export function ArchitectPage() {
  const { config, addLayer, updateLayer, deleteLayer, reorderLayers, selectedLayerId, selectLayer } =
    useNetworkStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter layers by search and category
  const filteredLayers = Object.values(LAYER_CONFIGS).filter((layer) => {
    const matchesSearch = layer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || layer.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddLayer = (type: LayerType) => {
    const layerConfig = LAYER_CONFIGS[type]
    const newLayer: Layer = {
      ...(layerConfig.defaultParams as Layer),
      id: generateId(),
    }
    addLayer(newLayer)
  }

  const handleDuplicateLayer = (layer: Layer) => {
    const duplicated = { ...layer, id: generateId(), name: `${layer.name || layer.type} (copy)` }
    addLayer(duplicated)
  }

  const handleMoveLayer = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < config.layers.length) {
      reorderLayers(index, newIndex)
    }
  }

  // Calculate total parameters (simplified)
  const totalParams = config.layers.reduce((sum, layer) => {
    if (layer.type === 'dense' && 'units' in layer) return sum + layer.units * 1000 // Simplified
    if (layer.type === 'conv2d' && 'filters' in layer && 'kernelSize' in layer) {
      return sum + layer.filters * layer.kernelSize * layer.kernelSize
    }
    return sum
  }, 0)

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Neural Network Architect</h1>
        <p className="text-muted-foreground">Design your custom neural network architecture</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Layer Palette */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Layer Palette</CardTitle>
            <CardDescription>Drag or click to add layers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Search layers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="dense">Dense</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredLayers.map((layer) => (
                  <Button
                    key={layer.type}
                    variant="outline"
                    className="w-full justify-start h-auto py-3"
                    onClick={() => handleAddLayer(layer.type)}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{layer.icon}</span>
                        <span className="font-semibold">{layer.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{layer.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {layer.commonUses.slice(0, 2).map((use, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Architecture Canvas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Architecture</CardTitle>
                <CardDescription>
                  {config.layers.length} layers • {formatNumber(totalParams)} parameters
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {config.layers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Add layers from the palette to start building</p>
              </div>
            ) : (
              <div className="space-y-2">
                {config.layers.map((layer, index) => {
                  const layerConfig = LAYER_CONFIGS[layer.type]
                  const isSelected = selectedLayerId === layer.id

                  return (
                    <div
                      key={layer.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'border-primary bg-accent' : 'hover:bg-accent/50'
                      }`}
                      onClick={() => selectLayer(layer.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">{layerConfig.icon}</span>
                          <div>
                            <h4 className="font-semibold">{layerConfig.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {layer.type === 'dense' && 'units' in layer && `${layer.units} units`}
                              {layer.type === 'conv2d' &&
                                'filters' in layer &&
                                `${layer.filters} filters, ${layer.kernelSize}x${layer.kernelSize}`}
                              {layer.type === 'dropout' && 'rate' in layer && `${layer.rate} rate`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveLayer(index, 'up')
                            }}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveLayer(index, 'down')
                            }}
                            disabled={index === config.layers.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDuplicateLayer(layer)
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteLayer(layer.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      {/* Layer Properties */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                          {layer.type === 'dense' && 'units' in layer && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="units">Units</Label>
                                <Input
                                  id="units"
                                  type="number"
                                  value={layer.units}
                                  onChange={(e) =>
                                    updateLayer(layer.id, { units: parseInt(e.target.value) })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="activation">Activation</Label>
                                <Select
                                  value={layer.activation || 'relu'}
                                  onValueChange={(value) => updateLayer(layer.id, { activation: value as any })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="relu">ReLU</SelectItem>
                                    <SelectItem value="sigmoid">Sigmoid</SelectItem>
                                    <SelectItem value="tanh">Tanh</SelectItem>
                                    <SelectItem value="softmax">Softmax</SelectItem>
                                    <SelectItem value="linear">Linear</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}

                          {layer.type === 'conv2d' && 'filters' in layer && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="filters">Filters</Label>
                                <Input
                                  id="filters"
                                  type="number"
                                  value={layer.filters}
                                  onChange={(e) =>
                                    updateLayer(layer.id, { filters: parseInt(e.target.value) })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="kernelSize">Kernel Size</Label>
                                <Input
                                  id="kernelSize"
                                  type="number"
                                  value={layer.kernelSize}
                                  onChange={(e) =>
                                    updateLayer(layer.id, { kernelSize: parseInt(e.target.value) })
                                  }
                                />
                              </div>
                            </>
                          )}

                          {layer.type === 'dropout' && 'rate' in layer && (
                            <div className="space-y-2 col-span-2">
                              <Label htmlFor="rate">Dropout Rate</Label>
                              <Input
                                id="rate"
                                type="number"
                                step="0.1"
                                min="0"
                                max="1"
                                value={layer.rate}
                                onChange={(e) => updateLayer(layer.id, { rate: parseFloat(e.target.value) })}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
