<!-- <script setup lang="ts">
defineProps<{
  title: string
}>()
</script> -->

<script setup lang="ts">
import type { Equipment } from '~/utils/types'

const props = defineProps<Equipment>()

const { activeStar, tableData: data } = useEquipment(props)

function selectStar(star: number) {
  if (activeStar.value === star) {
    activeStar.value = 0
    return
  }

  activeStar.value = star
}
</script>

<template>
  <div class="flex gap-4 mb-4 p-2 lg:py-6 lg:px-0 items-center">
    <div class="border border-[#1e2131] rounded-xl">
      <img class="w-24 lg:w-28 border-4 border-[#fdd95b] bg-[#fe9c47] rounded-xl p-2" src="/gear/imperial-boots.webp">
    </div>

    <div class="flex flex-col items-center">
      <span class="text-2xl">Imperial Boots</span>
      <div>
        <UiButton v-for="star in 5" :key="star" size="icon" variant="ghost" @click="selectStar(star)">
          <Icon
            name="material-symbols:star-rounded" class="text-4xl text-muted transition-colors shrink-0"
            :class="{ 'text-yellow-300': activeStar >= star, 'hover:text-muted-foreground': activeStar < star }"
          />
        </UiButton>
      </div>
    </div>
  </div>

  <UiScrollArea class="h-[460px] lg:h-[576px] w-dvw lg:w-fit">
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
          <UiTableRow class="relative">
            <UiTableCell class="font-bold whitespace-nowrap">
              {{ row.name }}
            </UiTableCell>

            <UiTableCell v-for="rowData in row.data" :key="rowData.id" class="text-muted-foreground">
              <span class="font-medium">{{ rowData.value }}</span>
            </UiTableCell>
          </UiTableRow>

          <UiTableRow
            v-if="index % 10 === 0 && index > 0"
            class="whitespace-no-wrap hover:bg-transparent text-center font-semibold"
          >
            <UiTableCell class="p-0" colspan="100%">
              <div class="flex flex-col">
                <span class="text-lg font-black bg-[#8BAFC9] text-white rounded-t-md text-stroke">Extra
                  Attributes</span>

                <div
                  v-for="extra in row.extra" :key="extra.id"
                  class="flex gap-16 items-center justify-center lg:justify-evenly bg-[#D9E4F4] p-1.5"
                >
                  <span class="text-yellow-300 text-stroke">Lv.{{ index }}</span>
                  <span class="text-[#63e884] text-stroke">{{ extra.id }}</span>
                  <span class="text-[#63e884] text-stroke">{{ extra.value }}</span>
                </div>
              </div>
            </UiTableCell>
          </UiTableRow>
        </template>
      </UiTableBody>
      <UiScrollBar orientation="horizontal" />
    </UiTable>
  </UiScrollArea>
</template>
