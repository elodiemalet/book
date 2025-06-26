<template>
    <main>
        <template v-if="$slots.title">
            <AdminPageHeading
                :edit-url="editUrl"
                :add-url="addUrl"
                class="px-4 sm:px-6 lg:px-8"
                :class="[$slots.actions ? '' : 'mb-12']"
            >
                <slot name="title"/>

            </AdminPageHeading>
        </template>
        <template v-if="$slots.actions">
            <div class="mb-12">
                <slot name="actions"/>
            </div>
        </template>
        <div class="px-4 sm:px-6 lg:px-8">
            <slot/>
        </div>
    </main>
</template>
<script setup lang="ts">
import AdminPageHeading from "~/components/admin/ui/AdminPageHeading.vue";
import AdminNavTabs from "~/components/admin/ui/AdminNavTabs.vue";

const addUrl: string = useState<string>("addUrl")?.value ?? '';
const editUrl: string = useState<string>("editUrl")?.value ?? '';

</script>
