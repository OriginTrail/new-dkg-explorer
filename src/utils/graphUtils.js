import * as THREE from "three";

export const GRAPH_OPTIONS = {
  backgroundColor: "#080E0E",
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

export const nodeTypes = {
  knowledgeCollection: {
    name: "KNOWLEDGE_COLLECTION",
    color: "#8B85F4",
    shape: "hexagonal_prism",
    size: 10,
  },
  knowledgeAsset: {
    name: "KNOWLEDGE_ASSET",
    color: "#6344DF",
    shape: "octahedron",
    size: 6,
  },
  knowledgeAssetWithUrl: {
    name: "KNOWLEDGE_ASSET_URL",
    color: "#6344DF",
    shape: "octahedron",
    size: 7,
    glow: true,
  },
  property: {
    name: "PROPERTY",
    color: "#1ADED7",
    shape: "sphere",
    size: 5,
  },
  propertyWithUrl: {
    name: "PROPERTY_URL",
    color: "#1ADED7",
    shape: "sphere",
    size: 5,
    glow: true,
  },
  owner: {
    name: "OWNER",
    color: "#FF0087",
    shape: "toroid",
    size: 7,
  },
  array: {
    name: "ARRAY",
    color: "#40797a",
    shape: "sphere",
    size: 3,
  },
};

export const linkTypes = {
  directedCollection: {
    name: "DIRECTED_COLLECTION",
    color: "#1ADED7",
    width: 2,
    opacity: 0.8,
  },
  undirectedCollection: {
    name: "UNDIRECTED_COLLECTION",
    color: "#8B85F4",
    width: 1.5,
    opacity: 0.7,
  },
  directed: {
    name: "DIRECTED",
    color: "#1ADED7",
    width: 3,
    opacity: 0.9,
  },
  undirected: {
    name: "UNDIRECTED",
    color: "#8B85F4",
    width: 1,
    opacity: 0.6,
  },
};

export function getNodeMesh(node) {
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

export function getLinkMesh(link) {
  const { source, target } = link;

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
  return line;
}

export function generateGraphData() {
  const nodes = [];
  const links = [];
  let currentNodeId = 0;

  const createNode = (typeKey, id) => {
    const type = nodeTypes[typeKey];
    return {
      id,
      type: type.name,
      color: type.color,
      shape: type.shape,
      size: type.size,
      glow: Math.random() >= 0.5 ? true : false,
    };
  };

  nodes.push(createNode("knowledgeCollection", currentNodeId));
  const hexagonalPrismId = currentNodeId;
  currentNodeId++;

  for (let i = 0; i < 2; i++) {
    nodes.push(createNode("property", currentNodeId));
    links.push({
      source: hexagonalPrismId,
      target: currentNodeId,
      linkType: linkTypes.directedCollection, // Random link type
    });
    currentNodeId++;
  }

  nodes.push(createNode("knowledgeAsset", currentNodeId));
  const octahedronId = currentNodeId;
  links.push({
    source: hexagonalPrismId,
    target: octahedronId,
    linkType: linkTypes.directedCollection, // Random link type
  });
  currentNodeId++;

  nodes.push(createNode("owner", currentNodeId));
  links.push({
    source: hexagonalPrismId,
    target: currentNodeId,
    linkType: linkTypes.undirectedCollection, // Random link type
  });
  currentNodeId++;

  for (let i = 0; i < 3; i++) {
    nodes.push(createNode("property", currentNodeId));
    links.push({
      source: octahedronId,
      target: currentNodeId,
      linkType: linkTypes.undirected, // Random link type
    });
    currentNodeId++;
  }

  const octahedronsToConnect = [];
  for (let i = 0; i < 2; i++) {
    nodes.push(createNode("knowledgeAsset", currentNodeId));
    octahedronsToConnect.push(currentNodeId);
    links.push({
      source: octahedronId,
      target: currentNodeId,
      linkType: linkTypes.directed, // Random link type
    });
    currentNodeId++;
  }

  octahedronsToConnect.forEach((octahedron) => {
    nodes.push(createNode("array", currentNodeId));
    links.push({
      source: octahedron,
      target: currentNodeId,
      linkType: linkTypes.undirected, // Random link type
    });
    currentNodeId++;
  });

  // Add two properties to the last knowledge asset (octahedron) node
  const lastKnowledgeAssetId = currentNodeId - 1; // Last knowledge asset is the last node added
  for (let i = 0; i < 2; i++) {
    nodes.push(createNode("property", currentNodeId));
    links.push({
      source: lastKnowledgeAssetId,
      target: currentNodeId,
      linkTypes: linkTypes.undirected,
    });
    currentNodeId++;
  }

  return { nodes, links };
}
