export default function ImageUploadManager({
  mode,
  handleImageUpload,
  addImageByUrl,
  images,
  removeImage,
}) {
  if (mode === "cj") {
    return null;
  }

  return (
    <div className="mt-10">
      <input type="file" multiple onChange={handleImageUpload} className="mb-4" />

      <input
        type="text"
        placeholder="Paste image URL + Enter"
        className="mb-6 w-full rounded-lg bg-[#111827] px-4 py-3"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            addImageByUrl(event.target.value);
            event.target.value = "";
          }
        }}
      />

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="relative">
            <button onClick={() => removeImage(image.id)}>X</button>
            <img src={image.url} className="h-40 w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
