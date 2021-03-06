/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface BrowserDatabase {
        /**
          * String of comma-separated file types. All types allowed by default
         */
        "accept": string;
        "close": () => Promise<void>;
        /**
          * Name of the database
         */
        "dbName": string;
        /**
          * Name of the database store
         */
        "dbStoreName": string;
        "delete": (key: any) => Promise<any>;
        "deleteDatabase": () => Promise<boolean>;
        /**
          * If true, geolocation info for files will be saved in the file manifest
         */
        "geotag": boolean;
        "get": (key: any) => Promise<any>;
        "getManifest": () => Promise<any>;
        /**
          * Materialize icon to use for the component if visible
         */
        "icon": string;
        "keys": () => Promise<any>;
        "open": () => Promise<void>;
        "set": (key: any, val: any) => Promise<any>;
        /**
          * Sets dark or light theme
         */
        "theme": string;
        /**
          * If true, a timestamp for files will be saved in the file manifest
         */
        "timetag": boolean;
        /**
          * Determines visibility of component
         */
        "visible": boolean;
    }
    interface FileInput {
        /**
          * String of comma-separated file types. All types allowed by default
         */
        "accept": string;
        /**
          * Sets the materialize icon to use
         */
        "icon": string;
        /**
          * Determines if input is visible
         */
        "visible": boolean;
    }
}
declare global {
    interface HTMLBrowserDatabaseElement extends Components.BrowserDatabase, HTMLStencilElement {
    }
    var HTMLBrowserDatabaseElement: {
        prototype: HTMLBrowserDatabaseElement;
        new (): HTMLBrowserDatabaseElement;
    };
    interface HTMLFileInputElement extends Components.FileInput, HTMLStencilElement {
    }
    var HTMLFileInputElement: {
        prototype: HTMLFileInputElement;
        new (): HTMLFileInputElement;
    };
    interface HTMLElementTagNameMap {
        "browser-database": HTMLBrowserDatabaseElement;
        "file-input": HTMLFileInputElement;
    }
}
declare namespace LocalJSX {
    interface BrowserDatabase {
        /**
          * String of comma-separated file types. All types allowed by default
         */
        "accept"?: string;
        /**
          * Name of the database
         */
        "dbName"?: string;
        /**
          * Name of the database store
         */
        "dbStoreName"?: string;
        /**
          * If true, geolocation info for files will be saved in the file manifest
         */
        "geotag"?: boolean;
        /**
          * Materialize icon to use for the component if visible
         */
        "icon"?: string;
        "onModalClosed"?: (event: CustomEvent<BrowserDatabase>) => void;
        "onModalOpened"?: (event: CustomEvent<BrowserDatabase>) => void;
        /**
          * Sets dark or light theme
         */
        "theme"?: string;
        /**
          * If true, a timestamp for files will be saved in the file manifest
         */
        "timetag"?: boolean;
        /**
          * Determines visibility of component
         */
        "visible"?: boolean;
    }
    interface FileInput {
        /**
          * String of comma-separated file types. All types allowed by default
         */
        "accept"?: string;
        /**
          * Sets the materialize icon to use
         */
        "icon"?: string;
        "onInputChange"?: (event: CustomEvent<File>) => void;
        /**
          * Determines if input is visible
         */
        "visible"?: boolean;
    }
    interface IntrinsicElements {
        "browser-database": BrowserDatabase;
        "file-input": FileInput;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "browser-database": LocalJSX.BrowserDatabase & JSXBase.HTMLAttributes<HTMLBrowserDatabaseElement>;
            "file-input": LocalJSX.FileInput & JSXBase.HTMLAttributes<HTMLFileInputElement>;
        }
    }
}
