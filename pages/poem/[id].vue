<script>
export default {
    data() {
        return {
            id: null,
            book: null
        }
    },
    async mounted() {

        this.id = this.$route.params.id
        this.book = await queryContent('/book/test').where({id: '1'}).findOne()
    }
}
</script>

<template>

    poem {{ id }}
    {{ book }}

</template>

<style scoped>

</style>