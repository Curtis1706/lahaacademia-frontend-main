import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/api/videos/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const videos = await response.json()
    
    // Normaliser les données pour le frontend
    const normalizedVideos = videos.map((video: any) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      subject: video.subject,
      class_level: video.class_level,
      duration: video.duration,
      quality: video.quality,
      language: video.language,
      price: video.price,
      rating: video.rating || 0,
      views: video.views || 0,
      teacher: {
        name: video.teacher?.user?.first_name + " " + video.teacher?.user?.last_name,
        avatar: video.teacher?.profile_photo
      },
      thumbnail: video.thumbnail,
      video_url: video.video_url,
      progress: video.progress || 0,
      is_watched: video.is_watched || false,
      is_favorite: video.is_favorite || false,
      created_at: video.created_at,
      subtitles: video.subtitles || false,
      allow_download: video.allow_download || false
    }))

    return NextResponse.json({
      success: true,
      data: normalizedVideos,
      count: normalizedVideos.length
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos:", error)
    return NextResponse.json(
      { 
        error: "Erreur lors de la récupération des vidéos",
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
    const { video_id, action } = body

    if (!video_id || !action) {
      return NextResponse.json({ error: "video_id et action requis" }, { status: 400 })
    }

    let endpoint = ""
    let method = "POST"

    switch (action) {
      case "watch":
        endpoint = `/api/videos/${video_id}/watch/`
        break
      case "favorite":
        endpoint = `/api/videos/${video_id}/favorite/`
        method = "POST"
        break
      case "unfavorite":
        endpoint = `/api/videos/${video_id}/favorite/`
        method = "DELETE"
        break
      case "download":
        endpoint = `/api/videos/${video_id}/download/`
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
    console.error("Erreur lors de l'action sur la vidéo:", error)
    return NextResponse.json(
      { 
        error: "Erreur lors de l'action sur la vidéo",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}
