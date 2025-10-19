import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/api/books/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const books = await response.json()
    
    // Normaliser les données pour le frontend
    const normalizedBooks = books.map((book: any) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      subject: book.subject,
      class_level: book.class_level,
      pages: book.pages,
      year: book.year,
      language: book.language,
      price: book.price,
      rating: book.rating || 0,
      downloads: book.downloads || 0,
      teacher: {
        name: book.teacher?.user?.first_name + " " + book.teacher?.user?.last_name,
        avatar: book.teacher?.profile_photo
      },
      cover_image: book.cover_image,
      file_url: book.file_url,
      file_format: book.file_format,
      file_size: book.file_size,
      progress: book.progress || 0,
      is_read: book.is_read || false,
      is_favorite: book.is_favorite || false,
      created_at: book.created_at,
      isbn: book.isbn,
      allow_download: book.allow_download || false,
      allow_preview: book.allow_preview || false
    }))

    return NextResponse.json({
      success: true,
      data: normalizedBooks,
      count: normalizedBooks.length
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des ouvrages:", error)
    return NextResponse.json(
      { 
        error: "Erreur lors de la récupération des ouvrages",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const body = await request.json()
    const { book_id, action } = body

    if (!book_id || !action) {
      return NextResponse.json({ error: "book_id et action requis" }, { status: 400 })
    }

    let endpoint = ""
    let method = "POST"

    switch (action) {
      case "read":
        endpoint = `/api/books/${book_id}/read/`
        break
      case "favorite":
        endpoint = `/api/books/${book_id}/favorite/`
        method = "POST"
        break
      case "unfavorite":
        endpoint = `/api/books/${book_id}/favorite/`
        method = "DELETE"
        break
      case "download":
        endpoint = `/api/books/${book_id}/download/`
        break
      case "preview":
        endpoint = `/api/books/${book_id}/preview/`
        break
      default:
        return NextResponse.json({ error: "Action non supportée" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error("Erreur lors de l'action sur l'ouvrage:", error)
    return NextResponse.json(
      { 
        error: "Erreur lors de l'action sur l'ouvrage",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}
