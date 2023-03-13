namespace Constants {

    /* Constant keys */
    export type TableNames = typeof Constants.MONSTER_TABLE_NAME;
    export type MonsterKeys = keyof typeof ORDERED_GEM_ROWS;
    export type RankKeys = keyof typeof MATERIAL_QUANTITIES;
    export type MysteryKeys = keyof typeof MYSTERY_QUANTITIES;

    /* Material type checking */
    type CommonMaterialTypes = typeof CRYSTAL | typeof ORB | typeof IRIS | typeof PEARL | typeof SPHERE;
    interface MaterialType {
        common?: ReadonlyArray<Readonly<[CommonMaterialTypes, number]>>;
        gem?: ReadonlyArray<Readonly<number>>;
    }
    type RankQuantities<T extends unknown> = { [K in keyof T]: T[K] extends MaterialType ? T[K] : never };
    export type AllMaterialTypes = CommonMaterialTypes | typeof RUBY | typeof SAPPHIRE | typeof EMERALD;

    function validMaterialConfig<T extends unknown>(materialEntries: RankQuantities<T>): T { return materialEntries; }

    /* Global */
    export const ACTIVE_SHEET = SpreadsheetApp.getActiveSheet();
    export const [MONSTER_TABLE_NAME] = ['monsters'] as const;

    /* Monsters */
    const [RUBY, SAPPHIRE, EMERALD] = [30, 33, 36] as const;
    const ORDERED_GEM_ROWS = {
        'beast': [RUBY, EMERALD, SAPPHIRE],
        'undead': [RUBY, EMERALD, SAPPHIRE],
        'dragon': [SAPPHIRE, RUBY, EMERALD],
        'slime': [SAPPHIRE, EMERALD, RUBY],
        'inorganic': [EMERALD, RUBY, SAPPHIRE],
        'demon': [EMERALD, SAPPHIRE, RUBY],
        'nature': [SAPPHIRE, RUBY, EMERALD],
        'hero': [EMERALD, SAPPHIRE, RUBY]
    } as const;

    /* Ranks */
    const [CRYSTAL, ORB, IRIS, SPHERE, PEARL] = [15, 18, 21, 24, 27] as const;
    const MATERIAL_QUANTITIES = validMaterialConfig({
        // S ranks
        'S6': { common: [[CRYSTAL, 2], [IRIS, 8], [SPHERE, 16], [PEARL, 24]] },
        'S5': { common: [[ORB, 1], [IRIS, 8], [SPHERE, 16], [PEARL, 20]] },
        'S4': { common: [[ORB, 1], [PEARL, 5]], gem: [47, 35] },
        'S3': { common: [[IRIS, 5], [PEARL, 5]], gem: [32, 24] },
        'S2': { common: [[PEARL, 7]], gem: [24, 18] },
        'S1': { gem: [16, 12] },
        'S0': { gem: [8, 6, 4] },
        // A ranks
        'A6': { common: [[CRYSTAL, 1], [IRIS, 5], [SPHERE, 12]] },
        'A5': { common: [[IRIS, 5], [SPHERE, 12], [PEARL, 8]], gem: [46] },
        'A4': { common: [[IRIS, 1], [PEARL, 3]], gem: [27, 20] },
        'A3': { common: [[PEARL, 5]], gem: [17, 12] },
        'A2': { gem: [13, 9] },
        'A1': { gem: [9, 6, 3] },
        'A0': { gem: [5, 3, 1] },
        // B ranks
        'B6': { common: [[IRIS, 1], [SPHERE, 8], [PEARL, 18]], gem: [64] },
        'B5': { common: [[IRIS, 1], [SPHERE, 8]], gem: [16, 10] },
        'B4': { common: [[PEARL, 3]], gem: [8, 5] },
        'B3': { gem: [6, 4, 2] },
        'B2': { gem: [5, 3, 1] },
        'B1': { gem: [3, 2, 1] },
        'B0': { gem: [1, 1, 1] },
        // C ranks
        'C6': { common: [[SPHERE, 5], [PEARL, 12]] },
        'C5': { common: [[SPHERE, 5]], gem: [16, 10] },
        // D ranks
        'D6': { common: [[SPHERE, 3], [PEARL, 8]], gem: [48] },
        'D5': { common: [[SPHERE, 3]], gem: [16, 10] },
        // E ranks
        'E6': { common: [[PEARL, 5]], gem: [32] },
        'E5': { common: [[PEARL, 3]] },
        // F ranks
        'F6': { gem: [32, 30] }
    } as const);

    /* Mystery-monster (???) Quantities */
    const MYSTERY_QUANTITIES = ({
        // S ranks
        'S6': [[CRYSTAL, 2], [IRIS, 8], [SPHERE, 16], [PEARL, 24]],
        'S5': [[ORB, 1], [IRIS, 8], [SPHERE, 16], [PEARL, 20]],
        'S4': [[ORB, 1], [PEARL, 5], [EMERALD, 38], [SAPPHIRE, 35]],
        'S3': [[IRIS, 5], [PEARL, 5], [RUBY, 30], [EMERALD, 27]],
        'S2': [[PEARL, 7], [RUBY, 23], [SAPPHIRE, 18]],
        'S1': [[RUBY, 12], [SAPPHIRE, 12]],
        'S0': [[RUBY, 6], [EMERALD, 6], [SAPPHIRE, 6]],
        // B ranks
        'B6': [[IRIS, 1], [SPHERE, 8], [PEARL, 18], [RUBY, 64]],
        'B5': [[IRIS, 1], [SPHERE, 8], [EMERALD, 10], [SAPPHIRE, 16]],
        'B4': [[PEARL, 3], [EMERALD, 5], [SAPPHIRE, 5]],
        'B3': [[RUBY, 6], [EMERALD, 4], [SAPPHIRE, 4]],
        'B2': [[RUBY, 5], [EMERALD, 3], [SAPPHIRE, 3]],
        'B1': [[RUBY, 3], [EMERALD, 2], [SAPPHIRE, 2]],
        'B0': [[RUBY, 1], [EMERALD, 1], [SAPPHIRE, 1]]
    }) as const;

    /* Methods */
    export function getRankKeys() { return Object.keys(MATERIAL_QUANTITIES); }

    export function getMaterialQuantities(rankKey: RankKeys) { return MATERIAL_QUANTITIES[rankKey]; }
    export function getGemRows(monsterKey: MonsterKeys) { return ORDERED_GEM_ROWS[monsterKey]; }

    export function getMysteryKeys() { return Object.keys(MYSTERY_QUANTITIES); }
    export function getMysteryQuantities(rankKey: MysteryKeys) { return MYSTERY_QUANTITIES[rankKey]; }

}