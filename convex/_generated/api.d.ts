/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as app from "../app.js";
import type * as auth from "../auth.js";
import type * as exercises from "../exercises.js";
import type * as http from "../http.js";
import type * as lib from "../lib.js";
import type * as migrations from "../migrations.js";
import type * as routineStructure from "../routineStructure.js";
import type * as routineSummary from "../routineSummary.js";
import type * as routines from "../routines.js";
import type * as seed from "../seed.js";
import type * as structureTypes from "../structureTypes.js";
import type * as validators from "../validators.js";
import type * as workoutSessionStructure from "../workoutSessionStructure.js";
import type * as workouts from "../workouts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  app: typeof app;
  auth: typeof auth;
  exercises: typeof exercises;
  http: typeof http;
  lib: typeof lib;
  migrations: typeof migrations;
  routineStructure: typeof routineStructure;
  routineSummary: typeof routineSummary;
  routines: typeof routines;
  seed: typeof seed;
  structureTypes: typeof structureTypes;
  validators: typeof validators;
  workoutSessionStructure: typeof workoutSessionStructure;
  workouts: typeof workouts;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
