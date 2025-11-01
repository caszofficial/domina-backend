import bcrypt from "bcrypt";
import User from "../../models/User.js";

// POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y password son obligatorios" });
    }

    // Verificar si el email ya existe
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ error: "El usuario ya está registrado" });
    }

    // ✅ Hash de contraseña (como tú pediste)
    const passwordHash = bcrypt.hashSync(password, 10);

    // Guardar usuario
    const newUser = await User.create({
      email: email.toLowerCase(),
      passwordHash,
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res
        .status(401)
        .json({ error: "Falta header Authorization Basic" });
    }

    // Extraer las credenciales de base64
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "utf8"
    );
    const [email, password] = credentials.split(":");

    if (!email || !password) {
      return res.status(400).json({ error: "Email o password no enviados" });
    }

    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Validar contraseña
    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    return res.status(200).json({
      message: "Login exitoso",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res
        .status(401)
        .json({ error: "Falta header Authorization Basic" });
    }

    const base64Credentials = authHeader.split(" ")[1];
    const [email, password] = Buffer.from(base64Credentials, "base64")
      .toString("utf8")
      .split(":");

    if (!email || !password) {
      return res.status(400).json({ error: "Email o password no enviados" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // ✅ Devuelve solo lo necesario (lo que consume el microservicio de tareas)
    return res.status(200).json({
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Error en /verify:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
