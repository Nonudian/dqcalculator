namespace RankHelper {

    /* Aliases */
    type Point2D = RangeHelper.Point2D;
    type AvailableRankKeys = RangeHelper.AvailableRankKeys;
    type RankKeys = Constants.RankKeys;
    type MonsterKeys = Constants.MonsterKeys | '???';
    type AllMaterialTypes = Constants.AllMaterialTypes;
    type MysteryKeys = Constants.MysteryKeys;

    /* Rank characters */
    type Chars<S extends string> = S extends `${infer L}${infer N}` ? [L, N] : never;

    /* Methods */
    function splitRank<T extends RankKeys>(rankKey: T): Chars<T> {
        return rankKey.split('') as Chars<T>;
    }

    function isRankKeyExisting(rankKey: string): rankKey is RankKeys {
        return Constants.getRankKeys().includes(rankKey);
    }

    function gainNextRank([rankRow, monsterColumn]: Point2D, rankKey: RankKeys, rankingUpCounter: number) {
        const [letter, number] = splitRank(rankKey);
        if (!isRankKeyExisting(`${letter}${+number + 1}`)) return;

        const cell = RangeHelper.getCell([rankRow - 1, monsterColumn]);
        //cell.setValue(+cell.getValue() + rankingUpCounter);
        cell.setNote(`${+cell.getValue() + rankingUpCounter}`);
    }

    function getQuantities(rankKey: RankKeys, monsterKey: MonsterKeys) {
        if (monsterKey === '???') return Constants.getMysteryQuantities(rankKey as MysteryKeys);

        const { common, gem } = Constants.getMaterialQuantities(rankKey);
        const gemRows = Constants.getGemRows(monsterKey);

        const zippedGems = gem?.map<[typeof gemRows[number], number]>(((value, i) => [gemRows[i], value]));

        return [...common ?? [], ...zippedGems ?? []];
    }

    function getInferiorRankKeys(rankKey: AvailableRankKeys, monsterKey: MonsterKeys) {
        const [letter, number] = splitRank(rankKey);
        const inferiorityPredicate = (key: string) => key.startsWith(letter) && +key[1] < +number;

        const allKeys = monsterKey === '???' ? Constants.getMysteryKeys() : Constants.getRankKeys();
        return allKeys.filter(inferiorityPredicate);
    }

    function getFinalEntries<T>(obj: T) {
        return Object.entries(obj) as { [K in keyof T]-?: [K, NonNullable<T[K]>]; }[keyof T][];
    }

    function getCumulativeQuantities(rankKey: AvailableRankKeys, monsterKey: MonsterKeys) {
        const inferiorRankKeys = getInferiorRankKeys(rankKey, monsterKey);

        return getFinalEntries(inferiorRankKeys
            .flatMap(key => getQuantities(key as RankKeys, monsterKey) as [AllMaterialTypes, number][])
            .reduce((acc, [row, quantity]) => (acc[row] = (acc[row] ?? 0) + quantity, acc), {} as { [K in AllMaterialTypes]?: number })
        );
    }

    export function updateRankState([rankRow, monsterColumn]: Point2D, rankingUpCounter: number) {
        const rankValue = RangeHelper.getCellValue([rankRow, 1] as const);
        const monsterValue = RangeHelper.getCellValue([1, monsterColumn] as const);

        const isRankingUp = rankingUpCounter > 0;

        if (isRankingUp) gainNextRank([rankRow, monsterColumn], rankValue, rankingUpCounter);

        const materialQuantities = isRankingUp ? getQuantities(rankValue, monsterValue) : getCumulativeQuantities(rankValue, monsterValue);
        materialQuantities.forEach(([row, quantity]) => {
            const cost = quantity * Math.abs(rankingUpCounter);
            const cell = RangeHelper.findResourceCell([row, monsterColumn]);
            //cell.setValue(+cell.getValue() - cost);
            cell.setNote(`${+cell.getValue() - cost}`);
        });
    }

}