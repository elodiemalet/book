<template>
    <button class="no-print" @click="downloadBook">Download PDF</button>

    <div class="print">
        <div v-for="poem in book.poems"
             :key="poem"
             class="page poem"
        >
            <NuxtLink :to="{name: 'poem-id', params: {id: poem.id}}">
                <h2>{{ poem.title }}</h2>
            </NuxtLink>
            <p>{{ poem.content }}</p>
        </div>
    </div>
</template>
<script>

import {useBookStore} from "~/stores/bookStore.ts";

export default {
    data() {
        return {
            search: ''
        }
    },
    setup() {
        const bookStore = useBookStore()

        bookStore.$subscribe((state) => {
            localStorage.setItem('bookStore', JSON.stringify(state.events.newValue))
        }, {flush: 'sync'})

        return {
            bookStore,
            book: computed(() => bookStore.book)
        }
    },
    async mounted() {
        await this.bookStore.fetchBooks()
    },
    methods: {
        async downloadBook() {
            try {
                const {data, error} = await useFetch('/api/generate-pdf', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        endpoint: 'book',
                        token: 'mon-token-perso',
                    },
                    responseType: 'blob',
                });

                if (error.value) {
                    throw new Error(error.value);
                }

                const blob = data.value;

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Book.pdf');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

            } catch (error) {
                console.error('Erreur lors de la génération du PDF:', error);
            }

        }
    }
}
</script>