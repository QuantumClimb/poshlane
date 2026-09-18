import os
from PIL import Image

final_stock_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'final_stock')
final_stock_dir = os.path.abspath(final_stock_dir)

png_files = [f for f in os.listdir(final_stock_dir) if f.lower().endswith('.png')]

print(f"Found {len(png_files)} PNG files in {final_stock_dir}")

total_orig_size = 0
total_new_size = 0

for file_name in png_files:
    png_path = os.path.join(final_stock_dir, file_name)
    base_name = os.path.splitext(file_name)[0]
    webp_name = f"{base_name}.webp"
    webp_path = os.path.join(final_stock_dir, webp_name)
    
    orig_size = os.path.getsize(png_path)
    total_orig_size += orig_size
    
    try:
        with Image.open(png_path) as img:
            # Convert RGBA / P to RGB or keep RGBA if transparent
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")
            
            # Resize max dimension to 1200 if larger
            max_dim = max(img.width, img.height)
            if max_dim > 1200:
                scale = 1200.0 / max_dim
                new_size = (int(img.width * scale), int(img.height * scale))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            img.save(webp_path, "WEBP", quality=82, optimize=True)
            
        new_size = os.path.getsize(webp_path)
        total_new_size += new_size
        
        # Remove original PNG
        os.remove(png_path)
        print(f"[OK] Converted: {file_name} ({orig_size / (1024*1024):.2f} MB) -> {webp_name} ({new_size / 1024:.1f} KB)")
    except Exception as e:
        print(f"[ERR] Failed to convert {file_name}: {e}")

print("\n--------------------------------------------------")
print(f"Original total size: {total_orig_size / (1024*1024):.2f} MB")
print(f"New total size:      {total_new_size / (1024*1024):.2f} MB")
print(f"Reduction:           {((total_orig_size - total_new_size) / total_orig_size) * 100:.1f}%")
