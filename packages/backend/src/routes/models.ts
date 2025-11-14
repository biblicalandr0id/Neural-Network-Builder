import { Router } from 'express'
import type { Router as ExpressRouter } from 'express'

const router: ExpressRouter = Router()

// In-memory storage (replace with database in production)
const models: Map<string, any> = new Map()

// GET all models
router.get('/', (req, res) => {
  const modelsList = Array.from(models.values())
  res.json({ models: modelsList, count: modelsList.length })
})

// GET model by ID
router.get('/:id', (req, res) => {
  const model = models.get(req.params.id)
  if (!model) {
    return res.status(404).json({ error: 'Model not found' })
  }
  res.json(model)
})

// POST create new model
router.post('/', (req, res) => {
  const { id, name, architecture, metadata } = req.body

  if (!id || !name || !architecture) {
    return res.status(400).json({ error: 'Missing required fields: id, name, architecture' })
  }

  const model = {
    id,
    name,
    architecture,
    metadata,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  models.set(id, model)
  res.status(201).json(model)
})

// PUT update model
router.put('/:id', (req, res) => {
  const existing = models.get(req.params.id)
  if (!existing) {
    return res.status(404).json({ error: 'Model not found' })
  }

  const updated = {
    ...existing,
    ...req.body,
    id: req.params.id, // Prevent ID change
    updatedAt: new Date().toISOString(),
  }

  models.set(req.params.id, updated)
  res.json(updated)
})

// DELETE model
router.delete('/:id', (req, res) => {
  const deleted = models.delete(req.params.id)
  if (!deleted) {
    return res.status(404).json({ error: 'Model not found' })
  }
  res.status(204).send()
})

export default router
