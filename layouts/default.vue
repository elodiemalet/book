<template>
    <header class="no-print">
        <base-menu/>
    </header>
    <div class="main mx-auto"
         :class="{ 'dark': isDarkMode }
">
        <slot/>
    </div>
    <UNotifications/>
</template>

<script lang="ts">
import BaseMenu from "~/components/BaseMenu.vue";

export default {
    components: {
        BaseMenu
    },
    data() {
        return {
            isDarkMode: false
        }
    },
}

</script>

<style lang="scss">

</style>