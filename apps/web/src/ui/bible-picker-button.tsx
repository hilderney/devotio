import type { ComponentProps } from "react";
import { IconButton } from "./button";

/** The same contextual return control in Bible reading and both writing forms. */
export function BiblePickerButton(
  props: Omit<ComponentProps<typeof IconButton>, "className" | "variant">,
) {
  return (
    <IconButton
      {...props}
      variant="secondary"
      className="bible-picker-return"
    />
  );
}
