export const validateProjectId = (
  projectIdParam: string | undefined,
): number | null => {
  if (!projectIdParam) {
    return null;
  }

  const projectId = parseInt(projectIdParam, 10);

  if (isNaN(projectId) || projectId <= 0) {
    return null;
  }

  return projectId;
};

export const validateProjectIdOrThrow = (
  projectIdParam: string | undefined,
): number => {
  const projectId = validateProjectId(projectIdParam);

  if (projectId === null) {
    throw new Error('Invalid project ID provided.');
  }

  return projectId;
};
