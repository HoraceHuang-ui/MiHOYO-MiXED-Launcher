export interface RankInfo {
    id: string
    name: string
    rank: number
    desc: string
    materials: RankMaterialInfo[]
    level_up_skills: RankLevelUpSkillInfo[]
    icon: string
}

export interface RankMaterialInfo {
    id: string
    num: number
}

export interface RankLevelUpSkillInfo {
    id: string
    num: number
}
