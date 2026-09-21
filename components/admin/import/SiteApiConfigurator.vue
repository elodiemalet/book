<template>
    <div>
        <h3 class="text-base/7 font-semibold text-gray-900 flex justify-between gap-x-4">
            <span>Liste des tokens</span>
            <base-button
                v-if="tokens.length < 5"
                type="button"
                size="sm"
                @click="addToken"
            >
                Ajouter un token
            </base-button>
        </h3>
        <base-card class="mt-4">
            <base-table
                :columns="[
                    { name: 'Nom', key: 'name', type: 'input' },
                    { name: 'Token', key: 'token' },
                    { name: 'Date de création', key: 'createdAt', type: 'date' },
                    { name: 'Statut', key: 'revoked', type: 'status' },
                    { name: 'Actions', key: 'actions', type: 'actions' },
                ]"
                :rows="rows"
                :limit="10"
            >
                <template #column-revoked="{row}">
                    <base-badge
                        v-if="row.revoked"
                        size="sm"
                        severity="danger"
                    >
                        Révoqué
                    </base-badge>
                    <base-badge
                        v-else
                        size="sm"
                        severity="success"
                    >
                        Actif
                    </base-badge>
                </template>
                <template #column-actions="{row, index}">
                    <BaseButton
                        v-if="!row.isEditing"
                        label="Révoquer"
                        class="inline-block ml-2"
                        size="sm"
                        @click="revokeToken(row, index)"
                    />
                    <BaseButton
                        v-if="row.isEditing"
                        label="Annuler"
                        class="inline-block ml-2"
                        size="sm"
                        severity="danger"
                        @click="cancelEditToken(index)"
                    />
                    <BaseButton
                        v-if="row.isEditing"
                        label="Enregistrer"
                        class="inline-block ml-2"
                        size="sm"
                        severity="success"
                        @click="saveToken(row, index)"
                    />
                    <BaseButton
                        v-else
                        label="Modifier"
                        class="inline-block ml-2"
                        size="sm"
                        @click="editToken(index)"
                    />

                </template>
            </base-table>
        </base-card>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {ApiTokenEntityInterface} from "~/entities/ApiTokenEntity";
import BaseTable from "~/components/ui/BaseTable.vue";
import BaseCard from "~/components/ui/BaseCard.vue";
import BaseButton from "~/components/ui/buttons/BaseButton.vue";
import BaseBadge from "~/components/ui/buttons/BaseBadge.vue";

export default defineComponent({
    name: "SiteApiConfigurator",
    components: {BaseBadge, BaseButton, BaseCard, BaseTable},
    data() {
        return {
            toast: useToast(),
            tokens: [] as ApiTokenEntityInterface[],
            editingTokenIds: [] as number[],
        };
    },
    computed: {
        rows() {
            return this.tokens
                .filter(token => !token.revoked)
                .map((token: ApiTokenEntityInterface, index: number) => {
                    return {
                        ...token,
                        createdAt: new Date(token.createdAt),
                        isEditing: this.editingTokenIds.includes(index),
                    };
                });
        },
    },
    async mounted() {
        await this.getTokens();
        console.log('mounted');
    },
    methods: {
        async getTokens() {
            const {data, error} = await useFetch('/api/config/api-token', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (error.value) {
                this.toast.add({
                    id: 'error',
                    color: 'red',
                    title: 'Erreur lors de la récupération des tokens',
                });
                return;
            }
            this.tokens = data.value as ApiTokenEntityInterface[] || [];
            console.log('getTokens', data.value);
        },
        async revokeToken(token: ApiTokenEntityInterface) {
            const {data, error} = await useFetch('/api/config/api-token', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: token.id,
                }),
            });

            if (error.value || !data.value) {
                this.toast.add({
                    id: 'error',
                    color: 'red',
                    title: 'Erreur lors de la suppression du token',
                });
                return;
            }
            const tokenUpdated = data.value as ApiTokenEntityInterface;
            this.tokens = this.tokens.filter(token => token.id !== tokenUpdated.id);
        },
        async saveToken(token: ApiTokenEntityInterface, index: number) {
            const method = token.id === '' ? 'POST' : 'PUT';
            const {data, error} = await useFetch('/api/config/api-token', {
                method: method,
                body: JSON.stringify(token),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (error.value) {
                this.toast.add({
                    id: 'error',
                    color: 'red',
                    title: 'Erreur lors de la modification du token',
                });
                return;
            }
            const tokenUpdated = data.value as ApiTokenEntityInterface;
            const findIndex = this.tokens.findIndex(token => token.id === tokenUpdated.id || token.id === '');

            this.tokens[findIndex] = tokenUpdated;
            this.editingTokenIds = this.editingTokenIds.filter(id => id !== index);

            this.toast.add({
                id: 'success',
                icon: 'i-material-symbols-file-download',
                title: 'Le token a été modifié avec succès',
            });
        },
        editToken(index: number) {
            this.editingTokenIds.push(index);
        },
        addToken() {
            this.tokens.unshift({
                id: '',
                name: '',
                token: '',
                createdAt: new Date(),
                revoked: false,
                revokedAt: null,
            } as ApiTokenEntityInterface);
            this.editingTokenIds.unshift(0);
        },
        cancelEditToken(index: number) {
            this.editingTokenIds = this.editingTokenIds.filter(id => id !== index);
            this.tokens = this.tokens.filter(token => token.id !== '');

        },
    },
});

</script>