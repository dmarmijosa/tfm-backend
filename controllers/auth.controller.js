const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { client } = require("../config/db"); // Importamos el cliente de Redis

// Registro de usuario
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await client.hGetAll(`user:${username}`);
    if (existingUser.username) {
      return res
        .status(400)
        .json({ message: "El usuario ya existe", status: false });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar usuario en Redis
    await client.hSet(`user:${username}`, {
      username,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Usuario creado correctamente", status: true });
  } catch (err) {
    console.error("Error en el registro:", err.message);
    res.status(500).json({ error: err.message, status: false });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario en Redis
    const user = await client.hGetAll(`user:${username}`);
    if (!user.username) {
      return res
        .status(400)
        .json({ message: "Usuario o contraseña incorrectos", status: false });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Usuario o contraseña incorrectos", status: false });
    }

    // Generar token JWT
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, status: true });
  } catch (err) {
    console.error("Error en el login:", err.message);
    res.status(500).json({ error: err.message, status: false });
  }
};
