// @flow
import { Block, Text, type Change } from 'slate';

import { TablePosition } from '../utils';
import type Options from '../options';

/**
 * Exit the current table, by inserting a default block after the table.
 */
function onModEnter(
    event: *,
    change: Change,
    editor: *,
    opts: Options
): void | Change {
    const { value } = change;
    if (!value.selection.isCollapsed) {
        return undefined;
    }

    event.preventDefault();

    const exitBlock = Block.create({
        type: opts.exitBlockType,
        nodes: [Text.create('')]
    });

    const { document, selection } = value;
    const table = TablePosition.create(opts, document, selection.start.key)
        .table;
    const tableParent = value.document.getParent(table.key);
    const insertionIndex = tableParent.nodes.indexOf(table) + 1;

    return change
        .insertNodeByKey(tableParent.key, insertionIndex, exitBlock)
        .moveToStartOfNode(exitBlock);
}

export default onModEnter;
