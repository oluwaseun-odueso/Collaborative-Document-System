import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        logging: false,
      });

      try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
      } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
      }

      return sequelize;
    },
  },
];
