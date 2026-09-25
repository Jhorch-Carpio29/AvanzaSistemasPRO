import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Sesión expirada. Vuelve a iniciar sesión." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No se recibió ninguna imagen." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Solo se permiten imágenes (JPG, PNG, WEBP)." }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "La foto no debe superar 5 MB." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from("candidatos-fotos").upload(path, buffer, {
    contentType: file.type || "image/jpeg",
    cacheControl: "3600",
    upsert: true,
  });

  if (uploadError) {
    return NextResponse.json(
      {
        error: `${uploadError.message}. Crea el bucket público "candidatos-fotos" y las políticas del archivo supabase_schema.sql.`,
      },
      { status: 400 }
    );
  }

  const { data } = supabase.storage.from("candidatos-fotos").getPublicUrl(path);
  if (!data.publicUrl) {
    return NextResponse.json({ error: "No se obtuvo la URL pública de la foto." }, { status: 500 });
  }

  return NextResponse.json({ url: data.publicUrl });
}
