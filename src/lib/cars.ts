import type { Car } from "@/lib/types";

/* TS runtime checks */
const bodyTypes: Array<Car["bodyType"]> = ["suv", "estate", "sedan"];
const modelTypes: Array<Car["modelType"]> = ["plug-in hybrid", "pure electric"];

function isBodyType(data: unknown): data is Car["bodyType"] {
  return Boolean(bodyTypes.find((type) => type === data));
}

function isModelType(data: unknown): data is Car["modelType"] {
  return Boolean(modelTypes.find((type) => type === data));
}

function isKey(key: string, data: object): key is keyof typeof data {
  return data.hasOwnProperty(key);
}

function pick<Key extends keyof Car>(data: object, key: Key): unknown {
  return isKey(key, data) ? data[key] : null;
}

/**
 * It is better to use, something like Zod here, but I want to keep this
 * the 3rd party dependencies to a minimum.
 *
 * > If I were on an island and I could only take 3 libraries
 * > with me, it'd be React, Next.js and TypeScript
 *
 * For completeness sake in zod we would do:
 *
 * ```ts
 * // skipping some properties
 * const car = z.object({
 *  id: zod.string(),
 *  bodyType: zod.union([z.literal("suv"), z.literal("estate"), z.literal("sedan")]),
 * })
 *
 * // and then
 * car.parse(data) // or safeParse
 *
 * ```
 *
 * At the cost of 12.9kB, which might be less than any custom validation/assertions
 * made within a medium sized project.
 *
 */
export function isValidCar(data: unknown): data is Car {
  if (typeof data !== "object") return false;
  if (data === null) return false;

  const draft: Record<keyof Car, unknown> = {
    id: pick(data, "id"),
    modelName: pick(data, "modelName"),
    bodyType: pick(data, "bodyType"),
    modelType: pick(data, "modelType"),
    imageUrl: pick(data, "imageUrl"),
  };

  if (typeof draft.id !== "string") return false;
  if (typeof draft.modelName !== "string") return false;
  if (typeof draft.imageUrl !== "string") return false;
  if (!isBodyType(draft.bodyType)) return false;
  if (!isModelType(draft.modelType)) return false;

  return true;
}
