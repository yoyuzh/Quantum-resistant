<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: [String, Number], required: true },
  options: { type: Array, required: true },
  disabled: Boolean,
});
const emit = defineEmits(['update:modelValue']);
const id = useId();
const labelId = `${id}-label`;
const valueId = `${id}-value`;
const listId = `${id}-list`;
const trigger = ref(null);
const popup = ref(null);
const open = ref(false);
const active = ref(0);
const placement = ref({ top: '0px', left: '0px', width: '0px', maxHeight: '240px' });
const selectedIndex = computed(() => props.options.findIndex((item) => item.value === props.modelValue));
const selectedLabel = computed(() => props.options[selectedIndex.value]?.label ?? '请选择');
let search = '';
let searchTimer;

function positionPopup() {
  if (!trigger.value || !open.value) return;
  const rect = trigger.value.getBoundingClientRect();
  const gap = 6;
  const margin = 8;
  const below = window.innerHeight - rect.bottom - gap - margin;
  const above = rect.top - gap - margin;
  const showAbove = below < 180 && above > below;
  const available = Math.max(80, showAbove ? above : below);
  const height = Math.min(288, available);
  placement.value = {
    top: `${showAbove ? Math.max(margin, rect.top - gap - height) : rect.bottom + gap}px`,
    left: `${Math.max(margin, Math.min(rect.left, window.innerWidth - rect.width - margin))}px`,
    width: `${Math.min(rect.width, window.innerWidth - margin * 2)}px`,
    maxHeight: `${height}px`,
  };
}

async function show(index = selectedIndex.value) {
  if (props.disabled || !props.options.length) return;
  active.value = Math.max(0, index);
  open.value = true;
  await nextTick();
  positionPopup();
  revealActive();
}

function hide() {
  open.value = false;
  search = '';
  clearTimeout(searchTimer);
}

function choose(index) {
  const option = props.options[index];
  if (!option) return;
  emit('update:modelValue', option.value);
  hide();
  trigger.value?.focus();
}

function revealActive() {
  popup.value?.querySelector(`[data-index="${active.value}"]`)?.scrollIntoView({ block: 'nearest' });
}

function move(index) {
  active.value = Math.max(0, Math.min(props.options.length - 1, index));
  nextTick(revealActive);
}

function typeAhead(key) {
  search += key.toLocaleLowerCase();
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    search = '';
  }, 700);
  const index = props.options.findIndex((item) => item.label.toLocaleLowerCase().startsWith(search));
  if (index !== -1) {
    if (!open.value) show(index);
    else move(index);
  }
}

function onKeydown(event) {
  if (props.disabled) return;
  const key = event.key;
  if (key === 'Tab') {
    hide();
    return;
  }
  if (key === 'Escape') {
    if (open.value) {
      event.preventDefault();
      hide();
    }
    return;
  }
  if (key === 'ArrowDown' || key === 'ArrowUp') {
    event.preventDefault();
    if (!open.value) show(key === 'ArrowUp' ? props.options.length - 1 : selectedIndex.value);
    else move(active.value + (key === 'ArrowDown' ? 1 : -1));
  } else if (key === 'Home' || key === 'End') {
    event.preventDefault();
    const index = key === 'Home' ? 0 : props.options.length - 1;
    if (!open.value) show(index);
    else move(index);
  } else if (key === 'Enter' || key === ' ') {
    event.preventDefault();
    if (open.value) choose(active.value);
    else show();
  } else if (key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
    typeAhead(key);
  }
}

function onPointerDown(event) {
  if (!trigger.value?.contains(event.target) && !popup.value?.contains(event.target)) hide();
}

watch(() => props.disabled, (disabled) => {
  if (disabled) hide();
});
watch(() => props.options, () => {
  if (open.value) hide();
});
onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('resize', positionPopup);
  window.addEventListener('scroll', positionPopup, true);
});
onUnmounted(() => {
  document.removeEventListener('pointerdown', onPointerDown);
  window.removeEventListener('resize', positionPopup);
  window.removeEventListener('scroll', positionPopup, true);
  clearTimeout(searchTimer);
});
</script>

<template>
  <div class="select-field">
    <span :id="labelId" class="select-label">{{ label }}</span>
    <div
      ref="trigger"
      class="select-trigger"
      :class="{ open, disabled }"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      aria-haspopup="listbox"
      :aria-labelledby="`${labelId} ${valueId}`"
      :aria-controls="listId"
      :aria-expanded="open"
      :aria-disabled="disabled"
      :aria-activedescendant="open ? `${id}-option-${active}` : undefined"
      @click="open ? hide() : show()"
      @keydown="onKeydown"
    >
      <span :id="valueId" class="select-value">{{ selectedLabel }}</span>
      <span class="chevron" aria-hidden="true"></span>
    </div>
    <Teleport to="body">
      <div
        v-if="open"
        :id="listId"
        ref="popup"
        class="select-popup"
        role="listbox"
        :aria-labelledby="labelId"
        :style="placement"
      >
        <div
          v-for="(option, index) in options"
          :id="`${id}-option-${index}`"
          :key="option.value"
          class="select-option"
          :class="{ active: active === index, selected: modelValue === option.value }"
          :data-index="index"
          role="option"
          :aria-selected="modelValue === option.value"
          @pointerdown.prevent
          @click="choose(index)"
          @mousemove="active = index"
        >{{ option.label }}</div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.select-field {
  display: grid;
  gap: 0.4rem;
  min-width: 0;
}
.select-label {
  color: var(--text-secondary);
  font-size: 0.8rem;
}
.select-trigger {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-height: 44px;
  padding: 0.65rem 0.75rem;
  border-radius: var(--radius);
  background: var(--bg-input);
  color: var(--text-primary);
  cursor: pointer;
}
.select-trigger:hover,
.select-trigger.open {
  background: var(--bg-elevated);
}
.select-trigger.disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.select-trigger:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.select-value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.85rem;
}
.chevron {
  width: 0.5rem;
  height: 0.5rem;
  border: solid currentColor;
  border-width: 0 1.5px 1.5px 0;
  transform: translateY(-2px) rotate(45deg);
  flex-shrink: 0;
}
.select-trigger.open .chevron {
  transform: translateY(2px) rotate(225deg);
}
.select-popup {
  position: fixed;
  z-index: 100;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0.3rem;
  border-radius: var(--radius);
  background: var(--bg-surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-lg);
}
.select-option {
  padding: 0.6rem 0.7rem;
  border-radius: 6px;
  font-size: 0.84rem;
  line-height: 1.4;
  overflow-wrap: anywhere;
  cursor: pointer;
}
.select-option:hover,
.select-option.active {
  background: var(--accent-soft);
  color: var(--accent-dim);
}
.select-option.selected {
  font-weight: 600;
}
</style>
