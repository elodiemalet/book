<template>
    <FragmentContainer>
        <AdminSidebar>
            <slot/>
        </AdminSidebar>
        <UNotifications/>
    </FragmentContainer>
</template>
<script setup lang="ts">
import AdminSidebar from "~/components/admin/ui/AdminSidebar.vue";
import FragmentContainer from "~/components/layout/FragmentContainer.vue";
</script>
