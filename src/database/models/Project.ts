import { INTEGER, Optional } from 'sequelize';
import {
  Table,
  Column,
  DataType,
  Model,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  Unique,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import User from './User';
import Goal from './Goal';
import Note from "./Note";
import ReservedStock from "./ReservedStock";
import Stock from "./ReservedStock";
import File from './File';

@Table({
  timestamps: true,
  tableName: 'projects',
  modelName: 'Project',
})
class Project extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare userId: number;

  @Column({
    type: DataType.BOOLEAN,
  })
  declare privacy: boolean;

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
  declare category: string;

  @Column({
    type: DataType.STRING,
  })
  declare image: string;

  @Column({
    type: DataType.STRING,
  })
  declare dueDate: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
  })
  declare user: User;

  @HasMany(() => Goal)
  declare goal: Goal[];

  @HasMany(() => Note)
  declare note: Note[];

  @HasMany(() => ReservedStock)
  declare resrvedStock: ReservedStock[];


  @HasMany(() => File)
  declare files: File[];
}

export default Project;