import { type LoaderFunctionArgs } from "react-router";
import fs from "node:fs";
import path from "node:path";

export async function loader({ request }: LoaderFunctionArgs) {
  const filePath = path.join(process.cwd(), "public/fonts/NotoSerifCJKsc-ExtraLight.otf");
  
  try {
    const stats = await fs.promises.stat(filePath);
    const data = await fs.promises.readFile(filePath);
    
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "font/otf",
        "Content-Length": stats.size.toString(),
        "Content-Disposition": 'inline; filename="NotoSerifCJKsc-ExtraLight.otf"',
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Font file not found:", filePath, error);
    return new Response("Font not found", { status: 404 });
  }
}
