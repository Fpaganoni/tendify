"use server";

import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db";

// Esta función se ejecuta en el servidor donde SÍ hay variables de entorno
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
