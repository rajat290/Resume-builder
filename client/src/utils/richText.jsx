import React from "react";

const FORMATS = {
  bold: { open: "[b]", close: "[/b]" },
  italic: { open: "[i]", close: "[/i]" },
  underline: { open: "[u]", close: "[/u]" }
};

export function applyTagToSelection(value, selectionStart, selectionEnd, format, color) {
  const selectedValue = value.slice(selectionStart, selectionEnd);

  if (format === "color") {
    const open = `[color:${color || "#000000"}]`;
    const close = "[/color]";
    const nextValue =
      value.slice(0, selectionStart) + open + selectedValue + close + value.slice(selectionEnd);

    return {
      value: nextValue,
      selectionStart: selectionStart + open.length,
      selectionEnd: selectionStart + open.length + selectedValue.length
    };
  }

  const tag = FORMATS[format];
  if (!tag) {
    return {
      value,
      selectionStart,
      selectionEnd
    };
  }

  const nextValue =
    value.slice(0, selectionStart) + tag.open + selectedValue + tag.close + value.slice(selectionEnd);

  return {
    value: nextValue,
    selectionStart: selectionStart + tag.open.length,
    selectionEnd: selectionStart + tag.open.length + selectedValue.length
  };
}

export function renderRichText(value, keyPrefix = "rt") {
  const text = typeof value === "string" ? value : "";

  const parse = (input, activeStyles = {}, path = "0") => {
    const nodes = [];
    let cursor = 0;

    while (cursor < input.length) {
      const tagStart = input.indexOf("[", cursor);
      if (tagStart === -1) {
        const remainder = input.slice(cursor);
        if (remainder) {
          nodes.push(
            <span key={`${keyPrefix}-${path}-${nodes.length}`} style={activeStyles}>
              {remainder}
            </span>
          );
        }
        break;
      }

      if (tagStart > cursor) {
        const plain = input.slice(cursor, tagStart);
        nodes.push(
          <span key={`${keyPrefix}-${path}-${nodes.length}`} style={activeStyles}>
            {plain}
          </span>
        );
      }

      const tagEnd = input.indexOf("]", tagStart);
      if (tagEnd === -1) {
        const tail = input.slice(tagStart);
        nodes.push(
          <span key={`${keyPrefix}-${path}-${nodes.length}`} style={activeStyles}>
            {tail}
          </span>
        );
        break;
      }

      const tagContent = input.slice(tagStart + 1, tagEnd);
      const closingTag = tagContent.startsWith("/");
      if (closingTag) {
        cursor = tagEnd + 1;
        continue;
      }

      const matcher = tagContent.match(/^(b|i|u|color(?::#[0-9a-fA-F]{3,6})?)$/);
      if (!matcher) {
        nodes.push(
          <span key={`${keyPrefix}-${path}-${nodes.length}`} style={activeStyles}>
            {input.slice(tagStart, tagEnd + 1)}
          </span>
        );
        cursor = tagEnd + 1;
        continue;
      }

      const tagName = matcher[1];
      const closingMarker = tagName.startsWith("color") ? "[/color]" : `[/${tagName}]`;
      const closingIndex = input.indexOf(closingMarker, tagEnd + 1);

      if (closingIndex === -1) {
        nodes.push(
          <span key={`${keyPrefix}-${path}-${nodes.length}`} style={activeStyles}>
            {input.slice(tagStart, tagEnd + 1)}
          </span>
        );
        cursor = tagEnd + 1;
        continue;
      }

      const content = input.slice(tagEnd + 1, closingIndex);
      const nextStyles = { ...activeStyles };

      if (tagName === "b") nextStyles.fontWeight = 700;
      if (tagName === "i") nextStyles.fontStyle = "italic";
      if (tagName === "u") nextStyles.textDecoration = "underline";
      if (tagName.startsWith("color:")) nextStyles.color = tagName.split(":")[1];

      nodes.push(...parse(content, nextStyles, `${path}-${nodes.length}`));
      cursor = closingIndex + closingMarker.length;
    }

    return nodes;
  };

  return parse(text);
}
