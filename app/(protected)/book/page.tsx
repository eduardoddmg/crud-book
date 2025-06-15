'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Imports de UI e Ícones
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';

// Imports para a Tabela Avançada
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Schema de validação com Zod para o formulário de livro
const bookSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  description: z
    .string()
    .min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' }),
});

export default function BookCrudPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para a tabela
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: { title: '', description: '' },
  });

  // Carrega os livros do banco de dados
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/book');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Funções de manipulação de dados
  const openFormDialog = (book: Book | null) => {
    setSelectedBook(book);
    form.reset(
      book
        ? { title: book.title, description: book.description }
        : { title: '', description: '' }
    );
    setIsFormDialogOpen(true);
  };

  const openViewDialog = (book: Book) => {
    setSelectedBook(book);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (values: z.infer<typeof bookSchema>) => {
    try {
      let response;
      if (selectedBook) {
        // Atualizar livro existente
        response = await fetch(`/api/book/${selectedBook.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
      } else {
        // Criar novo livro
        response = await fetch('/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
      }

      const updatedBook = await response.json();

      if (selectedBook) {
        setBooks(
          books.map((b) => (b.id === selectedBook.id ? updatedBook : b))
        );
      } else {
        setBooks([...books, updatedBook]);
      }

      setIsFormDialogOpen(false);
      alert(`Livro ${selectedBook ? 'atualizado' : 'adicionado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      alert('Ocorreu um erro ao salvar o livro.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBook) return;

    try {
      await fetch(`/api/book/${selectedBook.id}`, {
        method: 'DELETE',
      });

      setBooks(books.filter((b) => b.id !== selectedBook.id));
      setIsDeleteDialogOpen(false);
      alert(`Livro "${selectedBook.title}" apagado com sucesso!`);
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
      alert('Ocorreu um erro ao deletar o livro.');
    }
  };

  // Definição das colunas da tabela
  const columns: ColumnDef<Book>[] = [
    {
      accessorKey: 'title',
      header: 'Título',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('title')}</div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const book = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openViewDialog(book)}>
                  Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openFormDialog(book)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/40"
                  onClick={() => openDeleteDialog(book)}
                >
                  Apagar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Instância da tabela
  const table = useReactTable({
    data: books,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-10 text-center">
        Carregando...
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-10">
      <h1 className="text-3xl text-center font-bold mb-6">
        Gerenciador de Livros
      </h1>

      {/* Barra de Ferramentas: Busca e Botão Adicionar */}
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Buscar por título..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={() => openFormDialog(null)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Livro
        </Button>
      </div>

      {/* Tabela de Dados */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum livro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Controles de Paginação */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>

      {/* Diálogos */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedBook ? 'Editar Livro' : 'Adicionar Novo Livro'}
            </DialogTitle>
            <DialogDescription>
              {selectedBook
                ? 'Altere os detalhes do livro aqui.'
                : 'Preencha os detalhes do novo livro.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: O Hobbit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descreva o livro..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {selectedBook ? 'Salvar Alterações' : 'Criar Livro'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBook?.title}</DialogTitle>
            <DialogDescription className="pt-4 text-base text-stone-800 dark:text-stone-300">
              {selectedBook?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá apagar permanentemente o
              livro
              <span className="font-bold">
                {' '}
                &quot;{selectedBook?.title}&quot;{' '}
              </span>
              dos seus dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Sim, apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Definição de tipos
type Book = {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};
