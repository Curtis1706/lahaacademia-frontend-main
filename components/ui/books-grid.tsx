"use client"

import { motion } from "framer-motion"
import { BookCard } from "./book-card"

interface Book {
  id: number
  title: string
  cover: string
  year: string
  countryName: string
  rating: number
  views: number
  downloads: number
  isNew?: boolean
  series?: string
  description: string
}

interface BooksGridProps {
  books: Book[]
  className?: string
}

export function BooksGrid({ books, className = "" }: BooksGridProps) {
  if (books.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucun ouvrage trouvé</h3>
        <p className="text-gray-500 mb-6">
          Essayez de modifier vos critères de recherche ou de sélectionner d'autres filtres.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {books.map((book, index) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 * index }}
        >
          <BookCard
            id={book.id}
            title={book.title}
            cover={book.cover}
            year={book.year}
            countryName={book.countryName}
            rating={book.rating}
            views={book.views}
            downloads={book.downloads}
            isNew={book.isNew}
            series={book.series}
            description={book.description}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
