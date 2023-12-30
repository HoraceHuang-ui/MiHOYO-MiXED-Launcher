export interface LauncherInfo {
    adv?: AdvInfo
    banner: BannerInfo[]
    icon: IconInfo[]
    links?: LinksInfo
    more?: MoreInfo
    post: PostInfo[]
    qq: Object[]
}

export interface AdvInfo {
    background: string
    bg_checksum: string
    icon: string
    url: string
    version: string
}

export interface BannerInfo {
    banner_id: string
    img: string
    name: string
    order: string
    url: string
}

export interface IconInfo {
    enable_red_dot: boolean
    icon_id: string
    icon_link: string
    img: string
    img_hover: string
    links: LinkInfo[]
    other_links: LinkInfo[]
    qr_desc: string
    qr_img: string
    red_dot_content: string
    title: string
    tittle: string
    url: string
}

export interface LinkInfo {
    title: string
    url: string
}

export interface LinksInfo {
    faq: string
    version: string
}

export interface MoreInfo {
    activity_link: string
    announce_link: string
    info_link: string
    news_link: string
    supply_link: string
    tools_link: string
    trends_link: string
}

export interface PostInfo {
    order: string
    post_id: string
    show_time: string
    title: string
    tittle: string
    type: string
    url: string
}
