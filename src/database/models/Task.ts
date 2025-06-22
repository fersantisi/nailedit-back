import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import Goal from './Goal';

@Table({
  timestamps: true,
  tableName: 'tasks',
  modelName: 'Task',
})
class Task extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Goal)
  @Column({
    type: DataType.INTEGER,
  })
  declare goalId: number;

  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
  })
  declare label: string;

  @Column({
    type: DataType.STRING,
  })
  declare dueDate: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @BelongsTo(() => Goal, {
    onDelete: 'CASCADE',
  })
  declare goal: Goal;
}

export default Task;
