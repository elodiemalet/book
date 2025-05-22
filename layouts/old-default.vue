<template>
    <FragmentContainer>
        <header class="no-print">
            <BaseMenu/>
        </header>
        <div
            class="main"
            :class="{ 'dark': isDarkMode }
            ">
            <slot/>
        </div>
        <UNotifications/>
    </FragmentContainer>
</template>

<script lang="ts">
import BaseMenu from "~/components/BaseMenu.vue";
import FragmentContainer from "~/components/layout/FragmentContainer.vue";

export default {
    components: {
        FragmentContainer,
        BaseMenu
    },
    data() {
        return {
            isDarkMode: false
        };
    },
};

</script>

<style lang="scss">

</style>
