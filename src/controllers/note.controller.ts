import { Request, Response } from 'express';
import { NoteDataDto } from '../dtos/NoteDataDto';
import { validateOrReject } from 'class-validator';
import { NoteDto } from '../dtos/NoteDto';
import {
  createNote,
  deleteNote,
  getNote,
  getNoteByGoalIdService,
  getNoteByProjectIdService,
  getNoteByTaskIdService,
  updateNote,
} from '../services/note.service';

export const createNewNote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log('req.params:', req.params);
    const projectIdNumber = req.params.projectId
      ? +req.params.projectId
      : undefined;
    const goalIdNumber = req.params.goalId ? +req.params.goalId : undefined;
    const taskIdNumber = req.params.taskId ? +req.params.taskId : undefined;
    console.log(
      'projectIdNumber:',
      projectIdNumber,
      'goalIdNumber:',
      goalIdNumber,
      'taskIdNumber:',
      taskIdNumber,
    );

    const { name, description } = req.body;
    let note;

    if (typeof taskIdNumber === 'number' && !isNaN(taskIdNumber)) {
      note = new NoteDto({
        name,
        description,
        taskId: taskIdNumber,
      });
    } else if (typeof goalIdNumber === 'number' && !isNaN(goalIdNumber)) {
      note = new NoteDto({
        name,
        description,
        goalId: goalIdNumber,
      });
    } else if (typeof projectIdNumber === 'number' && !isNaN(projectIdNumber)) {
      note = new NoteDto({
        name,
        description,
        projectId: projectIdNumber,
      });
    } else {
      res.status(400).json({ message: 'No valid parent ID provided' });
      return;
    }

    await validateOrReject(note);
    await createNote(note);

    res.status(201).json({
      message: 'Note created',
    });
  } catch (error: unknown) {
    console.log(error);
    if (Array.isArray(error)) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const deleteANote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const noteId = req.params.noteId;
    console.log(noteId);
    await deleteNote(noteId);
    res.status(200).json({
      message: 'Project deleted',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const getANote = async (req: Request, res: Response): Promise<void> => {
  try {
    const noteId = req.params.noteId;
    const note: NoteDataDto = await getNote(noteId);

    res.status(201).json(note);
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const getAllObjectNotes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectIdNumber = req.params.projectId
      ? +req.params.projectId
      : undefined;
    const goalIdNumber = req.params.goalId ? +req.params.goalId : undefined;
    const taskIdNumber = req.params.taskId ? +req.params.taskId : undefined;

    let notes;

    if (typeof taskIdNumber === 'number' && !isNaN(taskIdNumber)) {
      notes = await getNoteByTaskIdService(taskIdNumber);
    } else if (typeof goalIdNumber === 'number' && !isNaN(goalIdNumber)) {
      notes = await getNoteByGoalIdService(goalIdNumber);
    } else if (typeof projectIdNumber === 'number' && !isNaN(projectIdNumber)) {
      notes = await getNoteByProjectIdService(projectIdNumber);
    } else {
      res.status(400).json({ message: 'No valid parent ID provided' });
      return;
    }

    res.status(200).json(notes);
  } catch (error) {
    if (error instanceof Error) {
      res.status(418).json({ message: error.message });
    }
  }
};

export const updateANote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projectIdSTR = req.params.projectId;
    const projectIdNumber = +projectIdSTR;

    const goalIdSTR = req.params.goalId;
    const goalIdNumber = +goalIdSTR;

    const taskIdSTR = req.params.taskId;
    const taskIdNumber = +taskIdSTR;

    const { noteId, name, description } = req.body;

    let note;

    if (!isNaN(taskIdNumber)) {
      note = new NoteDto({
        name,
        description,
        taskId: taskIdNumber,
      });
    } else if (!isNaN(goalIdNumber)) {
      note = new NoteDto({
        name,
        description,
        goalId: goalIdNumber,
      });
    } else {
      note = new NoteDto({
        name,
        description,
        projectId: projectIdNumber,
      });
    }
    await validateOrReject(note);

    await updateNote(note, noteId);

    res.status(201).json({
      message: 'Note updated',
    });
  } catch (error: unknown) {
    console.log(error);
    if (Array.isArray(error)) {
      res.status(400).json({
        message: 'Validation failed',
        errors: error.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};
