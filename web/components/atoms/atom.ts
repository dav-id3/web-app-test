import React from "react";
import { Interactions, Data } from "../interfaces"

export interface AtomProps<I extends Interactions, D extends Data> {
    interactions: I;
    data: D;
}

export type Atom<I extends Interactions, D extends Data> = (props: {
    interactions: I;
    data: D;
    children?: React.ReactElement<any, any>;
}) => React.ReactElement;
