import React from "react";

const ALLOWED_TAGS = new Set(["p", "strong", "em", "u", "span", "br", "ul", "ol", "li"]);
const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function sanitizeNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const tag = node.tagName.toLowerCase();
  if (!ALLOWED_TAGS.has(tag)) {
    return Array.from(node.childNodes).map(sanitizeNode).join("");
  }

  const children = Array.from(node.childNodes).map(sanitizeNode).join("");
  if (tag === "br") {
    return "<br />";
  }

  if (tag === "span") {
    const color = node.style?.color?.trim() || "";
    if (HEX_COLOR_PATTERN.test(color)) {
      return `<span style="color:${color}">${children}</span>`;
    }
    return `<span>${children}</span>`;
  }

  return `<${tag}>${children}</${tag}>`;
}

function sanitizeHtml(value = "") {
  const text = typeof value === "string" ? value : "";
  if (!text.trim()) {
    return "";
  }

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return text.replace(/<[^>]+>/g, "");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  return Array.from(doc.body.childNodes).map(sanitizeNode).join("");
}

function inlineNode(node, index, listState = { type: null, item: 0 }) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const tag = node.tagName.toLowerCase();
  const nestedListState = tag === "ul" || tag === "ol" ? { type: tag, item: 0 } : listState;
  const children = Array.from(node.childNodes).map((child, childIndex) =>
    inlineNode(child, childIndex, nestedListState)
  );
  const inner = children.join("");

  if (tag === "br") {
    return "<br />";
  }

  if (tag === "p") {
    return inner ? `${inner}<br />` : "";
  }

  if (tag === "strong" || tag === "em" || tag === "u") {
    return `<${tag}>${inner}</${tag}>`;
  }

  if (tag === "span") {
    const color = node.style?.color?.trim() || "";
    if (HEX_COLOR_PATTERN.test(color)) {
      return `<span style="color:${color}">${inner}</span>`;
    }
    return `<span>${inner}</span>`;
  }

  if (tag === "li") {
    if (listState.type === "ol") {
      listState.item += 1;
      return `${listState.item}. ${inner}<br />`;
    }

    return `• ${inner}<br />`;
  }

  return inner;
}

export function renderRichText(value, keyPrefix = "rt") {
  const sanitized = sanitizeHtml(value);

  if (!sanitized) {
    return "";
  }

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return sanitized.replace(/<[^>]+>/g, "");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitized, "text/html");
  const inlineHtml = Array.from(doc.body.childNodes)
    .map((node, index) => inlineNode(node, index))
    .join("")
    .replace(/(<br\s*\/?>)+$/i, "");

  return <span key={keyPrefix} dangerouslySetInnerHTML={{ __html: inlineHtml }} />;
}
