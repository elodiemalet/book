<template>
    <dl class="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
        <div
            v-for="stat in stats"
            :key="stat.id"
            class="flex flex-col bg-gray-400/5 p-8">
            <dt class="text-sm/6 font-semibold text-gray-600">{{ stat.name }}</dt>
            <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">{{
                stat.value
            }}
            </dd>
        </div>
    </dl>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "AdminStats",
    setup() {
        const {data} = useFetch('/api/stats');
        const stats = data.value;
        return {
            stats,
        };
    }
});
</script>