<template>
    <admin-sidebar>
        <slot/>
    </admin-sidebar>

    <UNotifications/>
</template>
<script setup lang="ts">
import AdminSidebar from "~/components/admin/ui/AdminSidebar.vue";
</script>