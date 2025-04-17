import { Table, Column, Model, DataType, BeforeCreate, BeforeUpdate, } from 'sequelize-typescript'
import * as bcrypt from 'bcrypt';

@Table({
  tableName: 'users',
  timestamps: true,
  // defaultScope: {
  //   attributes: { exclude: ['password']}
  // }
})

export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({ type: DataType.STRING, unique: true })
  declare email: string

  @Column({ type: DataType.STRING })
  declare username: string

  @Column({ type: DataType.STRING, allowNull: true })
  declare password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare provider: 'local' | 'google' | 'github'

  @Column({ allowNull: true })
  declare providerId: string

  @Column({ type: DataType.STRING, allowNull: true })
  declare googleId: string

  @Column({ type: DataType.STRING, allowNull: true })
  declare githubId: string

  @Column({ type: DataType.STRING, allowNull: true })
  declare name: string

  @Column({ type: DataType.STRING, allowNull: true })
  declare avatar: string

  @Column({ type: DataType.TEXT, allowNull: true })
  declare refreshToken: string

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password)
  }
}


