<template>
    <div class=" flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table class="min-w-full divide-y divide-gray-300">
                    <thead>
                        <tr>
                            <th
                                v-for="column in columns"
                                :key="column.key"
                                scope="col"
                                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                            >
                                {{ column.name }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr
                            v-for="(row, index) in rows"
                            :key="index">
                            <td
                                v-for="column in columns"
                                :key="column.key"
                                :class="[
                                    column.bold ? 'font-medium text-gray-900' : 'font-normal',
                                    'whitespace-nowrap px-3 py-4 text-sm ',
                                    column.type === 'actions' ? 'w-[1%]' : ''
                                ]">
                                <slot
                                    :name="`column-${column.key}`"
                                    :row="row"
                                    :index="index"
                                >
                                    <template v-if="column.type === 'input'">
                                        <input
                                            v-if="row.isEditing"
                                            v-model="row[column.key]"
                                            type="text"
                                            class="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                        <template v-else>
                                            {{ row[column.key] }}
                                        </template>
                                    </template>
                                    <template v-else-if="column.type === 'date'">
                                        {{ row[column.key].toLocaleDateString('fr') }}
                                    </template>
                                    <template v-else-if="column.type === 'status'">
                                        <template v-if="row[column.key]">
                                            <span
                                                class="rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-100 text-green-800">Activé</span>
                                        </template>
                                        <template v-else>
                                            <span
                                                class="rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-red-100 text-red-800">Désactivé</span>
                                        </template>
                                    </template>
                                    <template v-else-if="column.type === 'actions'">
                                        <template
                                            v-for="(action, aindex) in row.actions"
                                            :key="aindex">
                                            <template v-if="action.type === 'emit'">
                                                <BaseButton
                                                    class="inline-block ml-2"
                                                    size="sm"
                                                    @click="$emit('action', {action: action.action, row } )"
                                                >
                                                    {{ action.title }}
                                                </BaseButton>
                                            </template>
                                            <template v-if="action.type === 'link'">
                                                <RouterLink
                                                    :to="action.action"
                                                    class="inline-block ml-2"
                                                >
                                                    <BaseButton
                                                        class="inline-block"
                                                        size="sm"
                                                    >
                                                        {{ action.title }}
                                                    </BaseButton>
                                                </RouterLink>
                                            </template>
                                        </template>
                                    </template>
                                    <template v-else>
                                        {{ row[column.key] }}
                                    </template>
                                </slot>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div
                    v-if="rows.length === 0"
                    class="flex justify-center items-center h-full"
                >
                    <div class="text-gray-400">Aucun résultat</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import BaseButton from "~/components/ui/buttons/BaseButton.vue";

interface Row {
    [key: string]: string;
}

interface Column {
    name: string;
    key: string;
    bold?: boolean;
    type?: string;
}

export default defineComponent({
    components: {BaseButton},
    props: {
        columns: {
            type: Array as PropType<Column[]>,
            default: () => [],
        },
        rows: {
            type: Array as PropType<Row[]>,
            default: () => [],
        },
    },
    emits: ['action'],
});

</script>
