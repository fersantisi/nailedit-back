import {IsNotEmpty, IsNumber, IsOptional, IsString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';


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

interface NoteDtoParams {
    name: string;
    description: string;
    projectId?: number;
    goalId?: number;
    taskId?: number;
  }

export class NoteDto {

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsOptional()
  @IsNumber()
  declare projectId: number|undefined;

  @IsOptional()
  @IsNumber()
  declare goalId: number|undefined;

  @IsOptional()
  @IsNumber()
  declare taskId: number|undefined;
  
  @IsOptional()
  @Validate(AtLeastOneIdConstraint)
  private readonly AtLeastOneIdCheck: unknown;

  constructor({ name, description, projectId, goalId, taskId }: NoteDtoParams) {
    this.name = name;
    this.description = description;
    this.projectId = projectId;
    this.goalId = goalId;
    this.taskId = taskId;

  }
}


