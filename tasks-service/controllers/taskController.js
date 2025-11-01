import axios from "axios";
import Task from "../models/Task.js";

const AUTH_VERIFY_URL = process.env.AUTH_SERVICE_URL;

async function verifyUserFromAuth(authorizationHeader) {
  if (!authorizationHeader || !authorizationHeader.startsWith("Basic "))
    return null;

  try {
    const res = await axios.get(AUTH_VERIFY_URL, {
      headers: { Authorization: authorizationHeader },
    });

    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function createTask(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const verified = await verifyUserFromAuth(authHeader);
    if (!verified) return res.status(401).json({ error: "Unauthorized" });

    const { title, description } = req.body || {};
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "title es requerido" });
    }

    const task = await Task.create({
      userId: String(verified.userId),
      title: title.trim(),
      description: description?.trim() || "",
    });

    return res.status(201).json(task);
  } catch (e) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
export async function listTasks(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const verified = await verifyUserFromAuth(authHeader);
    if (!verified) return res.status(401).json({ error: "Unauthorized" });

    const tasks = await Task.find({ userId: String(verified.userId) }).sort({
      createdAt: -1,
    });

    return res.json(tasks);
  } catch (e) {
    return res.status(500).json({ error: "Error listando tareas" });
  }
}

// PUT /api/tasks/:id
export async function updateTask(req, res) {
  try {
    const authHeader = req.headers.authorization;

    const verified = await verifyUserFromAuth(authHeader);
    if (!verified) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const { title, description, completed } = req.body;

    const task = await Task.findOne({ _id: id, userId: verified.userId });
    if (!task) {
      return res
        .status(404)
        .json({ error: "Tarea no encontrada o no pertenece al usuario" });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;

    await task.save();

    return res.json({ message: "Tarea actualizada", task });
  } catch (error) {
    console.error("Error actualizando tarea:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
// DELETE /api/tasks/:id
export async function deleteTask(req, res) {
  try {
    const authHeader = req.headers.authorization;

    const verified = await verifyUserFromAuth(authHeader);
    if (!verified) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;

    const deleted = await Task.findOneAndDelete({
      _id: id,
      userId: String(verified.userId),
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Tarea no encontrada o no pertenece al usuario" });
    }

    return res.json({ message: "Tarea eliminada", id: deleted._id });
  } catch (e) {
    console.error("Error eliminando tarea:", e);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
} // GET /api/tasks/:id
export async function getTaskById(req, res) {
  try {
    const authHeader = req.headers.authorization;

    const verified = await verifyUserFromAuth(authHeader);
    if (!verified) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      userId: String(verified.userId),
    });

    if (!task) {
      return res
        .status(404)
        .json({ error: "Tarea no encontrada o no pertenece al usuario" });
    }

    return res.status(200).json(task);
  } catch (e) {
    console.error("Error obteniendo tarea por ID:", e);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
