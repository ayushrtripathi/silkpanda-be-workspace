/**
 * Copies D:\SilkPanda\Artifacts\Products → public/products/saree-NN.*
 */
import { copyFileSync, mkdirSync, readdirSync } from "fs";
import { join, resolve } from "path";

const SRC = process.env.SILKPANDA_ARTIFACTS_DIR ??
  "D:\\SilkPanda\\Artifacts\\Products";
const DEST = resolve(process.cwd(), "public", "products");

mkdirSync(DEST, { recursive: true });

const files = readdirSync(SRC)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();

if (files.length === 0) {
  console.error(`No images found in ${SRC}`);
  process.exit(1);
}

files.forEach((file, index) => {
  const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
  const destName = `saree-${String(index + 1).padStart(2, "0")}${ext}`;
  copyFileSync(join(SRC, file), join(DEST, destName));
  console.log(`Copied → public/products/${destName}`);
});

console.log(`Done. ${files.length} images in public/products/`);
