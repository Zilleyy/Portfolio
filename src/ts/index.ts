/*
 * COPYRIGHT (c) 2021, COOPER COWLEY.
 *
 * THE CONTENT OF THIS FILE WAS WRITTEN BY COOPER COWLEY.
 * THEREFORE, THE CONTENT OF THIS FILE IS THE INTELLECTUAL PROPERTY OF COOPER COWLEY.
 *
 * IF YOU WOULD LIKE TO USE ANY OF MY WORK IN YOUR OWN WORK, YOU MUST GET MY FORMAL PERMISSION BEFOREHAND.
 *
 * CONTACT: https://zilleyy.software/
 */

/* NODE IMPORTS */
import * as Three from "three";

/* LOCAL IMPORTS */
import "../css/style.css";
import Scene = Three.Scene;
import PerspectiveCamera = Three.PerspectiveCamera;
import WebGLRenderer = Three.WebGLRenderer;
import PointLight = Three.PointLight;
import AmbientLight = Three.AmbientLight;
import MeshStandardMaterial = Three.MeshStandardMaterial;
import TextureLoader = Three.TextureLoader;
import MathUtils = Three.MathUtils;
import Color = Three.Color;
import Mesh = Three.Mesh;
import {Geometry} from "three/examples/jsm/deprecated/Geometry";
import {BufferGeometry} from "three";

const colours = [
    // new Color(115 / 255, 33 / 255, 1),
    // new Color(139 / 255, 255 / 255, 117 / 255),
    // new Color(255 / 255, 133 / 255, 75 / 255),
    // new Color(1, 0.25, 0.25),
    // new Color(255 / 255, 232 / 255, 100 / 255),
    // new Color(50 / 255, 150 / 255, 255 / 255),
    // new Color(198 / 255, 138 / 255, 255 / 255)
    new Color("white"),
    new Color(0xFFDD40)
];

/**
 * @author Cooper Cowley
 * @description This module encapsulates the entire program's source code.
 */
export module Program {

    /**
     * @author Cooper Cowley
     * @description This class represents the Main class in the program...
     */
    export class Engine {

        /* APPLICATION STATE FIELDS */
        public running: boolean;

        /* GLOBAL FIELDS */
        private ambientLight: AmbientLight;
        private readonly textureLoader: TextureLoader = new TextureLoader();

        /* CONSTRUCTOR FIELDS */
        private readonly scene: Scene;
        private readonly camera: PerspectiveCamera;
        private readonly renderer: WebGLRenderer;

        /* STATIC INSTANCE FIELD */
        private static instance: Program.Engine;

        /**
         * The constructor for the Engine class, automatically initialises, loads and animates the Canvas.
         */
        public constructor() {
            Program.Engine.instance = this; // Assign the newly formed instance to the static global instance field.

            this.scene = new Scene();
            this.camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 600);
            this.renderer = new WebGLRenderer({
                canvas: document.querySelector("#bg") as HTMLCanvasElement,
                antialias: true,
                powerPreference: "high-performance",
                precision: "highp"
            });
            this.scene.fog = new Three.Fog("black", 0, 225);

            this.camera.scale.set(2, 2, 2);
            this.running = false;
        }

        public static get getInstance(): Program.Engine {
            return Program.Engine.instance;
        }

        public get getScene(): Scene {
            return this.scene;
        }

        public get getCamera(): PerspectiveCamera {
            return this.camera;
        }

        public get getRenderer(): WebGLRenderer {
            return this.renderer;
        }

        public addStar(): void {
            const starGeometry = () => {
                let random = MathUtils.randInt(0, 2);
                switch(true) {
                    case random === 0:
                        return new Three.TetrahedronGeometry(MathUtils.randInt(8, 16));
                    case random === 1:
                        const size: number = MathUtils.randInt(16, 24);
                        return new Three.BoxGeometry(size, size, size);
                    case random === 2:
                        return new Three.IcosahedronGeometry(MathUtils.randInt(8, 16));
                }
            };
            const starMaterial = new MeshStandardMaterial({ wireframe: true, wireframeLinewidth: 10, opacity: 0.2, color: colours[Math.floor(Math.random() * colours.length)] });
            const star = new Mesh(starGeometry(), starMaterial);

            const [x, y, z]: number[] = Array(3).fill(0).map((value: number, index: number, array: number[]) => {
                const result: number = MathUtils.randFloatSpread(800);
                if(index === 2 && result > 0) return result * -1;
                else return result;
                // TODO - This can be shortened / simplified...
                // TODO - This can be shortened / simplified...
                // TODO - This can be shortened / simplified...
                // TODO - This can be shortened / simplified...
            });

            star.rotation.set(MathUtils.randFloat(0, 3), MathUtils.randFloat(0, 3), MathUtils.randFloat(0, 3))
            star.position.set(x, y, z);

            this.scene.add(star);
        }

        /**
         * Initialises, loads and runs the application.
         */
        public start(): void {
            this.init();
            this.load();
            this.run();
        }

        /**
         * Setup the Scene, Renderer and Camera so it is ready to be drawn to.
         * @private
         */
        private init(): void {
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

        /**
         * Loads all SceneObject(s) into the Scene.
         * @private
         */
        private load(): void {
            /* LOAD LIGHTING */
            this.ambientLight = new AmbientLight(0xFFFFFF);

            this.scene.add(this.ambientLight); // Add both lights to the scene...

            /* LOAD OBJECTS */
            for (let i: number = 0; i < 225; i++) {
                this.addStar();
            }

            /* LOAD BACKGROUND */
            // this.scene.background = this.textureLoader.load("src/media/image/space.jpg");
            this.scene.background = new Color("black");
        }

        /**
         * @description Updates and renders all the SceneObject(s) to be drawn onto the Canvas.
         * @private
         */
        private run(): void {
            const renderCallback: FrameRequestCallback = () => {
                // TODO - I don't like the way this recurses using a function/callback object. Look into making it work with a normal method.
                requestAnimationFrame(renderCallback);

                this.camera.position.z -= 2 / 3;

                for(let object of this.scene.children) {
                    object.rotation.x -= 0.005;
                    object.rotation.y -= 0.005;
                    object.rotation.z -= 0.005;
                    if(object.position.z > this.camera.position.z) {
                        object.position.set(object.position.x, object.position.y, this.camera.position.z - this.camera.far)
                    }
                }

                this.renderer.render(this.scene, this.camera);
            };
            renderCallback(null);
        }

    }

}

const engine = new Program.Engine(); // Create instance of Engine class.
engine.start(); // Start the Engine which initialises, loads and runs the application.