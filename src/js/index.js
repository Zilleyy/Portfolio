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
const Color = THREE.Color;
const Scene = THREE.Scene;
const PerspectiveCamera = THREE.PerspectiveCamera;
const WebGLRenderer = THREE.WebGLRenderer;
const Fog = THREE.Fog;
const AmbientLight = THREE.AmbientLight;
const MathUtils = THREE.MathUtils;

const colours = [
    new Color("white"),
    new Color(0xFFDD40)
];

class Central {

    constructor() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 600);
        this.renderer = new WebGLRenderer({
            canvas: document.querySelector("#bg"),
            antialias: true,
            powerPreference: "high-performance",
        });
        this.scene.fog = new Fog("black", 0, 225);

        this.camera.scale.set(2, 2, 2);
    }

    add_star() {
        const star_geometry = () => {
            let random = this.randInt(0, 2);
            switch(true) {
                case random === 0:
                    return new THREE.TetrahedronGeometry(this.randInt(8, 16));
                case random === 1:
                    const size = this.randInt(16, 24);
                    return new THREE.BoxGeometry(size, size, size);
                case random === 2:
                    return new THREE.IcosahedronGeometry(this.randInt(8, 16));
            }
        };
        const star_material = new THREE.MeshStandardMaterial({ wireframe: true, wireframeLinewidth: 10, opacity: 0.2, color: colours[Math.floor(Math.random() * colours.length)] });
        const star = new THREE.Mesh(star_geometry(), star_material);

        const [x, y, z] = Array(3).fill(0).map((value, index, array) => {
            const result = this.randFloatSpread(800);
            if(index === 2 && result > 0) return result * -1;
            else return result;
        });

        star.rotation.set(this.randFloat(0, 3), this.randFloat(0, 3), this.randFloat(0, 3))
        star.position.set(x, y, z);

        this.scene.add(star);
    }

    /**
     * Initialises, loads and runs the application.
     */
    start() {
        this.init();
        this.load();
        this.run();
    }

    /**
     * Setup the Scene, Renderer and Camera so it is ready to be drawn to.
     * @private
     */
    init() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Loads all SceneObject(s) into the Scene.
     * @private
     */
    load() {
        /* LOAD LIGHTING */
        this.ambientLight = new AmbientLight(0xFFFFFF);

        this.scene.add(this.ambientLight); // Add both lights to the scene...

        /* LOAD OBJECTS */
        for (let i = 0; i < 225; i++) {
            this.add_star();
        }

        /* LOAD BACKGROUND */
        this.scene.background = new Color("black");
    }

    /**
     * @description The main game-loop for the program.
     * @private
     */
    run() {
        requestAnimationFrame(this.run.bind(this)); // Request the next animation frame.
        this.render(); // Render the current frame.
        this.update(); // Perform updates for the next frame.
    }

    /**
     * @description Renders all the SceneObject(s) to the Canvas.
     * @private
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * @description Updates all the SceneObject(s).
     * @private
     */
    update() {
        this.camera.position.z -= 2 / 3;

        for(let object of this.scene.children) {
            object.rotation.x -= 0.005;
            object.rotation.y -= 0.005;
            object.rotation.z -= 0.005;

            if(object.position.z > this.camera.position.z)
                object.position.set(object.position.x, object.position.y, this.camera.position.z - this.camera.far);
        }
    }

    randInt(low, high) {
        return low + Math.floor(Math.random() * (high - low + 1));
    } // Random float from <low, high> interval

    randFloatSpread(range) {
        return range * (0.5 - Math.random());
    } // Deterministic pseudo-random float in the interval [ 0, 1 ]

    randFloat(low, high) {
        return low + Math.random() * (high - low);
    } // Random float from <-range/2, range/2> interval

}

new Central().start();

