import { Platform } from "react-native";
import { File } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { fetch } from "expo/fetch";
import type { ImagePickerAsset } from "expo-image-picker";

const MAX_BYTES = 4_000_000;
const MAX_EDGE = 1600;

export type UploadPhoto = { blob: Blob; dispose: () => void };

export async function preparePhoto(asset: ImagePickerAsset): Promise<UploadPhoto> {
  const context = ImageManipulator.manipulate(asset.uri);
  if (asset.width > MAX_EDGE || asset.height > MAX_EDGE) {
    context.resize(asset.width >= asset.height
      ? { width: MAX_EDGE, height: null }
      : { width: null, height: MAX_EDGE });
  }
  let image = await context.renderAsync();
  try {
    // Some providers omit dimensions. Measure the decoded image before resizing.
    if (image.width > MAX_EDGE || image.height > MAX_EDGE) {
      context.resize(image.width >= image.height
        ? { width: MAX_EDGE, height: null }
        : { width: null, height: MAX_EDGE });
      image.release();
      image = await context.renderAsync();
    }
    for (const compress of [0.8, 0.6, 0.4]) {
      const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress });
      if (Platform.OS === "web") {
        const response = await fetch(saved.uri);
        const blob = await response.blob();
        if (blob.size > 0 && blob.size < MAX_BYTES) {
          return { blob, dispose: () => {} };
        }
      } else {
        const file = new File(saved.uri);
        if (file.exists && file.size > 0 && file.size < MAX_BYTES) {
          // A real Blob is required by Expo 57 fetch; URI descriptors are unsupported.
          return { blob: file, dispose: () => { if (file.exists) file.delete(); } };
        }
        if (file.exists) file.delete();
      }
    }
    throw new Error("Fotografia nu a putut fi micșorată sub 4 MB. Alege altă fotografie.");
  } finally {
    image.release();
    context.release();
  }
}
