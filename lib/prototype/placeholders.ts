import {
  productArtifactAt,
  productArtifactForKey,
} from "@/lib/products/artifact-images";

/** @deprecated use productArtifactForKey — kept for call sites */
export function placeholderForFabric(fabric: string | null): string {
  return productArtifactForKey(fabric ?? "default");
}

export function placeholderAt(index: number): string {
  return productArtifactAt(index);
}
