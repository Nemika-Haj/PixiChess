import type { Application } from "pixi.js";
import { DeathContainer } from "../models/DeathContainer";

export class ContainerHandler {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public setupDeathContainer() {
        const deathContainer = new DeathContainer(this.app);

        this.app.stage.addChild(deathContainer);
    }
}