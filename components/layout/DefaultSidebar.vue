<script setup lang="ts">
import {
  ChevronRight,
  GalleryVerticalEnd,
} from 'lucide-vue-next'

import slug from 'slug'

const data = {
  nav: [
    {
      id: 1,
      label: 'Gear',
      items: [
        {
          title: 'Sword',
          active: false,
          url: '',
          icon: 'game-icons:broadsword',
          items: [
            {
              title: 'Imperial Sword',
              url: '',
            },
          ],
        },
        {
          title: 'Armor',
          active: false,
          url: '',
          icon: 'game-icons:shoulder-armor',
          items: [
            {
              title: 'Imperial Armor',
              url: '',
            },
          ],
        },
        {
          title: 'Gauntlets',
          active: false,
          url: '',
          icon: 'game-icons:gauntlet',
          items: [
            {
              title: 'Imperial Gauntlets',
              url: '',
            },
          ],
        },
        {
          title: 'Boots',
          active: false,
          url: '',
          icon: 'game-icons:boots',
          items: [
            {
              title: 'Imperial Boots',
              url: '',
            },
          ],
        },
      ],
    },
  ],
}

function subItemLink(label: string, parentTitle: string, title: string) {
  return `/${slug(label)}/${slug(parentTitle)}/${slug(title)}`
}

const documentation = {
  version: '0.0.1',
  tag: 'BETA',
}
</script>

<template>
  <UiSidebarProvider>
    <UiSidebar collapsible="icon">
      <UiSidebarHeader>
        <!-- <NuxtLink class="inline-flex gap-2 hover:bg-sidebar-accent" to="/"> -->
        <UiSidebarMenuButton size="lg">
          <div
            class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
          >
            <GalleryVerticalEnd class="size-4" />
          </div>

          <div class="flex flex-col items-center gap-0.5 leading-none relative">
            <span class="font-semibold">
              Documentation
            </span>

            <span class="text-sm rounded-full border py-0.5 px-2.5 font-semibold text-foreground">v{{ documentation.version }}

              <span v-if="documentation.tag" class="tracking-wide">{{ documentation.tag }}</span>
            </span>
          </div>
        </UiSidebarMenuButton>

        <!-- </NuxtLink> -->
      </UiSidebarHeader>

      <UiSidebarContent>
        <UiSidebarGroup v-for="nav in data.nav" :key="nav.id">
          <UiSidebarGroupLabel>{{ nav.label }}</UiSidebarGroupLabel>

          <UiSidebarMenu>
            <UiCollapsible
              v-for="item in nav.items" :key="item.title" as-child :default-open="item.active"
              class="group/collapsible"
            >
              <UiSidebarMenuItem>
                <UiCollapsibleTrigger as-child>
                  <UiSidebarMenuButton :tooltip="item.title">
                    <Icon class="shrink-0 text-xl" :name="item.icon" />
                    <span>{{ item.title }}</span>
                    <ChevronRight
                      class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    />
                  </UiSidebarMenuButton>
                </UiCollapsibleTrigger>

                <UiCollapsibleContent>
                  <UiSidebarMenuSub>
                    <UiSidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                      <UiSidebarMenuSubButton as-child>
                        <NuxtLink :to="subItemLink(nav.label, item.title, subItem.title)">
                          <span>{{ subItem.title }}</span>
                        </NuxtLink>
                      </UiSidebarMenuSubButton>
                    </UiSidebarMenuSubItem>
                  </UiSidebarMenuSub>
                </UiCollapsibleContent>
              </UiSidebarMenuItem>
            </UiCollapsible>
          </UiSidebarMenu>
        </UiSidebarGroup>
      </UiSidebarContent>

      <UiSidebarFooter>
        <UiSidebarMenu>
          <UiSidebarMenuItem>
            <UiSidebarMenuButton class="items-center" size="lg" as-child>
              <NuxtLink to="/">
                <Icon name="game-icons:sharp-crown" class="text-[32px] shrink-0" />
                <span class="truncate text-base font-medium">Created by @brokuka</span>
              </NuxtLink>
            </UiSidebarMenuButton>
          </UiSidebarMenuItem>
        </UiSidebarMenu>
      </UiSidebarFooter>

      <UiSidebarRail />
    </UiSidebar>
  </UiSidebarProvider>
</template>
