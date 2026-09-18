import type { GenericQueryCtx, GenericMutationCtx, GenericActionCtx } from "convex/server";
import type { GenericId } from "convex/values";

declare global {
  const process: { env: Record<string, string | undefined> };
}

export type Id<TableName extends string> = GenericId<TableName>;

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
  runQuery: (query: any, args: any) => Promise<any>;
  runMutation: (mutation: any, args: any) => Promise<any>;
  runAction: (action: any, args: any) => Promise<any>;
}

export interface QueryDefinition<Args, Output> {
  args: Args;
  handler: (ctx: QueryCtx, args: any) => Promise<Output>;
}

export interface MutationDefinition<Args, Output> {
  args: Args;
  handler: (ctx: MutationCtx, args: any) => Promise<Output>;
}

export interface ActionDefinition<Args, Output> {
  args: Args;
  handler: (ctx: ActionCtx, args: any) => Promise<Output>;
}

export function query<Args, Output>(
  definition: QueryDefinition<Args, Output>
): QueryDefinition<Args, Output> {
  return definition;
}

export function mutation<Args, Output>(
  definition: MutationDefinition<Args, Output>
): MutationDefinition<Args, Output> {
  return definition;
}

export function action<Args, Output>(
  definition: ActionDefinition<Args, Output>
): ActionDefinition<Args, Output> {
  return definition;
}

export const internalQuery = query;
export const internalMutation = mutation;
export const internalAction = action;
