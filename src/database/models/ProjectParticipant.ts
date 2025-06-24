import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Unique,
} from 'sequelize-typescript';
import User from './User';
import Project from './Project';

@Table({
  tableName: 'project_participants',
  modelName: 'ProjectParticipant',
  timestamps: false,
})
class ProjectParticipant extends Model {
  static rejectParticipationRequest(requestId: number) {
      throw new Error('Method not implemented.');
  }
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

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  @Unique('unique_participant')
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;
}

export default ProjectParticipant;