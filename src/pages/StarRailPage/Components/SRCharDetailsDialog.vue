<script setup lang="ts">
import StarRailDialog from './StarRailDialog.vue'
import StatIcon from '../../../components/StatIcon.vue'
import DialogListItem from '../../../components/DialogListItem.vue'
import { AttributeInfo } from '../../../types/starrail/srPlayerInfo'

defineProps({
  title: {
    type: String,
    default: 'Character Details',
  },
  character: {
    type: Object,
    required: true,
  },
})

const findField = (range: AttributeInfo[], field: string) => {
  for (let i = 0; i < range.length; i++) {
    const element = range[i]
    if (element.field === field) {
      return element
    }
  }
  return {
    field: '',
    name: '',
    icon: '',
    value: 0,
    display: '',
    percent: false,
  }
}

const trimAdditions = (additions: AttributeInfo[]) => {
  const map = ['atk', 'hp', 'def', 'spd', 'crit_rate', 'crit_dmg']
  const tmp = [...additions]
  for (let i = 0; i < tmp.length; i++) {
    if (map.indexOf(tmp[i].field) != -1) {
      tmp.splice(i, 1)
      i--
    }
  }
  return tmp
}
</script>

<template>
  <StarRailDialog :title="title">
    <div class="flex flex-col content-center justify-center w-full px-5">
      <DialogListItem class="font-sr-sans" :name="character.attributes[0].name">
        <template #icon>
          <StatIcon
            game="sr"
            stat="hp"
            fill="#666"
            class="w-4 h-4 mr-1"
            style="margin-top: 2px"
          />
        </template>
        <div class="font-sr-sans">
          <span>{{ character.attributes[0].display }}</span>
          <span
            v-if="findField(character.additions, 'hp').display !== ''"
            class="ml-1 text-blue-500"
            >+{{ findField(character.additions, 'hp').display }}</span
          >
        </div>
      </DialogListItem>
      <DialogListItem class="font-sr-sans" :name="character.attributes[1].name">
        <template #icon>
          <StatIcon
            game="sr"
            stat="atk"
            fill="#666"
            class="w-4 h-4 mr-1"
            style="margin-top: 2px"
          />
        </template>
        <div class="font-sr-sans">
          <span>{{ character.attributes[1].display }}</span>
          <span
            v-if="findField(character.additions, 'atk').display !== ''"
            class="ml-1 text-blue-500"
            >+{{ findField(character.additions, 'atk').display }}</span
          >
        </div>
      </DialogListItem>
      <DialogListItem class="font-sr-sans" :name="character.attributes[2].name">
        <template #icon>
          <StatIcon
            game="sr"
            stat="def"
            fill="#666"
            class="w-4 h-4 mr-1"
            style="margin-top: 2px"
          />
        </template>
        <div class="font-sr-sans">
          <span>{{ character.attributes[2].display }}</span>
          <span
            v-if="findField(character.additions, 'def').display !== ''"
            class="ml-1 text-blue-500"
            >+{{ findField(character.additions, 'def').display }}</span
          >
        </div>
      </DialogListItem>
      <DialogListItem class="font-sr-sans" :name="character.attributes[3].name">
        <template #icon>
          <StatIcon
            game="sr"
            stat="spd"
            fill="#666"
            class="w-4 h-4 mr-1"
            style="margin-top: 2px"
          />
        </template>
        <div class="font-sr-sans">
          <span>{{ character.attributes[3].display }}</span>
          <span
            v-if="findField(character.additions, 'spd').display !== ''"
            class="ml-1 text-blue-500"
            >+{{ findField(character.additions, 'spd').display }}</span
          >
        </div>
      </DialogListItem>
      <DialogListItem
        class="font-sr-sans"
        :name="character.attributes[4].name"
        :val="
          (
            (character.attributes[4].value +
              findField(character.additions, 'crit_rate').value) *
            100
          ).toFixed(1) + '%'
        "
      >
        <template #icon>
          <StatIcon
            game="sr"
            stat="crit_rate"
            fill="#666"
            class="w-4 h-4 mr-1"
            style="margin-top: 2px"
          />
        </template>
      </DialogListItem>
      <DialogListItem
        class="font-sr-sans"
        :name="character.attributes[5].name"
        :val="
          (
            (character.attributes[5].value +
              findField(character.additions, 'crit_dmg').value) *
            100
          ).toFixed(1) + '%'
        "
      >
        <template #icon>
          <StatIcon
            game="sr"
            stat="crit_dmg"
            fill="#666"
            class="w-4 h-4 mr-1"
            style="margin-top: 2px"
          />
        </template>
      </DialogListItem>
      <DialogListItem
        v-for="attr in trimAdditions(character.additions)"
        class="font-sr-sans"
        :name="attr.name"
        :val="attr.display"
      >
        <template #icon>
          <StatIcon
            game="sr"
            :stat="attr.field"
            fill="#666"
            class="w-4 h-4 mr-1"
            style="margin-top: 2px"
          />
        </template>
      </DialogListItem>
    </div>
  </StarRailDialog>
</template>

<style scoped></style>
