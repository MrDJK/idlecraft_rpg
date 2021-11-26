const { Sequelize } = require("sequelize")

const db_connection = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: process.env.DB_DIALECT,
});

try {
  db_connection.authenticate();
  console.log(`Sequelize has connected to ${process.env.DB_DATABASE}@${process.env.DB_HOST}`);
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
