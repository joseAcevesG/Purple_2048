import { DataTypes, Model, Optional } from 'sequelize';
import { SaveBoardsItem, User } from '../types';
import sequelize from './rds-config';

// Definimos una interfaz para los atributos opcionales al crear un nuevo usuario
interface UserCreationAttributes extends Optional<User, 'id' | 'saveBoards' | 'leader'> {}

class UserModel extends Model<User, UserCreationAttributes> {
  id!: string; // Campo obligatorio
  email!: string;
  password!: string;
  username!: string;
  saveBoards?: SaveBoardsItem[]; // Campo opcional
  leader?: number; // Campo opcional
}

UserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    saveBoards: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default UserModel;
