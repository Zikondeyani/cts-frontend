<template>
  <!-- Full-page blocking overlay -->
  <div v-if="newVersionAvailable" class="modal-overlay">
    <div class="update-banner">
      <h2>New Version Available!</h2>
      <p>Current: {{ oldVersion }} | New: {{ newVersion }}</p>
      <button @click="reloadApp">Update Now</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'

let currentVersion = reactive(null)
const newVersionAvailable = ref(false)
const oldVersion = ref('')
const newVersion = ref('')

function reloadApp() {
  window.location.reload(true)
}

async function checkVersion() {
  try {
    const res = await fetch('/version.json?t=' + Date.now())
    if (!res.ok) return

    const data = await res.json()

    if (!currentVersion) {
      currentVersion =  data.version
      return
    }

    if (currentVersion !== data.version) {
      oldVersion.value = currentVersion
      newVersion.value = data.version
      currentVersion = data.version
      newVersionAvailable.value = true
    }
  } catch (err) {
    console.warn('Version check failed', err)
  }
}

onMounted(() => {
  checkVersion()
  setInterval(checkVersion, 2000)
})
</script>

<style scoped>
/* Full-page overlay to block interaction */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* semi-transparent overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Modal box */
.update-banner {
  background: #096eb4; /* blue background */
  color: #fff;
  padding: 2rem 3rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  max-width: 400px;
  width: 90%;
}

/* Heading */
.update-banner h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

/* Button */
.update-banner button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #fff;
  color: #096eb4;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.update-banner button:hover {
  background: #e0e0e0;
}
</style>