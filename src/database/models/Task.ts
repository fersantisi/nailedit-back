import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import Goal from './Goal';
import Note from './Note';

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
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare label: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare dueDate: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare completed: boolean;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @BelongsTo(() => Goal, {
    onDelete: 'CASCADE',
  })
  declare goal: Goal;

  @HasMany(() => Note)
  declare note: Note[];
}

export default Task;
