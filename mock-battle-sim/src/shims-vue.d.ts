declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare interface ImportMeta {
  readonly env: Record<string, string>;
}
