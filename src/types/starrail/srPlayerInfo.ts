export interface LevelInfo {
    id: string
    level: number
}

export interface AvatarInfo {
    id: string
    name: string
    icon: string
}

export interface PathInfo {
    id: string
    name: string
    icon: string
}

export interface ElementInfo {
    id: string
    name: string
    color: string
    icon: string
}

export interface SkillInfo {
    id: string
    name: string
    level: number
    max_level: number
    element?: ElementInfo
    type: string
    type_text: string
    effect: string
    effect_text: string
    simple_desc: string
    desc: string
    icon: string
}

export interface SkillTreeInfo {
    id: string
    level: number
    anchor: string
    max_level: number
    icon: string
    parent?: string
}

export interface AttributeInfo {
    field: string
    name: string
    icon: string
    value: number
    display: string
    percent: boolean
}

export interface PropertyInfo {
    type: string
    field: string
    name: string
    icon: string
    value: number
    display: string
    percent: boolean
}

export interface SubAffixInfo {
    count: number
    step: number
}

export interface RelicInfo {
    id: string
    name: string
    set_id: string
    set_name: string
    rarity: number
    level: number
    icon: string
    main_affix: PropertyInfo[]
    sub_affix: SubAffixInfo[]
}

export interface RelicSetInfo {
    id: string
    name: string
    icon: string
    num: number
    desc: string
    properties: PropertyInfo[]
}

export interface LightConeInfo {
    id: string
    name: string
    rarity: number
    rank: number
    level: number
    promotion: number
    icon: string
    preview: string
    portrait: string
    path?: PathInfo
    attributes: AttributeInfo[]
    properties: PropertyInfo[]
}

export interface MemoryInfo {
    level: number
    chaos_id: number
    chaos_level: number
}

export interface SpaceInfo {
    memory_data?: MemoryInfo
    universe_level: number
    light_cone_count: number
    avatar_count: number
    achievement_count: number
}

export interface PlayerInfo {
    uid: string
    nickname: string
    level: number
    world_level: number
    friend_count: number
    avatar?: AvatarInfo
    signature: string
    is_display: boolean
    space_info?: SpaceInfo
}

export interface CharacterInfo {
    id: string
    name: string
    rarity: number
    rank: number
    level: number
    promotion: number
    icon: string
    preview: string
    portrait: string
    rank_icons: string[]
    path?: PathInfo
    element?: ElementInfo
    skills: SkillInfo[]
    skill_trees: SkillTreeInfo[]
    light_cone?: LightConeInfo
    relics: RelicInfo[]
    relic_sets: RelicSetInfo[]
    attributes: AttributeInfo[]
    additions: AttributeInfo[]
    properties: PropertyInfo[]
}

export interface FormattedApiInfo {
    player: PlayerInfo
    characters: CharacterInfo[]
}
