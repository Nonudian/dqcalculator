type OnEditEvent = GoogleAppsScript.Events.SheetsOnEdit;

// function testFunctions() {
//     const functions: ReadonlyArray<[Function, ...unknown[]]> = [
//         [Utils.getCellValue, [2, 5], [4, 5], [3, 9]],
//         [Utils.isPositiveNumber, '0', '3', '-1', 'wrong'],
//         [Utils.zip, ['a', 'b'], [0, 1], [2, 3], ['c', 'd']],
//         [Monster.isMonsterTableIntersected, [2, 5], [4, 11]],
//         [Monster.getOrderedGemRows, 5, 11],
//         [Rank.getCommonMaterialQuantities, 'S4', 'A6', '??'],
//         [Rank.getGemQuantities, 'S4', 5, 'A6', 7],
//         [Rank.findResourceCell, [33, 5], [15, 5]],
//         [Rank.splitRank, 'A5', 'B6', 'S7'],
//         [Rank.isRankExisting, 'A', '5', 'B', '6', 'S', '7']
//     ];

//     for (const [fn, ...args] of functions) {
//         const arity = fn.length;
//         const callCounter = args.length / arity;

//         for (let i = 0; i < callCounter; i++) {
//             const calledArgs = args.slice(i * arity, (i + 1) * arity);
//             console.log(`${fn.name}(${calledArgs}): ${fn(...calledArgs)}`);
//         }
//     }
// }

function onEdit({ range: { getValue, getRow, getColumn }, oldValue }: OnEditEvent) {
    const [value, ...positions]: [string, ...RangeHelper.Point2D] = [getValue(), getRow(), getColumn()];

    if (!RangeHelper.isMonsterTableIntersected(positions)) return;
    if (!RangeHelper.isTypeOfInteger(value)) return;

    const rankingUpCounter = +oldValue - +value;
    RankHelper.updateRankState(positions, rankingUpCounter);
}