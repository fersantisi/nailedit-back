import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

//custom validator for at least one Id field is filled
@ValidatorConstraint({ name: 'AtLeastOneId', async: false })
class AtLeastOneIdConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return (
      typeof obj.projectId === 'number' ||
      typeof obj.goalId === 'number' ||
      typeof obj.taskId === 'number'
    );
  }

  defaultMessage(_: ValidationArguments) {
    return 'At least one of projectId, goalId, or taskId must be provided';
  }
}

export class NoteDataDto {
  @IsString()
  @IsNotEmpty({ message: 'Id is required' })
  readonly id: number;
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsOptional()
  @IsNumber()
  declare projectId: number | null;

  @IsOptional()
  @IsNumber()
  declare goalId: number | null;

  @IsOptional()
  @IsNumber()
  declare taskId: number | null;

  @IsNotEmpty()
  @IsDate()
  declare createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  declare updatedAt: Date;

  @IsOptional()
  @Validate(AtLeastOneIdConstraint)
  private readonly AtLeastOneIdCheck: unknown;

  constructor(
    id: number,
    name: string,
    description: string,
    projectId: number | null,
    goalId: number | null,
    taskId: number | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.projectId = projectId;
    this.goalId = goalId;
    this.taskId = taskId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
