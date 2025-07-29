import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Goal from './Goal';

@Table({
  tableName: 'goal_notification',
  modelName: 'GoalNotification',
  timestamps: false,
})
class GoalNotification extends Model {
  
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => Goal)
  @Column(DataType.INTEGER)
  declare goalId: number;

  @BelongsTo(() => Goal)
  declare goal: Goal;

  
  @Column(DataType.INTEGER)
  declare notificationTime: number;
}

export default GoalNotification;