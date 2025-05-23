<template>
    <table class="wrapper" role="presentation" width="100%">
        <tbody>
            <!-- Header -->
            <tr>
                <td class="header">
                    <img
                        v-if="dataUrl.length > 0"
                        class="logo"
                        :src="dataUrl" alt="Logo de MonEntreprise"
                    >
                </td>
            </tr>

            <!-- Contenu principal -->
            <tr>
                <td>
                    <div class="content">
                        <h1>Bonjour,</h1>
                        <p>Merci d’avoir pris le temps de découvrir cet extrait de notre ouvrage.</p>
                        <p>Nous espérons qu’il vous a plu et qu’il vous donnera envie d’en savoir plus.</p>
                        <p>Si vous avez des questions, n’hésitez pas à répondre à cet email.</p>
                    </div>
                </td>
            </tr>

            <!-- Pied de page -->
            <tr>
                <td class="footer">
                    <p style="font-size:12px; color:#777777;">© 2025 MonEntreprise – Tous droits réservés</p>
                    <p style="font-size:12px; color:#777777;">
                        <a href="http://localhost:3000/unsubscribe" style="color:#007bff;">Se désabonner</a>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script lang="ts">
export default {
    props: {
        dataUrl: {
            type: String,
            default: '',
        },
    },
};
</script>
