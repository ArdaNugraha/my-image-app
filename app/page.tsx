// app/page.tsx
import Image from "next/image";

// 1. Definisikan tipe data untuk objek gambar
interface ImageData {
  id: string;
  url: string;
  title: string;
  description: string;
}

async function getImages(): Promise<ImageData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/images`, {
    cache: "no-store",
  });

  // Periksa apakah respons berhasil (status 200-299)
  if (!res.ok) {
    // Melempar error untuk ditangkap oleh try-catch di Page()
    throw new Error("Failed to fetch images");
  }

  // Mengembalikan data JSON yang sudah diparse
  return res.json();
}

export default async function Page() {
  // 2. Gunakan blok try-catch untuk penanganan error
  let images: ImageData[] = [];
  try {
    images = await getImages();
  } catch (error) {
    console.error("Error fetching images:", error);
    // Di sini Anda bisa menampilkan pesan error ke pengguna
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-bold">
          Failed to load gallery. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gallery</h1>
      {images.length === 0 ? (
        <p className="text-center text-gray-500">No images to display.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white p-2 rounded shadow">
              <Image
                src={img.url}
                alt={img.title}
                className="w-full h-48 object-cover rounded"
                width={500} // Tambahkan properti width dan height
                height={300} // untuk optimasi gambar Next.js
              />
              <h3 className="font-semibold mt-2">{img.title}</h3>
              <p className="text-sm text-gray-600">{img.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
