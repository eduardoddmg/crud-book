import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT: Atualizar um livro
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description } = await request.json();
    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: { title, description },
    });
    return NextResponse.json(updatedBook);
  } catch {
    return NextResponse.json(
      { error: 'Erro ao buscar livros' },
      { status: 500 }
    );
  }
}

// DELETE: Excluir um livro
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.book.delete({
      where: { id: params.id },
    });
    return NextResponse.json(
      { message: 'Livro excluído com sucesso' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Erro ao buscar livros' },
      { status: 500 }
    );
  }
}
