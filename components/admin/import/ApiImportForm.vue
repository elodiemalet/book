<template>
    <div class="flex flex-col gap-4">
        <site-api-configurator
            class=""
        />
        <h3 class="text-base/7 font-semibold text-gray-900 mt-8">Liste des connecteurs API</h3>
        <p class=" text-sm/6 text-gray-600">Configurez les connecteurs API pour importer des contenus</p>
        <api-connectors-configurator
            class=""
        />
    </div>
</template>
<script lang="ts">

import ApiConnectorsConfigurator from "~/components/admin/import/ApiConnectorsConfigurator.vue";
import SiteApiConfigurator from "~/components/admin/import/SiteApiConfigurator.vue";

export default defineComponent({
    name: "ApiImportForm",
    components: {SiteApiConfigurator, ApiConnectorsConfigurator},
});

</script>
