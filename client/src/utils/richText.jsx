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

function parseStyle(styleText = "") {
  const style = {};
  const colorMatch = styleText.match(/color:\s*(#[0-9a-f]{3,6})/i);

  if (colorMatch && HEX_COLOR_PATTERN.test(colorMatch[1])) {
    style.color = colorMatch[1];
  }

  return style;
}

function mapNodeToReact(node, key) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const tag = node.tagName.toLowerCase();
  const children = Array.from(node.childNodes).map((child, index) =>
    mapNodeToReact(child, `${key}-${index}`)
  );

  if (tag === "br") {
    return <br key={key} />;
  }

  if (tag === "span") {
    return (
      <span key={key} style={parseStyle(node.getAttribute("style") || "")}>
        {children}
      </span>
    );
  }

  if (tag === "p") {
    return (
      <React.Fragment key={key}>
        {children}
        <br />
      </React.Fragment>
    );
  }

  if (tag === "ul" || tag === "ol") {
    const ListTag = tag;
    return <ListTag key={key}>{children}</ListTag>;
  }

  if (tag === "li") {
    return <li key={key}>{children}</li>;
  }

  const Tag = tag;
  return <Tag key={key}>{children}</Tag>;
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
  const nodes = Array.from(doc.body.childNodes).map((node, index) =>
    mapNodeToReact(node, `${keyPrefix}-${index}`)
  );

  if (
    nodes.length &&
    React.isValidElement(nodes[nodes.length - 1]) &&
    nodes[nodes.length - 1].type === React.Fragment
  ) {
    const lastNode = nodes[nodes.length - 1];
    if (Array.isArray(lastNode.props.children)) {
      const trimmedChildren = [...lastNode.props.children];
      if (trimmedChildren[trimmedChildren.length - 1]?.type === "br") {
        trimmedChildren.pop();
        nodes[nodes.length - 1] = <React.Fragment key={lastNode.key}>{trimmedChildren}</React.Fragment>;
      }
    }
  }

  return nodes;
}
