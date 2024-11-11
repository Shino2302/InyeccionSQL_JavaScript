const db = require("../models");

exports.createUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await db.sequelize.query(
            "SELECT * FROM public.users WHERE email = :email",
            {
                replacements: { email: email }, // Reemplazar :email con el valor de la variable
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

        // Obtener el ID del nuevo usuario insertado (opcional, si deseas devolverlo)
        const newUserId = result[0]; // Esto debería devolver el ID generado, si es necesario

        // Responder con el mensaje de éxito
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