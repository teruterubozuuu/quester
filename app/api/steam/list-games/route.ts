import { supabase } from "@/lib/supabase"

const CACHE_TTL_HOURS = 24

async function isCacheStale() {
  const { data } = await supabase
    .from("steam_cache")
    .select("last_updated")
    .eq("id", 1)
    .single()

  if (!data) return true

  const lastUpdated = new Date(data.last_updated)
  const hoursSince = (Date.now() - lastUpdated.getTime()) / 1000 / 60 / 60
  return hoursSince > CACHE_TTL_HOURS
}

async function fetchAndStoreAllGames() {
  const apiKey = process.env.STEAMAPI_KEY
  let allGames: { appid: number; name: string }[] = []
  let lastAppId = 0
  let hasMore = true
  let page = 1

  while (hasMore) {
    console.log(`Fetching page ${page}...`)
    const url = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${apiKey}&include_games=true&max_results=50000&last_appid=${lastAppId}`
    const res = await fetch(url)
    const data = await res.json()
    const apps = data.response.apps ?? []

    // only pick appid and name
    allGames = [
      ...allGames,
      ...apps.map((g: any) => ({ appid: g.appid, name: g.name })),
    ]

    if (!data.response.have_more_results) {
      hasMore = false
    } else {
      lastAppId = data.response.last_appid
      page++
    }
  }

  // store entire list as one JSON value
  await supabase.from("steam_cache").upsert({
    id: 1,
    games: allGames,
    last_updated: new Date().toISOString(),
  })

  console.log("Saved to Supabase!")
  return allGames
}

export async function GET() {
  try {
    const stale = await isCacheStale()

    if (stale) {
      const games = await fetchAndStoreAllGames()
      return Response.json({ games })
    }

    const { data, error } = await supabase
      .from("steam_cache")
      .select("games")
      .eq("id", 1)
      .single()

    if (error) throw error

    // parse if stored as string
    const games =
      typeof data.games === "string" ? JSON.parse(data.games) : data.games

    return Response.json({ games })
  } catch (err) {
    console.error("Full error:", JSON.stringify(err, null, 2)) // ← log the full error
    return Response.json({ error: JSON.stringify(err) }, { status: 500 }) // ← return full error
  }
}
