import { NextRequest, NextResponse } from "next/server";

type GameDetails = {
  id: string;
  name: string;
};

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    const normalizedQuery = String(query ?? "").trim();

    if (!normalizedQuery) {
      return NextResponse.json([]);
    }

    const clientId = process.env.IGDB_CLIENT_ID;
    const token = process.env.IGDB_TOKEN;

    if (!clientId || !token) {
      console.error("Missing IGDB credentials");
      return NextResponse.json(
        { error: "IGDB is not configured" },
        { status: 500 },
      );
    }

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: `search "${normalizedQuery.replaceAll('"', '\\"')}"; fields id,name,cover.url,game_type.type,genres.name,platforms.name,summary,total_rating,url,franchise.name,first_release_date; limit 5;`,
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("IGDB request failed:", response.status, details);

      return NextResponse.json(
        { error: "IGDB request failed" },
        { status: response.status },
      );
    }

    const games: GameDetails[] = await response.json();

    return NextResponse.json(games);
  } catch (error) {
    console.error("Game search failed:", error);

    return NextResponse.json(
      { error: "Failed to search games" },
      { status: 500 },
    );
  }
}