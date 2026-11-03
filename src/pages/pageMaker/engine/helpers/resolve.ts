import { mergeWithDefault } from "../../core/hooks/useDesignSaver";
import { ELEMENT_DEFINITION_BY_TYPE } from "../../core/elementDefinitions";
import type { AnyElementDefinition } from "../../core/helpers/elementDefinition";
import type { ElementNode } from "./componentTypes";

export interface ResolvedState {
  def: AnyElementDefinition | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;
}

/** State efektif sebuah elemen bawaan: salinan di node, dilengkapi default. */
export function resolveElement(node: ElementNode): ResolvedState {
  const def = ELEMENT_DEFINITION_BY_TYPE[node.elementType];
  return { def, state: def ? mergeWithDefault(def.defaults, node.state) : node.state };
}
