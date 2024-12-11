import * as THREE from "three";
import SpriteText from "three-spritetext";

export const GRAPH_OPTIONS = {
  backgroundColor: "#03061C40",
  warmupTicks: 100,
  cooldownTicks: 200,
  cooldownTime: 3000,
  enableNodeDrag: false,
  linkDistance: 10,
  chargeStrength: -5,
};

export const LINK = {
  width: 0.1,
  opacity: 1,
};

export const CAMERA = {
  position: { x: 0, y: 0, z: 600 },
  target: { x: 0, y: 0, z: 0 },
  duration: 3000,
};

export const NODE_ZOOM = 15;

type GraphNodeId = string | number;

type GraphNodeData = {
  type: string;
  color: string;
  shape: string;
  size: number;
  glow?: boolean;
};

type GraphNodeDynamicData = {
  id: GraphNodeId;
  value?: string;
};

type GraphNode = {
  index: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
} & GraphNodeDynamicData &
  GraphNodeData;

type GraphLinkData = {
  type: string;
  color: string;
  width: number;
  opacity: number;
};

type GraphLinkDynamicData = {
  source: GraphNodeId;
  target: GraphNodeId;
  value?: string;
};

type GraphLink = GraphLinkDynamicData &
  GraphLinkData & {
    index: number;
    source: GraphNode;
    target: GraphNode;
  };

const nodeTypes = {
  knowledgeCollection: {
    type: "KNOWLEDGE_COLLECTION",
    color: "#8B85F4",
    shape: "hexagonal_prism",
    size: 10,
  },
  knowledgeAsset: {
    type: "KNOWLEDGE_ASSET",
    color: "#8B85F4",
    shape: "ka",
    size: 10,
    glow: true,
  },
  knowledgeAssetHidden: {
    type: "KNOWLEDGE_ASSET_HIDDEN",
    color: "#6344DF",
    shape: "octahedron",
    size: 6,
  },
  knowledgeAssetWithUrl: {
    type: "KNOWLEDGE_ASSET_URL",
    color: "#6344DF",
    shape: "octahedron",
    size: 7,
    glow: true,
  },
  property: {
    type: "PROPERTY",
    color: "#8B85F4",
    shape: "text",
    size: 3,
  },
  propertyWithUrl: {
    type: "PROPERTY_URL",
    color: "#1ADED7",
    shape: "sphere",
    size: 4,
    glow: true,
  },
  owner: {
    type: "OWNER",
    color: "#FF0087",
    shape: "toroid",
    size: 7,
  },
  array: {
    type: "ARRAY",
    color: "#40797a",
    shape: "sphere",
    size: 3,
  },
} satisfies Record<string, GraphNodeData>;

const linkTypes = {
  directedCollection: {
    type: "DIRECTED_COLLECTION",
    color: "#1ADED7",
    width: 2,
    opacity: 0.8,
  },
  undirectedCollection: {
    type: "UNDIRECTED_COLLECTION",
    color: "#8B85F4",
    width: 1.5,
    opacity: 0.7,
  },
  directed: {
    type: "DIRECTED",
    color: "#1ADED7",
    width: 3,
    opacity: 0.9,
  },
  undirected: {
    type: "UNDIRECTED",
    color: "#8B85F4",
    width: 1,
    opacity: 0.6,
  },
} satisfies Record<string, GraphLinkData>;

export function getNodeMesh(node: GraphNode) {
  if (!node) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(4),
      new THREE.MeshBasicMaterial({ color: "#000000" }),
    );
  }

  let geometry, material;
  switch (node.shape) {
    case "hexagonal_prism":
      const radius = 8;

      const shape = new THREE.Shape();
      const angle = Math.PI / 3;
      const points = [];

      for (let i = 0; i < 6; i++) {
        const x = radius * Math.cos(i * angle);
        const y = radius * Math.sin(i * angle);
        points.push(new THREE.Vector2(x, y));
      }

      shape.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i].x, points[i].y);
      }
      shape.lineTo(points[0].x, points[0].y);

      const extrudeSettings = {
        depth: 2,
        bevelEnabled: true,
        bevelSegments: 50,
        steps: 10,
        bevelSize: 5,
        bevelThickness: 1,
      };

      geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      material = new THREE.MeshPhongMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.5,
        shininess: 10,
        specular: "#ffffff",
        transparent: false,
        opacity: 1,
      });
      break;
    case "octahedron":
      geometry = new THREE.OctahedronGeometry(6);
      material = new THREE.MeshPhongMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.5,
        shininess: 10,
        specular: "#ffffff",
        transparent: false,
        opacity: 1,
      });
      break;
    case "sphere":
      geometry = new THREE.SphereGeometry(4);
      material = new THREE.MeshPhongMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.5,
        shininess: 10,
        specular: "#ffffff",
        transparent: false,
        opacity: 1,
      });
      break;
    case "toroid":
      geometry = new THREE.IcosahedronGeometry(4);
      material = new THREE.MeshPhongMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.5,
        shininess: 10,
        specular: "#ffffff",
        transparent: false,
        opacity: 1,
      });
      break;
    case "text":
      const text = new SpriteText(`${node.value}`, node.size, node.color);
      text.material.depthWrite = false;
      text.fontWeight = "bold";
      text.backgroundColor = "#03061c";
      text.padding = [1.5 * node.size, node.size];
      text.borderRadius = node.size;
      return text;
    case "ka":
      const imgTexture = new THREE.TextureLoader().load(
        `./images/explorer-ka.png`,
      );
      imgTexture.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: imgTexture,
          transparent: true,
          alphaTest: 0,
        }),
      );
      sprite.scale.set(node.size * 2, node.size * 2, 0);
      return sprite;
    default:
      geometry = new THREE.SphereGeometry(4);
      material = new THREE.MeshPhongMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.5,
        shininess: 10,
        specular: "#ffffff",
        transparent: false,
        opacity: 1,
      });
      break;
  }

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

export function getLinkMesh(link: GraphLink) {
  const { source, target, value } = link;
  const positions = new Float32Array([
    source.x,
    source.y,
    source.z,
    target.x,
    target.y,
    target.z,
  ]);

  const colors = new Float32Array([
    99 / 255,
    68 / 255,
    223 / 255,
    26 / 255,
    222 / 255,
    215 / 255,
  ]);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    opacity: 1,
  });

  const line = new THREE.Line(geometry, material);
  // TODO: merge line & text

  const text = new SpriteText(value, 3, "lightgrey");
  text.fontWeight = "bold";

  text.position.set(
    source.x + (source.x + target.x) / 2,
    source.y + (source.y + target.y) / 2,
    source.z + (source.z + target.z) / 2, // middle point
  );

  return text;
}

export const createNode = (
  typeKey: keyof typeof nodeTypes,
  id: GraphNodeId,
  value?: string,
): GraphNodeData & GraphNodeDynamicData => {
  const data = nodeTypes[typeKey];
  return {
    id,
    glow: Math.random() >= 0.5 ? true : false,
    ...data,
    value,
  };
};

export const createLink = (
  source: GraphNodeId,
  target: GraphNodeId,
  type: keyof typeof linkTypes,
  value?: string,
): GraphLinkData & GraphLinkDynamicData => {
  return {
    ...linkTypes[type],
    source,
    target,
    value,
  };
};

export class KnowledgeGraph {
  private nodes: (GraphNodeData & GraphNodeDynamicData)[];
  private links: (GraphLinkData & GraphLinkDynamicData)[];
  private knowledgeCollectionShown = false;

  constructor(
    public readonly ual: string,
    options: {
      assertion?: Record<string, any>[];
      showKnowledgeCollection?: boolean;
    } = {},
  ) {
    this.nodes = [];
    this.links = [];

    if (options.showKnowledgeCollection) {
      this.knowledgeCollectionShown = true;
      this.nodes.push(createNode("knowledgeCollection", ual));
    }

    if (options.assertion) this.processAssertion(options.assertion);
  }

  processAssertion(assertion: Record<string, any>[]) {
    const resolvedMap: Record<any, boolean> = {};

    for (const ka of assertion) {
      if (!("@id" in ka))
        throw new Error("Unexpected error - no @id field in assertion!");

      const ka_id = ka["@id"];
      resolvedMap[ka_id] = true;

      for (const relation in ka) {
        if (relation === "@id") continue;

        const props = ka[relation];
        if (!Array.isArray(props) || !props.length)
          throw new Error("Unexpected value in assertion - not an array!");

        let source_id = ka_id;
        if (props.length !== 1) {
          source_id = `${ka_id}_${relation}_props`;
          this.nodes.push(createNode("array", source_id));
          this.links.push(createLink(ka_id, source_id, "directed"));
        }

        for (const prop of props) {
          let target_id = prop["@id"];
          if (target_id) {
            if (!resolvedMap[target_id]) resolvedMap[target_id] = false;
          } else {
            const value = prop["@value"];
            if (!value)
              throw new Error(
                "Unexpected error - no @value field in property!",
              );

            target_id = `${ka_id}_${relation}_prop_${value}`;
            this.nodes.push(createNode("property", target_id, value));
          }
          this.links.push(
            createLink(source_id, target_id, "directed", relation),
          );
        }
      }
      this.nodes.push(createNode("knowledgeAsset", ka_id));

      if (this.knowledgeCollectionShown)
        this.links.push(createLink(this.ual, ka_id, "directedCollection"));
    }

    for (const id in resolvedMap) {
      if (!resolvedMap[id])
        this.nodes.push(createNode("knowledgeAssetHidden", id));
    }
  }

  // addKnowledgeAsset() {}
  // addPropertyArray() {}
  // connectToKnowledgeCollection() {}

  get data() {
    return { nodes: this.nodes, links: this.links };
  }
}

export function generateGraphData() {
  const nodes = [];
  const links = [];
  let currentNodeId = 100;

  nodes.push(createNode("knowledgeCollection", currentNodeId));
  const hexagonalPrismId = currentNodeId;
  currentNodeId++;

  for (let i = 0; i < 2; i++) {
    nodes.push(createNode("property", currentNodeId));
    links.push(
      createLink(hexagonalPrismId, currentNodeId, "directedCollection"),
    );
    currentNodeId++;
  }

  nodes.push(createNode("knowledgeAsset", currentNodeId));
  const octahedronId = currentNodeId;
  links.push(createLink(hexagonalPrismId, octahedronId, "directedCollection"));
  currentNodeId++;

  nodes.push(createNode("owner", currentNodeId));
  links.push(
    createLink(hexagonalPrismId, currentNodeId, "undirectedCollection"),
  );
  currentNodeId++;

  for (let i = 0; i < 3; i++) {
    nodes.push(createNode("property", currentNodeId));
    links.push(createLink(octahedronId, currentNodeId, "undirected"));
    currentNodeId++;
  }

  const octahedronsToConnect = [];
  for (let i = 0; i < 2; i++) {
    nodes.push(createNode("knowledgeAsset", currentNodeId));
    octahedronsToConnect.push(currentNodeId);
    links.push(createLink(octahedronId, currentNodeId, "directed"));
    currentNodeId++;
  }

  octahedronsToConnect.forEach((octahedron) => {
    nodes.push(createNode("array", currentNodeId));
    links.push(createLink(octahedron, currentNodeId, "undirected"));
    currentNodeId++;
  });

  // Add two properties to the last knowledge asset (octahedron) node
  const lastKnowledgeAssetId = currentNodeId - 1; // Last knowledge asset is the last node added
  for (let i = 0; i < 2; i++) {
    nodes.push(createNode("property", currentNodeId));
    links.push(createLink(lastKnowledgeAssetId, currentNodeId, "undirected"));
    currentNodeId++;
  }

  return { nodes, links };
}
