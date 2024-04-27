<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf'

const { pdf, pages } = usePDF('pdfs/TypeScript Classes.pdf')
</script>

<template>
  <div v-for="page in pages" :key="page">
    <VuePDF :pdf="pdf" :page="page" />
  </div>
</template>