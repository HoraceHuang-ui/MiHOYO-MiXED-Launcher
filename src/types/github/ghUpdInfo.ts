export interface UpdInfo {
  url: string
  html_url: string
  assets_url: string
  upload_url: string
  tarball_url: string
  zipball_url: string
  discussion_url: string
  id: number
  node_id: string
  tag_name: string
  target_commitish: string
  name: string
  body: string
  draft: boolean
  prerelease: boolean
  created_at: string
  published_at: string
  author?: AuthorInfo
  assets: AssetInfo[]
}

export interface AuthorInfo {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface AssetInfo {
  url: string
  browser_download_url: string
  id: number
  node_id: string
  name: string
  label: string
  state: string
  content_type: string
  size: number
  download_count: number
  created_at: string
  updated_at: string
  uploader: AuthorInfo
}
