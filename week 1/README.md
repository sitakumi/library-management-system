## Schema Decisions

### Why `Book` references `Genre` (via `genreId`) instead of embedding it

We modeled the `Genre` → `Book` relationship as **one-to-many** using a foreign key
`Book.genreId` referencing `Genre.id`, rather than embedding genre information
(e.g., a `genre: "Fantasy"` string) directly on the `Book` record. The reasoning:

1. **Single source of truth.** Genre metadata (name, slug, future fields like
   description or display order) lives in exactly one row. Renaming "Sci-Fi" to
   "Science Fiction" is a single `UPDATE`; with embedded strings we'd have to
   touch every book.
2. **Referential integrity.** The FK + `onDelete: Restrict` guarantees a book
   can never point at a genre that doesn't exist. Embedding a free-text genre
   would allow typos ("Fantasty") and drift.
3. **Query efficiency.** Filtering books by genre becomes an indexed join on
   `genreId` (`@@index([genreId])`) instead of a `LIKE`/equality scan over
   duplicated strings.
4. **Room to grow.** If a book later needs to belong to multiple genres, we can
   promote the relation to a many-to-many join table without changing how the
   rest of the app addresses genres. An embedded string would force a painful
   migration.
5. **Normalization is cheap here.** The relation is stable (genres rarely
   change) and the join is trivial, so the classic "denormalize for read speed"
   argument doesn't apply. Embedding would trade real integrity for negligible
   performance gain.

### Prisma vs. a document database (stretch note)

In a document DB (e.g., MongoDB) the natural first instinct is to **embed**
genre as a sub-document inside each book, since documents are self-contained
and there's no enforced schema. Prisma + PostgreSQL pushed us toward a
**relational** model: the `Genre` model and `genreId` FK are first-class, and
Prisma's generated client gives us type-safe `include: { genre: true }`
queries and referential guarantees for free. The trade-off: relational modeling
requires thinking about normalization and migrations up front, whereas a
document store lets you start flat and restructure later — but that flexibility
often becomes duplicated, inconsistent data. For catalog data where genres are
shared and stable, the relational approach is the better fit.