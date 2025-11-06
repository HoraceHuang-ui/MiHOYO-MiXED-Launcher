import { GameInfo, ImageInfo } from './launcherInfo'

export interface BgImageInfo {
  game: GameInfo
  backgrounds: BackgroundInfo[]
}

export interface BackgroundInfo {
  id: string
  background: ImageInfo
  icon: any
  theme?: ImageInfo
  video?: ImageInfo
  type: string
}
