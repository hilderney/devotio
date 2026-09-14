import type { GenericQueryCtx, GenericMutationCtx, GenericActionCtx } from "convex/server";

declare global {
  const process: { env: Record<string, string | undefined> };
}

export interface QueryCtx {
  db: any;
  auth: {
    getUserIdentity: () => Promise<any>;
  };
  storage: any;
}

export interface MutationCtx {
  db: any;
  auth: {
    getUserIdentity: () => Promise<any>;
  };
  storage: any;
}

export interface ActionCtx {
  auth: {
    getUserIdentity: () => Promise<any>;
  };
  storage: any;
}

export interface QueryDefinition<Args, Output> {
  args: Args;
  handler: (ctx: QueryCtx, args: any) => Promise<Output>;
}

export function query<Args, Output>(
  definition: QueryDefinition<Args, Output>
): QueryDefinition<Args, Output> {
  return definition;
}

export function mutation<Args, Output>(
  definition: { args: Args; handler: (ctx: MutationCtx, args: any) => Promise<Output> }
): any {
  return definition;
}

export function action<Args, Output>(
  definition: { args: Args; handler: (ctx: ActionCtx, args: any) => Promise<Output> }
): any {
  return definition;
}

export const internalQuery = query;
export const internalMutation = mutation;
export const internalAction = action;

