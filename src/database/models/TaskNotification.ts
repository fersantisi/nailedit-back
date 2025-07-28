import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Task from './Task';

@Table({
  tableName: 'task_notification',
  modelName: 'TaskNotification',
  timestamps: false,
})
class TaskNotification extends Model {
  
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => Task)
  @Column(DataType.INTEGER)
  declare taskId: number;

  @BelongsTo(() => Task)
  declare task: Task;

  
  @Column(DataType.INTEGER)
  declare notificationTime: number;
}

export default TaskNotification;