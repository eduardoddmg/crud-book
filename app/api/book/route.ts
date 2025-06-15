import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Obter todos os livros
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(books);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar livros',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

// POST: Criar um novo livro
export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();
    const newBook = await prisma.book.create({
      data: {
        title,
        description,
      },
    });
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    return NextResponse.json(
      {
        error: 'Erro ao criar livro',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
