<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UpdInfo } from './types/github/ghUpdInfo'
import { dialogComponent, DialogStyle } from './types/dialog/dialog'
import { useDialog } from './utils/template-dialog'
import UpdateDialogContent from './components/UpdateDialogContent.vue'
import { translate } from './i18n'
import TopHeader from './components/TopHeader.vue'

let appVer = ''
const dialogStyle = ref<DialogStyle>('gs')
const updCheck = ref(false)
const updInfo = ref<UpdInfo>({
  assets: [],
  assets_url: '',
  author: undefined,
  body: '',
  created_at: '',
  discussion_url: '',
  draft: false,
  html_url: '',
  id: 0,
  name: '',
  node_id: '',
  prerelease: false,
  published_at: '',
  tag_name: '',
  tarball_url: '',
  target_commitish: '',
  upload_url: '',
  url: '',
  zipball_url: '',
})

const skipCurrent = ref(false)

const router = useRouter()
onMounted(() => {
  // window.store.delete("targetVersion")
  window.github
    .getLatestRelease()
    .then((resp: any) => {
      if (needsUpdate(resp.data.tag_name)) {
        window.store.get('targetVersion').then((target: any) => {
          console.log(target)
          if (!target || target < resp.data.tag_name) {
            updInfo.value = resp.data
            useDialog(
              dialogComponent(dialogStyle.value),
              {
                onCancel(dispose: () => void) {
                  if (skipCurrent.value) {
                    window.store.set(
                      'targetVersion',
                      updInfo.value.tag_name,
                      false,
                    )
                  }
                  dispose()
                },
                onOk(dispose: () => void) {
                  window.electron.openExtLink(
                    updInfo.value.assets[0].browser_download_url,
                  )
                  window.win.close()
                  dispose()
                },
              },
              {
                title: translate('updDialog_title'),
                showCancel: true,
                vnode: h(UpdateDialogContent, {
                  appVer: appVer,
                  updInfo: updInfo.value,
                  skipCurrent: skipCurrent.value,
                  'onUpdate:skipCurrent': (value: boolean) => {
                    skipCurrent.value = value
                  },
                }),
              },
            )
          }
        })
      }
      updCheck.value = true
    })
    .catch((err: Error) => {
      console.error(err)
    })

  window.store.get('dialogStyle').then((style: DialogStyle) => {
    if (!style) {
      window.store.set('dialogStyle', 'gs', false)
    }
    dialogStyle.value = style
  })

  fetch('../package.json')
    .then(response => response.json())
    .then(resp => {
      appVer = resp.version
    })

  router.push('/')
})

const verCompare = (a: string, b: string) => {
  const arr1 = a.split('.')
  const arr2 = b.split('.')

  if (arr1.length != arr2.length) {
    return 114
  }

  for (let i = 0; i < arr1.length; i++) {
    if (parseInt(arr1[i]) > parseInt(arr2[i])) {
      return 1
    } else if (parseInt(arr1[i]) < parseInt(arr2[i])) {
      return -1
    }
  }
  return 0
}

const needsUpdate = (latestStr: string) => {
  const latest = latestStr.substring(1)
  const curr = appVer
  console.log(latest)
  console.log(curr)

  return verCompare(latest, curr) > 0
}
</script>

<template id="app">
  <TopHeader />
  <router-view></router-view>
</template>
