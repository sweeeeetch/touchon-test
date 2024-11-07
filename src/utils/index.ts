// maskDirective.ts
import type { DirectiveBinding } from "vue";

function processMask(mask: string) {
  const maskArray = mask.split("");
  let digitCount = 0;
  maskArray.forEach((char) => {
    if (char === "9") {
      digitCount++;
    }
  });
  return {
    maskArray,
    digitCount,
  };
}

export function maskMounted(
  el: HTMLInputElement & { _onInput: (e: Event) => void; _onPaste: (e: ClipboardEvent) => void },
  binding: DirectiveBinding<string>,
) {
  if (!binding.value) return;

  const mask = binding.value;

  if (!mask) return;

  const { maskArray, digitCount } = processMask(mask);

  function formatValue(value: string): string {
    let formatted = "";
    let valueIndex = 0;
    for (let i = 0; i < maskArray.length; i++) {
      if (maskArray[i] === "9") {
        if (value[valueIndex]) {
          formatted += value[valueIndex];
          valueIndex++;
        } else {
          break;
        }
      } else {
        if (value[valueIndex] || maskArray[i]) {
          formatted += maskArray[i];
        } else {
          break;
        }
      }
    }
    return formatted;
  }

  function unformatValue(value: string): string {
    return value.replace(/\D/g, "").slice(0, digitCount);
  }

  function getDigitsBeforeCursor(value: string, cursorPos: number): number {
    let digits = 0;
    for (let i = 0; i < cursorPos; i++) {
      if (/\d/.test(value[i])) {
        digits++;
      }
    }
    return digits;
  }

  function setCursorPosition(input: HTMLInputElement, cursorPos: number) {
    input.setSelectionRange(cursorPos, cursorPos);
  }

  function onInput(e: Event) {
    const input = e.target as HTMLInputElement & { _rawValue?: string };

    const oldValue = input.value;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;

    const rawValue = unformatValue(oldValue);

    const formattedValue = formatValue(rawValue);

    input.value = formattedValue;
    input._rawValue = rawValue;

    // Emit an input event to update v-model
    input.dispatchEvent(new Event("input", { bubbles: true }));

    let newCursorPos = 0;

    if (selectionStart === 0 && selectionEnd === oldValue.length) {
      newCursorPos = formattedValue.length;
    } else {
      const digitsBeforeCursor = getDigitsBeforeCursor(oldValue, selectionStart);

      let digitsCount = 0;
      for (let i = 0; i < formattedValue.length; i++) {
        if (/\d/.test(formattedValue[i])) {
          digitsCount++;
        }
        if (digitsCount >= digitsBeforeCursor) {
          newCursorPos = i + 1;
          break;
        }
      }

      if (digitsCount < digitsBeforeCursor) {
        newCursorPos = formattedValue.length;
      }
    }

    setCursorPosition(input, newCursorPos);
  }

  function onPaste(e: ClipboardEvent) {
    setTimeout(() => {
      onInput(e);
    }, 0);
  }

  el._onInput = onInput;
  el._onPaste = onPaste;

  el.addEventListener("input", onInput);
  el.addEventListener("paste", onPaste);
}
