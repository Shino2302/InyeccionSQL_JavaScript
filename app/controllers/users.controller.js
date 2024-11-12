const db = require("../models");

exports.createUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await db.sequelize.query(
            "SELECT * FROM public.users WHERE email = :email",
            {
                replacements: { email: email },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // Crear un nuevo usuario utilizando SQL crudo
        const result = await db.sequelize.query(
            `INSERT INTO public.users("firstName", "lastName", email, password, role, "isActive", "createdAt", "updatedAt")
            VALUES (:firstName, :lastName, :email, :password, :role, true, NOW(), NOW())`,
            {
                replacements: { 
                    firstName: firstName, 
                    lastName: lastName, 
                    email: email, 
                    password: password, 
                    role: role
                },
                type: db.Sequelize.QueryTypes.INSERT
            }
        );
        
        res.status(201).json({ 
            message: "Usuario registrado correctamente", 
            data: { 
                id: newUserId, 
                firstName: firstName, 
                lastName: lastName, 
                email: email, 
                role: role 
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || "Ocurrió un error al crear el usuario"
        });
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await db.sequelize.query("SELECT * FROM public.users", {
            type: db.Sequelize.QueryTypes.SELECT
        });

        const responseData = users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            password: user.password,
            isActive: user.isActive ? "Activo" : "Inactivo",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        res.status(200).json(responseData);
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Ocurrió un error al obtener los usuarios"
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Concatenando las entradas del usuario directamente en la consulta
        const query = `SELECT * FROM public.users WHERE email = '${email}' AND password = '${password}'`;
        
        // Ejecuta la consulta vulnerable a inyección SQL
        const [user] = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (!user) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        res.status(200).json({
            message: "Inicio de sesión exitoso",
            data: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Ocurrió un error durante el inicio de sesión"
        });
    }
};
