import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- Users (roles demo) ---
  await prisma.user.upsert({
    where: { email: 'librarian@library.dev' },
    update: {},
    create: { email: 'librarian@library.dev', name: 'Ada Librarian', role: Role.LIBRARIAN },
  });
  await prisma.user.upsert({
    where: { email: 'patron@library.dev' },
    update: {},
    create: { email: 'patron@library.dev', name: 'Sam Patron', role: Role.PATRON },
  });

  // --- Genres (4+) ---
  const genres = [
    { name: 'Science Fiction', slug: 'science-fiction' },
    { name: 'Fantasy',         slug: 'fantasy' },
    { name: 'Mystery',         slug: 'mystery' },
    { name: 'Non-Fiction',     slug: 'non-fiction' },
  ];

  const genreMap: Record<string, string> = {};
  for (const g of genres) {
    const row = await prisma.genre.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
    genreMap[g.slug] = row.id;
  }

  // --- Books (15+ distributed across 4 genres) ---
  const books = [
    // Science Fiction
    { title: 'Dune',                       author: 'Frank Herbert',    isbn: '9780441013593', genre: 'science-fiction' },
    { title: 'Neuromancer',                author: 'William Gibson',   isbn: '9780441569595', genre: 'science-fiction' },
    { title: 'The Left Hand of Darkness',  author: 'Ursula K. Le Guin',isbn: '9780441478125', genre: 'science-fiction' },
    { title: 'Snow Crash',                 author: 'Neal Stephenson',  isbn: '9780553380958', genre: 'science-fiction' },
    // Fantasy
    { title: 'The Hobbit',                 author: 'J.R.R. Tolkien',   isbn: '9780547928227', genre: 'fantasy' },
    { title: 'A Wizard of Earthsea',       author: 'Ursula K. Le Guin',isbn: '9780547773742', genre: 'fantasy' },
    { title: 'The Name of the Wind',       author: 'Patrick Rothfuss', isbn: '9780756404741', genre: 'fantasy' },
    { title: 'Mistborn',                   author: 'Brandon Sanderson',isbn: '9780765311788', genre: 'fantasy' },
    // Mystery
    { title: 'The Big Sleep',              author: 'Raymond Chandler', isbn: '9780394758282', genre: 'mystery' },
    { title: 'Gone Girl',                  author: 'Gillian Flynn',    isbn: '9780307588371', genre: 'mystery' },
    { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', isbn: '9780140437867', genre: 'mystery' },
    { title: 'Murder on the Orient Express', author: 'Agatha Christie', isbn: '9780062073495', genre: 'mystery' },
    // Non-Fiction
    { title: 'Sapiens',                    author: 'Yuval Noah Harari',isbn: '9780062316097', genre: 'non-fiction' },
    { title: 'Thinking, Fast and Slow',    author: 'Daniel Kahneman',  isbn: '9780374533557', genre: 'non-fiction' },
    { title: 'The Pragmatic Programmer',   author: 'Hunt & Thomas',    isbn: '9780135957059', genre: 'non-fiction' },
    { title: 'Educated',                   author: 'Tara Westover',    isbn: '9780399590504', genre: 'non-fiction' },
  ];

  for (const b of books) {
    await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {},
      create: {
        title: b.title,
        author: b.author,
        isbn: b.isbn,
        genreId: genreMap[b.genre],
      },
    });
  }

  console.log(`Seeded ${genres.length} genres and ${books.length} books.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });