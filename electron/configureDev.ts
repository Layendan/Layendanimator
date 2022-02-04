import path from "path";
import serve from "electron-serve";
import { exec } from "child_process";

export interface DeveloperOptions {
    isInProduction: boolean;
    serveSvelteDev: boolean;
    buildSvelteDev: boolean;
    watchSvelteBuild: boolean;
}

class ConfigureDev {
    isInProduction: boolean;
    serveSvelteDev: boolean;
    buildSvelteDev: boolean;
    watchSvelteBuild: boolean;
    loadURL: any;

    constructor(settings: DeveloperOptions) {
        this.isInProduction = settings.isInProduction
        this.serveSvelteDev = settings.serveSvelteDev
        this.buildSvelteDev = settings.buildSvelteDev
        this.watchSvelteBuild = settings.watchSvelteBuild
        this.loadURL = null;

        this._check_isInProduction();

        if (!this.isInProduction && this.serveSvelteDev) this._dev_Svelte();
        if (!this.isInProduction && this.buildSvelteDev) this._build_Dist();
        if (!this.isInProduction && this.watchSvelteBuild) this._watch_Dist();
        if (this.isInProduction || !this.serveSvelteDev) this._serve_Dist();
    }

    _check_isInProduction() {
        if (! this.isInProduction){
            this.isInProduction = process.env.NODE_ENV === "production" || !/[\\/]electron/.exec(process.execPath); // !process.execPath.match(/[\\/]electron/);
        };
    }
    _dev_Svelte() { 
        exec("npm run svelte:dev");
        require("electron-reload")(path.join(__dirname, "..", "svelte"));
    }
    _build_Dist() { exec("npm run svelte:build"); }
    _watch_Dist() { require("electron-reload")(path.join(__dirname, "www")); }
    _serve_Dist() { 
        this.loadURL = serve({ directory: "dist/www" });
    }

    isLocalHost() { return this.serveSvelteDev; }
    isElectronServe() { return !this.serveSvelteDev; }

}

export default ConfigureDev;