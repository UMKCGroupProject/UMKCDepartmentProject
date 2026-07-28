<script setup lang="ts" generic="T extends { id: number }">
import type { SortOrder } from '@/types';

export interface Column<Row> {
  key: string;
  label: string;
  /** Only sortable columns render a header button. */
  sortable?: boolean;
  value: (row: Row) => string | number;
}

const props = defineProps<{
  columns: Column<T>[];
  rows: T[];
  sortBy?: string;
  order?: SortOrder;
  loading?: boolean;
  emptyMessage?: string;
}>();

const emit = defineEmits<{ sort: [key: string] }>();

/** aria-sort must be 'none' on every column except the active one. */
function ariaSort(key: string): 'ascending' | 'descending' | 'none' {
  if (props.sortBy !== key) return 'none';
  return props.order === 'ASC' ? 'ascending' : 'descending';
}
</script>

<template>
  <div class="table-responsive">
    <table class="table table-bordered app-table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            :aria-sort="column.sortable ? ariaSort(column.key) : undefined"
          >
            <button
              v-if="column.sortable"
              type="button"
              class="app-sort-button"
              @click="emit('sort', column.key)"
            >
              {{ column.label }}
              <span aria-hidden="true">
                {{ sortBy === column.key ? (order === 'ASC' ? '▲' : '▼') : '' }}
              </span>
            </button>
            <template v-else>{{ column.label }}</template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length">Loading…</td>
        </tr>
        <tr v-else-if="rows.length === 0">
          <td :colspan="columns.length">
            {{ emptyMessage ?? 'Nothing to show yet.' }}
          </td>
        </tr>
        <!-- Keyed by row id, which is unique per row. Using a value that can
             repeat (a course id, say) would make Vue reuse the wrong DOM. -->
        <tr v-for="row in rows" v-else :key="row.id">
          <td v-for="column in columns" :key="column.key">
            {{ column.value(row) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
