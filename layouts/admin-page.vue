<template>
    <main>
        <template v-if="$slots.title">
            <AdminPageHeading class="px-4 sm:px-6 lg:px-8">
            <AdminPageHeading
                :edit-url="editUrl"
                class="px-4 sm:px-6 lg:px-8">
                <slot name="title"/>
            </AdminPageHeading>
        </template>
        <div class="px-4 sm:px-6 lg:px-8">
            <slot/>
        </div>
    </main>
</template>
<script setup lang="ts">
import AdminPageHeading from "~/components/admin/ui/AdminPageHeading.vue";

const editUrl: string = useState<string>("editUrl")?.value ?? '';


</script>