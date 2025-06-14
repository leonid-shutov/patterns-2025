export type Color = "white" | "yellow" | "red";
export type Level = "info" | "warning" | "error";

export type Options =
  | { level: Level; color?: never }
  | { level?: never; color: Color };

export function logger(options: Options): (message: string) => void;
