import { computed, defineComponent } from "vue";
import { mapGetters, useStore } from "vuex";
import { appConfig } from "../../app-config";

function transformConfigValue(value: string, T: "number"): number;
function transformConfigValue(value: string, T: "string"): string;
function transformConfigValue(value: string, T: "boolean"): boolean;
function transformConfigValue(value: string, T: "array"): string[];
function transformConfigValue(value: string, T: "json"): Record<string, any>;
function transformConfigValue(value: string, t: unknown): any {
  switch (t) {
    case "boolean":
      return value?.toLowerCase() === "true";
    case "number":
      return Number(value);
    case "array":
      return value.split(",");
    case "json":
      return JSON.parse(value);
    case "string":
    default:
      return value;
  }
}

export const configMixin = defineComponent({
  data() {
    return { appConfig };
  },
  computed: {
    ...mapGetters(["getUser"]),
    globalConfig(): { option: string; value: string }[] {
      return this.getUser?.config ?? [];
    },
    endpoints() {
      const edgeNodeBackend = this.globalConfig.find(
        (c) => c.option === "edge_node_backend_endpoint",
      )?.value;
      const dRAG = this.globalConfig.find(
        (c) => c.option === "drag_endpoint",
      )?.value;

      return {
        edgeNodeBackend: edgeNodeBackend
          ? transformConfigValue(edgeNodeBackend, "string")
          : null,
        dRAG: dRAG ? transformConfigValue(dRAG, "string") : null,
      };
    },
  },
  methods: {
    getGlobalConfigOption(key: string): string | null {
      const val = this.globalConfig.find((c) => c.option === key)?.value;
      return val ? transformConfigValue(val, "string") : null;
    },
    getGlobalConfigOption_Number(key: string): number | null {
      const val = this.globalConfig.find((c) => c.option === key)?.value;
      return val ? transformConfigValue(val, "number") : null;
    },
    getGlobalConfigOption_Bool(key: string): boolean {
      const val = this.globalConfig.find((c) => c.option === key)?.value;
      return val ? transformConfigValue(val, "boolean") : false;
    },
    getGlobalConfigOption_Array(key: string): string[] | null {
      console.log(this);
      console.log(this.globalConfig);
      const val = this.globalConfig.find((c) => c.option === key)?.value;
      return val ? transformConfigValue(val, "array") : [];
    },
    getGlobalConfigOption_JSON(key: string): Record<string, any> | null {
      const val = this.globalConfig.find((c) => c.option === key)?.value;
      return val ? transformConfigValue(val, "json") : null;
    },
  },
});

export function useConfig() {
  const store = useStore();

  const configArray = computed<{ option: string; value: string }[]>(
    () => store.getters.getUser?.config ?? [],
  );

  const getConfigValue = (key: string) =>
    computed(() => {
      const option = configArray.value.find((c) => c.option === key);
      if (option?.value === undefined || option?.value === null) return null;
      return option.value;
    });

  const config = {
    getString: (key: string) =>
      computed(() => {
        const val = getConfigValue(key).value;
        if (val === null) return null;
        return transformConfigValue(val, "string");
      }),
    getNumber: (key: string) =>
      computed(() => {
        const val = getConfigValue(key).value;
        if (val === null) return null;
        return transformConfigValue(val, "number");
      }),
    getBool: (key: string) =>
      computed(() => {
        const val = getConfigValue(key).value;
        if (val === null) return false;
        return transformConfigValue(val, "boolean");
      }),
    getArray: (key: string) =>
      computed(() => {
        const val = getConfigValue(key).value;
        if (val === null) return [];
        return transformConfigValue(val, "array");
      }),
    getJSON: (key: string) =>
      computed(() => {
        const val = getConfigValue(key).value;
        if (val === null) return null;
        return transformConfigValue(val, "json");
      }),
  };

  return {
    config,
    endpoints: {
      edgeNodeBackend: config.getString("edge_node_backend_endpoint"),
      dRAG: config.getString("drag_endpoint"),
    },
    appConfig,
  };
}
