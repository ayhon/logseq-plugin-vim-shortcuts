import { ILSPluginUser } from '@logseq/libs/dist/LSPlugin';
import { debug, getCurrentBlockUUID, getCurrentPage, getNumber, getSettings, resetNumber, scrollToBlockInPage, writeClipboard } from '../common/funcs';

const deleteCurrentBlock = async () => {
  const page = await getCurrentPage();
    if (page?.name) {
      let blockUUID = await getCurrentBlockUUID();
      if (blockUUID) {
        let block = await logseq.Editor.getBlock(blockUUID);
        if (block?.uuid) {

          let prevBlock = await logseq.Editor.getPreviousSiblingBlock(block.uuid);
          let nextBlock = await logseq.Editor.getNextSiblingBlock(block.uuid);

          writeClipboard(block.content);
          await logseq.Editor.removeBlock(block.uuid);

          let focusBlock = prevBlock || nextBlock || null;
          if (focusBlock?.uuid) {
            scrollToBlockInPage(page.name, focusBlock.uuid);
          } else if (block.left.id) {
            const parentBlock = await logseq.Editor.getBlock(block.left.id);
            if (parentBlock?.uuid) {

              scrollToBlockInPage(page.name, parentBlock.uuid);
            }
          }
        }
      }
    } else {
      let blockUUID = await getCurrentBlockUUID();
      if (blockUUID) {
        let block = await logseq.Editor.getBlock(blockUUID);
        if (block?.uuid) {

          let prevBlock = await logseq.Editor.getPreviousSiblingBlock(block.uuid);
          let nextBlock = await logseq.Editor.getNextSiblingBlock(block.uuid);

          writeClipboard(block.content);
          await logseq.Editor.removeBlock(block.uuid);
          let focusBlock = prevBlock || nextBlock || null;
          if (focusBlock?.uuid) {
            await logseq.Editor.editBlock(focusBlock.uuid);
            await logseq.Editor.exitEditingMode(true);
          } else if (block.left.id) {
            const parentBlock = await logseq.Editor.getBlock(block.left.id);
            if (parentBlock?.uuid) {
              await logseq.Editor.editBlock(parentBlock.uuid);
              await logseq.Editor.exitEditingMode(true);

            }
          }
        }
      }
    }
};

export default (logseq: ILSPluginUser) => {
  const settings = getSettings();

  logseq.App.registerCommandPalette({
    key: 'vim-shortcut-delete-current-block',
    label: 'Delete current block',
    keybinding: {
      mode: 'non-editing',
      binding: settings.deleteCurrentBlock
    }
  }, async () => {
    debug('delete current block');

    const number = getNumber();
    resetNumber();

    for (let i = 0; i < number; i++) {
      await deleteCurrentBlock();
    }
  });
};
