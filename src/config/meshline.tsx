import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Object3DNode, extend } from "@react-three/fiber";
import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
      meshLineMaterial: Object3DNode<MeshLineMaterial, typeof MeshLineMaterial>;
    }
  }
}

export function extendMeshLine() {
  extend({ MeshLineGeometry, MeshLineMaterial });
}
