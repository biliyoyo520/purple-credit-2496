import { type LoaderFunctionArgs } from "react-router";
import fs from "node:fs";
import path from "node:path";

export async function loader({ request }: LoaderFunctionArgs) {
  const possiblePaths = [
    path.join(process.cwd(), "public/fonts/NotoSerifCJKsc-ExtraLight.otf"),
    path.join(process.cwd(), "build/client/fonts/NotoSerifCJKsc-ExtraLight.otf"),
    path.join(process.cwd(), "client/fonts/NotoSerifCJKsc-ExtraLight.otf"),
    path.resolve(process.cwd(), "../public/fonts/NotoSerifCJKsc-ExtraLight.otf"),
  ];

  let filePath: string | undefined;
  let stats: fs.Stats | undefined;

  for (const p of possiblePaths) {
    try {
      stats = await fs.promises.stat(p);
      filePath = p;
      break;
    } catch {
      continue;
    }
  }

  if (!filePath || !stats) {
    console.error("Font file not found. Searched in:", possiblePaths);
    return new Response("Font not found", { status: 404 });
  }
  
  try {
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
