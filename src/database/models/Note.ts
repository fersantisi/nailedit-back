import { Table, Column, DataType, Model, ForeignKey, CreatedAt, UpdatedAt, BelongsTo } from 'sequelize-typescript';
import Project from './Project';
import Task from './Task';
import Goal from './Goal';

@Table({
  timestamps: true,
  tableName: 'notes',
  modelName: 'Note',
})
class Note extends Model {
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
  declare projectid: number | null;

  @ForeignKey(() => Goal)
  @Column({
    type: DataType.INTEGER,
  })
  declare goalid: number | null;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
  })
  declare taskid: number | null;

  
  @Column({
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
  })
  declare description: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @BelongsTo(()=>Project, {
    onDelete: 'CASCADE',
  })
  declare project: Project;

  @BelongsTo(()=>Task, {
    onDelete: 'CASCADE',
  })
  declare task: Task;

  @BelongsTo(()=>Goal, {
    onDelete: 'CASCADE',
  })
  declare goal: Goal;
}



export default Note