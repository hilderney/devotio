import type { z } from "zod";
import { localCacheSchema } from "./validators/cache";
export { localCacheSchema };
export type LocalCache = z.infer<typeof localCacheSchema>;
export interface LocalCacheStorage { read(): unknown; write(cache: LocalCache): void; clear(): void }
export const LOCAL_SESSION_SECONDS = 30 * 24 * 60 * 60;
