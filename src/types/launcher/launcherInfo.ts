export interface LauncherInfo {
  game?: GameInfo
  language: string
  banners: BannerInfo[]
  posts: PostInfo[]
  social_media_list: any[]
}

export interface GameInfo {
  id: string
  biz: string
}

export interface BannerInfo {
  id: string
  image: ImageInfo
}

export interface ImageInfo {
  url: string
  link: string
}

export interface PostInfo {
  id: string
  title: string
  type: string
  link: string
  date: string
}
