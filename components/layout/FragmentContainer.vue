<template>
    <div class="fragment">
        <slot/>
    </div>
</template>

<script lang="ts">

export default defineComponent({
    name: "FragmentContainer",
});
</script>

<style scoped>
.fragment {
    display: contents;
}
</style>
