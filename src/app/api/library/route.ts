import { NextResponse } from "next/server";
import { LIBRARY_ITEMS } from "@/data/library";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(LIBRARY_ITEMS);
}
