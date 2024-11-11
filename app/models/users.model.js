module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
    firstName: {
            type: Sequelize.STRING,
            allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.ENUM("ADMIN", "COMMON"),
        allowNull: false
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }});

    return User;
};