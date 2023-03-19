import {
  Engine,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";

import React, { useEffect, useRef } from "react";

const SceneComponent = (props) => {
  const reactCanvas = useRef();

  const {
    canvasId,
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    ...rest
  } = props;

  useEffect(() => {
    if (!reactCanvas.current) return;

    const engine = new Engine(
      reactCanvas.current,
      antialias,
      engineOptions,
      adaptToDeviceRatio
    );

    const scene = new Scene(engine, sceneOptions);

    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce(onSceneReady);
    }

    engine.runRenderLoop(() => {
      onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
  ]);

  return <canvas id={canvasId} ref={reactCanvas} {...rest} />;
};

let box;

const onSceneReady = (scene, image) => {
  const camera = new ArcRotateCamera(
    "Camera",
    (3 * Math.PI) / 2,
    Math.PI / 2,
    5,
    Vector3.Zero(),
    scene
  );

  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  camera.attachControl(canvas, true);

  const light = new HemisphericLight("light", new Vector3(1, 1, 1), scene);

  light.intensity = 0.7;

  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  box.position.y = 0;

  const material = new StandardMaterial("material", scene);
  const texture = new Texture(image, scene);
  material.diffuseTexture = texture;

  box.material = material;
};

const onRender = (scene) => {
  if (box !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;

    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

const Render = ({ image }) => (
  <div id="renderCanvas">
    <SceneComponent
      canvasId="babylon-canvas"
      antialias
      onSceneReady={(scene) => onSceneReady(scene, image)}
      onRender={onRender}
    />
  </div>
);

export default Render;
