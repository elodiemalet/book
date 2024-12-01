<template>
    <header class="no-print">
        <base-menu/>
    </header>
    <NuxtPage/>
    <UNotifications/>
</template>
<script lang="ts">
import BaseMenu from "~/components/BaseMenu.vue";

export default {
    components: {
        BaseMenu
    }
}

</script>

<style lang="scss">

@tailwind base;
@tailwind components;
@tailwind utilities;

.page {
    margin: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    position: relative;

    footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
    }
}

.page:not(:last-of-type) {
    page-break-after: always;
}

@media print {
    .page {
        margin: 0;
        border: none;
        width: 210mm;
        height: 297mm;
    }

    .no-print, .no-print * {
        display: none !important;
    }
}
</style>