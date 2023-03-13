namespace RangeHelper {

    /* Aliases */
    export type Range = GoogleAppsScript.Spreadsheet.Range;
    export type Integer = GoogleAppsScript.Integer;
    type MonsterKeys = Constants.MonsterKeys;
    type RankKeys = Constants.RankKeys;
    type TableNames = Constants.TableNames;

    /* Position types */
    export type Point2D<Row extends Integer = Integer, Column extends Integer = Integer> = Readonly<[Row, Column]>;

    type ColumnHeader = Point2D<1, Integer>;
    type RowHeader = Point2D<Integer, 1>;

    export type AvailableRankKeys = Extract<RankKeys, 'S6' | 'S5' | 'S4' | 'A6' | 'A5' | 'B6' | 'C6' | 'D6' | 'E6' | 'F6'>;
    type HeaderOrValue<T extends Point2D> = T extends ColumnHeader ? MonsterKeys : T extends RowHeader ? AvailableRankKeys : Integer;
    interface CornerCoordinates { bottom: number, top: number, right: number, left: number; }

    /* Methods */
    export function getCell(positions: Point2D): Range {
        return Constants.ACTIVE_SHEET.getRange(...positions);
    }

    export function getCellValue<T extends Point2D>(positions: T): HeaderOrValue<T> {
        return RangeHelper.getCell(positions).getValue();
    }

    export function findResourceCell(positions: Point2D): Range {
        const cell = RangeHelper.getCell(positions);
        return cell.isPartOfMerge() ? cell.getMergedRanges()[0] : cell;
    }

    function getCornerCoordinates(tableName: TableNames): CornerCoordinates {
        const { getLastRow, getRow, getLastColumn, getColumn } = Constants.ACTIVE_SHEET.getRange(tableName);
        return { bottom: getLastRow(), top: getRow(), right: getLastColumn(), left: getColumn() };
    }

    export function isMonsterTableIntersected([row, column]: Point2D): boolean {
        const { bottom, top, right, left } = getCornerCoordinates(Constants.MONSTER_TABLE_NAME);
        return top <= row && row <= bottom && left <= column && column <= right;
    }

    export function isTypeOfInteger(value: string): value is `${number}` {
        return +value >>> 0 === parseFloat(value);
    }

}