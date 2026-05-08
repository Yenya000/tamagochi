<template>
  <TresGroup>
    <!-- Ствол -->
    <TresMesh :position="[0, -1, 0]">
      <TresCylinderGeometry :args="[0.5, 0.7, 1.2]" />
      <TresMeshStandardMaterial color="#8B5A2B" />
    </TresMesh>
    <!-- Крона (зависит от стадии) -->
    <TresMesh :position="[0, stageYOffset, 0]">
      <TresSphereGeometry :args="[stageRadius, 24, 24]" />
      <TresMeshStandardMaterial :color="leafColor" />
    </TresMesh>
    <!-- Эффект увядания: при wilted — полупрозрачный серый налет -->
    <TresMesh v-if="wilted" :position="[0, stageYOffset, 0]">
      <TresSphereGeometry :args="[stageRadius + 0.05, 24, 24]" />
      <TresMeshStandardMaterial color="#666666" transparent opacity="0.4" />
    </TresMesh>
  </TresGroup>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stage: Number,     // 1..4
  wilted: Boolean
})

const stageRadius = computed(() => {
  switch(props.stage) {
    case 1: return 0.3    // семечко (маленький шарик)
    case 2: return 0.6
    case 3: return 0.9
    default: return 1.2
  }
})

const stageYOffset = computed(() => {
  switch(props.stage) {
    case 1: return 0.2
    case 2: return 0.8
    case 3: return 1.4
    default: return 2.0
  }
})

const leafColor = computed(() => {
  if(props.wilted) return '#9CAF88'
  switch(props.stage) {
    case 1: return '#D2B48C'
    case 2: return '#6B8E23'
    case 3: return '#3A7D34'
    default: return '#2E7D32'
  }
})
</script>