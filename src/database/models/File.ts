import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
} from 'sequelize-typescript';
import Project from './Project';

@Table({
  timestamps: true,
  tableName: 'files',
  modelName: 'File',
})
class File extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare projectId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare filename: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare path: string;

  @Column({
    type: DataType.STRING,
  })
  declare type: string;

  @CreatedAt
  declare created_at: Date;

  @BelongsTo(() => Project, {
    onDelete: 'CASCADE',
  })
  declare project: Project;
}

export default File;