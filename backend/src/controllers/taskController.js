const { z } = require('zod');
const prisma = require('../config/prismaClient');

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  status: z.enum(['pending', 'completed']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  description: z.string().optional().nullable(),
  status: z.enum(['pending', 'completed']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await prisma.task.findMany({
      where: filter,
      orderBy: [
        { priority: 'desc' }, // Assuming string sort might not be perfectly "High" > "Medium" > "Low" implicitly, but we keep it simple or map it in frontend
        { createdAt: 'desc' }
      ]
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const validatedData = taskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: validatedData
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = updateTaskSchema.parse(req.body);
    
    // Check if task exists
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: validatedData
    });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id/toggle
const toggleTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const newStatus = existingTask.status === 'pending' ? 'completed' : 'pending';

    const task = await prisma.task.update({
      where: { id },
      data: { status: newStatus }
    });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask
};
