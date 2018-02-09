// @flow
import {
    insertTable,
    insertRow,
    removeRow,
    insertColumn,
    removeColumn,
    removeTable,
    clearCell,
    moveSelection,
    moveSelectionBy,
    setColumnAlign
} from './changes';
import {
    isSelectionInTable,
    isSelectionOutOfTable,
    getPosition
} from './utils';
import { schema } from './validation';

import ALIGN from './ALIGN';
import Options, { type OptionsFormat } from './options';

/**
 * Returns the core of the plugin, limited to the validation and normalization
 * part of `slate-edit-table`, and utils.
 *
 * Import this directly: `import EditTable from 'slate-edit-table/lib/core'`
 * if you don't care about behavior/rendering and you
 * are only manipulating `Slate.States` without rendering them.
 * That way you do not depend on `slate-react`.
 */
function core(optionsParam: Options | OptionsFormat): Object {
    const opts = new Options(optionsParam);

    return {
        schema: schema(opts),

        utils: {
            isSelectionInTable: isSelectionInTable.bind(null, opts),
            isSelectionOutOfTable: isSelectionOutOfTable.bind(null, opts),
            getPosition: getPosition.bind(null, opts)
        },

        changes: {
            insertTable: insertTable.bind(null, opts),
            clearCell: clearCell.bind(null, opts),
            insertRow: bindAndScopeChange(opts, insertRow),
            removeRow: bindAndScopeChange(opts, removeRow),
            insertColumn: bindAndScopeChange(opts, insertColumn),
            removeColumn: bindAndScopeChange(opts, removeColumn),
            removeTable: bindAndScopeChange(opts, removeTable),
            moveSelection: bindAndScopeChange(opts, moveSelection),
            moveSelectionBy: bindAndScopeChange(opts, moveSelectionBy),
            setColumnAlign: bindAndScopeChange(opts, setColumnAlign)
        }
    };
}

/**
 * Bind a change to given options, and scope it to act only inside a table
 */
function bindAndScopeChange(opts: Options, fn: *): * {
    return (change, ...args) => {
        const { state } = change;

        if (!isSelectionInTable(opts, state)) {
            return change;
        }

        // $FlowFixMe
        return fn(...[opts, change].concat(args));
    };
}

// Expose aligns here too
core.ALIGN = ALIGN;

export default core;