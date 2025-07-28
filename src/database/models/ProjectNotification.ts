import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Project from './Project';

@Table({
  tableName: 'project_notification',
  modelName: 'ProjectNotification',
  timestamps: false,
})
class ProjectNotification extends Model {
  
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => Project)
  @Column(DataType.INTEGER)
  declare projectId: number;

  @BelongsTo(() => Project)
  declare project: Project;

  
  @Column(DataType.INTEGER)
  declare notificationTime: number;
}

export default ProjectNotification;
