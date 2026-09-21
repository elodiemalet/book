<template>
    <div class="absolute inset-0 h-full w-full flex justify-center overflow-hidden">
        <div
            class="glass-effect"
            :style="{ backgroundImage: `url(${imageUrl})` }"
        />
    </div>
</template>

<script lang="ts">
export default defineComponent({
    name: "GlassImage",
    props: {
        imageUrl: {
            type: String,
            default: 'images/background-img.png',
        },
        imageAlt: {
            type: String,
            default: 'background-img',
        },
    },
});

</script>

<style scoped>
.glass-effect {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    filter: blur(1.5rem);
    z-index: 1; /* Make sure the glass effect stays above background but below the image */
    border-radius: 10px; /* Optional rounded corners */
    display: flex;
    justify-content: center;
    align-items: center;
    background-position: center center;
    background-size: cover;
    background-color: black;
    width: 110%;
    height: 110%;
    margin-left: -5%;
    margin-top: -2%;
}
</style>
