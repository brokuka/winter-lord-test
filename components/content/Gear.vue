<script setup lang="ts">
import type { Equipment } from '~/utils/types'

const props = defineProps<Equipment>()

const { activeStar, tableData: data, isPromoted } = useEquipment(props)

function selectStar(star: number) {
  if (activeStar.value === star) {
    if (isPromoted.value) {
      activeStar.value = 0
    }

    isPromoted.value = !isPromoted.value

    return
  }

  activeStar.value = star
}

function showExtra(index: number, extra?: TableRowExtra[]) {
  return isPromoted.value ? extra?.length : index % 10 === 0 && index > 0
}

function rowClasses(index: number, data: TableRow[]) {
  return {
    'opacity-20': isPromoted.value && (activeStar.value !== index + 1 && activeStar.value !== data.length),
  }
}
</script>

<template>
  <div class="flex gap-4 mb-4 p-2 lg:py-6 lg:px-0 items-center">
    <div class="border border-[#1e2131] rounded-xl">
      <img class="w-24 lg:w-28 border-4 border-[#fdd95b] bg-[#fe9c47] rounded-xl p-2" src="/gear/imperial-boots.webp">
    </div>

    <div class="flex flex-col items-center">
      <span class="text-2xl">{{ name }}</span>
      <div>
        <UiButton v-for="star in 5" :key="star" size="icon" variant="ghost" @click="selectStar(star)">
          <Icon
            name="material-symbols:star-rounded" class="text-4xl text-muted transition-colors shrink-0" :class="{
              'hover:text-muted-foreground': activeStar < star,
              'text-yellow-300': !isPromoted && activeStar >= star,
              'text-red-600': isPromoted && activeStar >= star,
            }"
          />
        </UiButton>
      </div>
    </div>
  </div>

  <!-- <UiScrollArea class="h-[460px] lg:h-[576px] w-dvw lg:w-fit"> -->
  <UiTable>
    <UiTableHeader class="relative z-[2]">
      <UiTableRow class="sticky top-0 left-0 z-[2]">
        <UiTableHead
          v-for="head in data.head" :key="head"
          class="first:bg-accent first:text-black whitespace-nowrap font-black bg-accent text-black"
        >
          {{ head }}
        </UiTableHead>
      </UiTableRow>
    </UiTableHeader>

    <UiTableBody class="z-[1]">
      <template v-for="(row, index) in data.rows" :key="row.name">
        <UiTableRow class="relative border-b has-[+[data-extra]]:border-none" :class="[rowClasses(index, data.rows)]">
          <UiTableCell class="font-bold whitespace-nowrap">
            {{ row.name }}
          </UiTableCell>

          <UiTableCell v-for="rowData in row.data" :key="rowData.id" class="text-muted-foreground">
            <span class="font-medium">{{ rowData.value }}</span>
          </UiTableCell>
        </UiTableRow>

        <UiTableRow
          v-if="showExtra(index, row.extra)"
          class="whitespace-no-wrap hover:bg-transparent text-center font-semibold border-none" data-extra
          :class="[rowClasses(index, data.rows)]"
        >
          <UiTableCell class="p-0" colspan="100%">
            <div class="flex flex-col">
              <div class="text-lg font-black bg-[#8BAFC9] text-white rounded-t-md text-stroke">
                Extra
                Attributes
              </div>

              <div
                v-for="extra in row.extra" :key="extra.id"
                class="flex items-center gap-16 justify-center lg:justify-between bg-[#D9E4F4] py-1.5 px-36 relative"
              >
                <Icon
                  v-if="isPromoted" name="material-symbols:star-rounded"
                  class="text-xl text-muted transition-colors shrink-0 text-red-600"
                />

                <span v-else class="text-yellow-300 text-stroke">
                  Lv.{{ index }}
                </span>

                <span class="text-[#63e884] text-stroke">{{ extra.id }}</span>
                <span class="text-[#63e884] text-stroke">{{ extra.value }}</span>
              </div>
            </div>
          </UiTableCell>
        </UiTableRow>
      </template>
    </UiTableBody>
    <!-- <UiScrollBar orientation="horizontal" /> -->
  </UiTable>
  <!-- </UiScrollArea> -->
</template>
