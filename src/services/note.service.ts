import Note from '../database/models/Note';
import { NoteDataDto } from '../dtos/NoteDataDto';
import { NoteDto } from '../dtos/NoteDto';

export const createNote = async (note: NoteDto) => {
  try {
    const existingNote = await Note.findOne({
      where: { name: note.name },
    });

    const newNote = await Note.create({
      name: note.name,
      description: note.description,
      projectid: note.projectId,
      goalid: note.goalId,
      taskid: note.taskId,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    const note = await Note.findByPk(noteId);
    if (!note) {
      throw new Error('Note not found');
    }
    await Note.destroy();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
};

export const getNote = async (noteId: string): Promise<NoteDataDto> => {
  try {
    const note = await Note.findByPk(noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    const noteDTO: NoteDataDto = new NoteDataDto(
      note.id,
      note.name,
      note.description,
      note.projectid,
      note.goalid,
      note.taskid,
      note.created_at,
      note.updated_at,
    );

    return noteDTO;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const updateNote = async (newData: NoteDto, noteId: number) => {
  const note = await Note.findByPk(noteId);

  if (!note) {
    throw Error('Note not found');
  }
  note.name = newData.name;
  note.description = newData.description;
  note.projectid = newData.projectId ? newData.projectId : null;
  note.goalid = newData.goalId ? newData.goalId : null;
  note.taskid = newData.taskId ? newData.taskId : null;
  await note.save();
};

export const getNoteByGoalIdService = async (
  goalId: number,
): Promise<NoteDataDto[]> => {
  try {
    if (isNaN(goalId)) {
      throw new Error('Invalid goalId: must be a valid number');
    }

    const notes = await Note.findAll({
      where: { goalid: goalId },
    });

    const noteDTOs: NoteDataDto[] = notes.map((note) => {
      return new NoteDataDto(
        note.id,
        note.name,
        note.description,
        note.projectid,
        note.goalid,
        note.taskid,
        note.created_at,
        note.updated_at,
      );
    });

    return noteDTOs;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const getNoteByProjectIdService = async (
  projectId: number,
): Promise<NoteDataDto[]> => {
  try {
    if (isNaN(projectId)) {
      throw new Error('Invalid projectId: must be a valid number');
    }

    const notes = await Note.findAll({
      where: { projectid: projectId },
    });

    const noteDTOs: NoteDataDto[] = notes.map((note) => {
      return new NoteDataDto(
        note.id,
        note.name,
        note.description,
        note.projectid,
        note.goalid,
        note.taskid,
        note.created_at,
        note.updated_at,
      );
    });

    return noteDTOs;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};

export const getNoteByTaskIdService = async (
  taskId: number,
): Promise<NoteDataDto[]> => {
  try {
    if (isNaN(taskId)) {
      throw new Error('Invalid taskId: must be a valid number');
    }

    const notes = await Note.findAll({
      where: { taskid: taskId },
    });

    const noteDTOs: NoteDataDto[] = notes.map((note) => {
      return new NoteDataDto(
        note.id,
        note.name,
        note.description,
        note.projectid,
        note.goalid,
        note.taskid,
        note.created_at,
        note.updated_at,
      );
    });

    return noteDTOs;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    throw new Error('Server error, check server console for more information');
  }
};
