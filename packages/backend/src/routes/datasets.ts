import { Router } from 'express'
import type { Router as ExpressRouter } from 'express'

const router: ExpressRouter = Router()

// In-memory storage
const datasets: Map<string, any> = new Map()

// GET all datasets
router.get('/', (req, res) => {
  const datasetsList = Array.from(datasets.values())
  res.json({ datasets: datasetsList, count: datasetsList.length })
})

// GET dataset by ID
router.get('/:id', (req, res) => {
  const dataset = datasets.get(req.params.id)
  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' })
  }
  res.json(dataset)
})

// POST create dataset
router.post('/', (req, res) => {
  const { id, name, type, files, stats } = req.body

  if (!id || !name || !type) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const dataset = {
    id,
    name,
    type,
    files: files || [],
    stats: stats || {},
    createdAt: new Date().toISOString(),
  }

  datasets.set(id, dataset)
  res.status(201).json(dataset)
})

// DELETE dataset
router.delete('/:id', (req, res) => {
  const deleted = datasets.delete(req.params.id)
  if (!deleted) {
    return res.status(404).json({ error: 'Dataset not found' })
  }
  res.status(204).send()
})

export default router
