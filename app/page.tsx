import Image from "next/image";

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

  if (!res.ok) {
    throw new Error("Failed to fetch images");
  }

  return res.json();
}

export default async function Page() {
  let images: ImageData[] = [];
  try {
    images = await getImages();
  } catch (error) {
    console.error("Error fetching images:", error);

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
                width={500}
                height={300}
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
