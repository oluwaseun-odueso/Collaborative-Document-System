import { Model, CreationAttributes } from 'sequelize';

export function createInstance<T extends Model>(
  model: { create(data: CreationAttributes<T>): Promise<T> },
  data: CreationAttributes<T>,
): Promise<T> {
  return model.create(data);
}
