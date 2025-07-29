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
import User from './User';
import Project from './Project';
import Note from './Note';
import Task from './Task';
import GoalNotification from './GoalNotification';

@Table({
  timestamps: true,
  tableName: 'goals',
  modelName: 'Goal',
})
class Goal extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
  })
  declare projectId: number;

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

  @BelongsTo(() => Project, {
    onDelete: 'CASCADE',
  })
  declare project: Project;

  @HasMany(() => Note)
  declare note: Note[];

  @HasMany(() => Task)
  declare task: Task[];

  @HasMany(() => GoalNotification)
  declare notification: GoalNotification[];

  @HasMany(() => GoalNotification)
  declare notifications: GoalNotification[];
}

export default Goal;
