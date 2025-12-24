import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const placeholderImagesMap = new Map<string, ImagePlaceholder>(
  data.placeholderImages.map(img => [img.id, img])
);

export function getPlaceholderImage(id: string): ImagePlaceholder | undefined {
  return placeholderImagesMap.get(id);
}
