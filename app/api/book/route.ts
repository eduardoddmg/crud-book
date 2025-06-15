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
  } catch {
    return NextResponse.json(
      { error: 'Erro ao buscar livros' },
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
  } catch {
    return NextResponse.json({ error: 'Erro ao criar livro' }, { status: 500 });
  }
}
