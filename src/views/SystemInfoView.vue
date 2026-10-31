
<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface SystemInfoResponse {
  status: 'success'
  data: {
    module: string
    version: string
  }
}

const systemInfo = ref<SystemInfo | null>(null)
const loading = ref(false)
const error = ref('')

async function loadSystemInfo() {
  loading.value = true
  error.value = ''
  systemInfo.value = null

  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
      ?.replace(/\/+$/, '')

    if (!baseUrl) {
      throw new Error('VITE_API_BASE_URL is not configured.')
    }

    const response = await fetch(
      `${baseUrl}/api/v1/modules/system-info/version`,
    )

    if (!response.ok) {
      throw new Error(
        `Failed to load system information (${response.status}).`,
      )
    }

    const result = await response.json() as SystemInfoResponse

    if (result.status !== 'success') {
    throw new Error('The API returned an unsuccessful response.')
    }

    systemInfo.value = result.data
    
  } catch (err) {
    error.value = err instanceof Error
      ? err.message
      : 'An unexpected error occurred.'
  } finally {
    loading.value = false
  }
}

onMounted(loadSystemInfo)
</script>

<template>
  <section class="system-info">
    <h1>System Information</h1>

    <p v-if="loading" role="status">
      Loading system information...
    </p>

    <div v-else-if="error" class="system-info__error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="loadSystemInfo">
        Retry
      </button>
    </div>

    <dl v-else-if="systemInfo" class="system-info__details">
      <dt>Module</dt>
      <dd>{{ systemInfo.module }}</dd>

      <dt>Version</dt>
      <dd>{{ systemInfo.version }}</dd>
    </dl>
  </section>
</template>

<style scoped>
.system-info {
  padding: 1.5rem;
}

.system-info__details {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.75rem 1.5rem;
}

.system-info__details dt {
  font-weight: 600;
}

.system-info__details dd {
  margin: 0;
}

.system-info__error {
  color: #b42318;
}

.system-info__error button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
