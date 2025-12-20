import { prisma } from "@nukleo/db";
import type { ProjectNoteFormData, UpdateProjectNoteData } from "../schemas/projectNote";

export async function getAllProjectNotes(projectId: string) {
  return prisma.projectNote.findMany({
    where: { projectId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectNoteById(id: string) {
  return prisma.projectNote.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export async function createProjectNote(data: ProjectNoteFormData, authorId: string) {
  return prisma.projectNote.create({
    data: {
      content: data.content,
      projectId: data.projectId,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export async function updateProjectNote(id: string, data: UpdateProjectNoteData) {
  const updateData: any = {};
  
  if (data.content) updateData.content = data.content;

  return prisma.projectNote.update({
    where: { id },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export async function deleteProjectNote(id: string) {
  return prisma.projectNote.delete({
    where: { id },
  });
}

