import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import User from './User';
import Project from './Project';

@Table({
  tableName: 'project_invite',
  modelName: 'ProjectInvite',
  timestamps: true,
})
class ProjectInvitation extends Model {
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
  declare fromUser: number;

  @BelongsTo(() => User, { foreignKey: 'fromUser', as: 'fromUserData' })
  declare fromUserData: User;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare toUser: number;

  @BelongsTo(() => User, { foreignKey: 'toUser', as: 'toUserData' })
  declare toUserData: User;

  @Column({
    type: DataType.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
  })
  declare status: 'pending' | 'accepted' | 'rejected';

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;
}

export default ProjectInvitation;
