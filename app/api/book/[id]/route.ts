import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT: Atualizar um livro
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Corrigi o tipo de params aqui
) {
  const { id } = await params; // Extraí o id de params
  try {
    const { title, description } = await request.json();
    const updatedBook = await prisma.book.update({
      where: { id },
      data: { title, description },
    });
    return NextResponse.json(updatedBook);
  } catch {
    return NextResponse.json(
      { error: 'Erro ao atualizar livro' }, // Corrigi a mensagem de erro aqui
      { status: 500 }
    );
  }
}

// DELETE: Excluir um livro
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Corrigi o tipo de params aqui
) {
  const { id } = await params; // Extraí o id de params

  try {
    await prisma.book.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: 'Livro excluído com sucesso' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Erro ao excluir livro' }, // Corrigi a mensagem de erro aqui
      { status: 500 }
    );
  }
}
