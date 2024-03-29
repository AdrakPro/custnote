<script lang="ts">
  import { defaultValueCtx, Editor, editorViewCtx, rootCtx } from '@milkdown/core';
  import { gfm } from '@milkdown/preset-gfm';
  import { clipboard } from '@milkdown/plugin-clipboard';
  import { cursor } from '@milkdown/plugin-cursor';
  import { math } from '@milkdown/plugin-math';
  import { history } from '@milkdown/plugin-history';
  import { slash } from '@milkdown/plugin-slash';
  import { trailing } from '@milkdown/plugin-trailing';
  import { prism } from '@milkdown/plugin-prism';
  import { diagram } from '@milkdown/plugin-diagram';

  import { theme } from './style/theme.ts';
  import { destroy, getMarkdown, replaceAll } from '@milkdown/utils';

  import { notes } from '$lib/stores/notes.js';
  import { withPrevious } from 'svelte-previous';
  import { createEventDispatcher } from 'svelte';

  import 'katex/dist/katex.min.css';
  import '/src/styles/highlight.min.css';

  export let note;
  const [currentNote, previousNote] = withPrevious(note);
  const dispatch = createEventDispatcher();

  $: $currentNote = note;

  // todo https://github.com/Saul-Mirone/milkdown/discussions/517
  function createEditor(dom) {
    const defaultContent = $currentNote.content || '';

    const editorPromise = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, dom);
        ctx.set(defaultValueCtx, defaultContent);
      })
      .use(theme)
      .use(prism)
      .use(gfm)
      .use(slash)
      .use(clipboard)
      .use(history)
      .use(cursor)
      .use(math)
      .use(trailing)
      .use(diagram)
      .create();

    return {
      update() {
        editorPromise.then((editor) => {
          // Save content before rendering markdown
          if ($previousNote) {
            const currentMarkdown =
              editor.action(getMarkdown());

            if (currentMarkdown) {
              notes.setContent(
                $previousNote.name,
                currentMarkdown
              );
            }
          }

          // Render markdown
          editor.action(replaceAll($currentNote.content));

          // Focus editor
          editor.action((ctx) =>
            ctx.get(editorViewCtx).focus()
          );
        });
      },

      destroy() {
        editorPromise.then((editor) => {
          // Edge case: save when only one note exists
          const currentMarkdown =
            editor.action(getMarkdown());
          editor.action(destroy());

          if (currentMarkdown) {
            dispatch('destroy', {
              content: currentMarkdown,
              name: $currentNote.name
            });
          }
        });
      }
    };
  }
</script>

{#if $currentNote}
  <div
    spellcheck="false"
    use:createEditor={$currentNote}
  ></div>
{/if}
