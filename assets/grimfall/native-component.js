// runtime:runtime:react
var React = window.SQWebRuntime.React;
var useCallback = React.useCallback;
var useContext = React.useContext;
var useEffect = React.useEffect;
var useLayoutEffect = React.useLayoutEffect;
var useMemo = React.useMemo;
var useRef = React.useRef;
var useState = React.useState;

// runtime:runtime:react-router-dom
var Link = window.SQWebRuntime.Link;
var useLocation = window.SQWebRuntime.useLocation;
var useParams = window.SQWebRuntime.useParams;

// runtime:runtime:prop-types
var checker = (...args) => args.length >= 3 && typeof args[1] === "string" ? null : checker;
checker.isRequired = checker;
var runtime_prop_types_default = new Proxy({}, { get: () => checker });

// runtime:runtime:use-site-content
var useSiteContent = window.SQWebRuntime.useSiteContent;

// runtime:runtime:react-dom
var ReactDOM = window.SQWebRuntime.ReactDOM;
var createPortal = ReactDOM.createPortal;

// runtime:runtime:react-jsx-runtime
var React2 = window.SQWebRuntime.React;
var Fragment = React2.Fragment;
function jsx(type, props, key) {
  return React2.createElement(type, key === void 0 ? props : { ...props, key });
}
function jsxs(type, props, key) {
  return React2.createElement(type, key === void 0 ? props : { ...props, key }, ...props.children);
}

// FeatureModules/src/SubComponents/conquest/AbilitySamples.jsx
var UI = "/Web/Features/conquest-of-azeroth/creation-ui/";
function SpellTooltip({ active, resolveAssetUrl, children, portalRoot }) {
  const element = useRef(null);
  const [position, setPosition] = useState({ left: 12, top: 12, visibility: "hidden" });
  useLayoutEffect(() => {
    const place = () => {
      const anchor = active.anchor.getBoundingClientRect();
      const popup = element.current.getBoundingClientRect();
      const inset = 12;
      const fitsRight = anchor.right + inset + popup.width <= innerWidth - inset;
      const fitsLeft = anchor.left - popup.width - inset >= inset;
      let left = fitsRight ? anchor.right + inset : anchor.left - popup.width - inset;
      let top = Math.max(inset, Math.min(anchor.top - inset, innerHeight - popup.height - inset));
      let maxHeight = innerHeight - inset * 2;
      if (active.avoidSelector && fitsRight && fitsLeft) {
        const prerequisites = [...(portalRoot || document.body).querySelectorAll(active.avoidSelector)].map((node) => node.getBoundingClientRect());
        const overlap = (x) => prerequisites.reduce((area, node) => area + Math.max(0, Math.min(x + popup.width, node.right) - Math.max(x, node.left)) * Math.max(0, Math.min(top + popup.height, node.bottom) - Math.max(top, node.top)), 0);
        const leftSide = anchor.left - popup.width - inset;
        if (overlap(leftSide) < overlap(left)) left = leftSide;
      }
      if (!fitsRight && !fitsLeft) {
        const above = anchor.top - inset * 2;
        const below = innerHeight - anchor.bottom - inset * 2;
        const placeAbove = above >= popup.height || above >= below;
        maxHeight = Math.max(32, placeAbove ? above : below);
        top = placeAbove ? anchor.top - Math.min(popup.height, maxHeight) - inset : anchor.bottom + inset;
      }
      setPosition({
        left: Math.max(inset, Math.min(left, innerWidth - popup.width - inset)),
        top: Math.max(inset, top),
        maxHeight,
        visibility: "visible"
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [active, portalRoot]);
  const spell = active.spell;
  return createPortal(
    /* @__PURE__ */ jsxs("div", { ref: element, className: "coa-spell-tooltip", role: "tooltip", id: active.tooltipId || `coa-tooltip-${spell.id}`, style: {
      ...position,
      "--tooltip-background": `url("${resolveAssetUrl(UI + "tooltip-background.webp")}")`,
      "--tooltip-border": `url("${resolveAssetUrl(UI + "tooltip-border.webp")}")`
    }, children: [
      /* @__PURE__ */ jsx("h3", { children: spell.name }),
      children || /* @__PURE__ */ jsx("p", { children: spell.description }),
      /* @__PURE__ */ jsxs("div", { className: "coa-tooltip-meta", children: [
        spell.passive ? "被动技能" : "主动技能",
        spell.cooldownMs > 0 ? ` \xB7 基础冷却 ${spell.cooldownMs / 1e3} 秒` : ""
      ] })
    ] }),
    portalRoot || document.body
  );
}
function AbilitySamples({ spec, resolveAssetUrl }) {
  const [active, setActive] = useState(null);
  const activeRef = useRef(null);
  const spells = [spec.passive, ...spec.spells].filter(Boolean);
  const update = (next) => {
    activeRef.current = next;
    setActive(next);
  };
  const show = (spell, anchor) => update({ spell, anchor });
  useEffect(() => {
    const dismiss = (event) => {
      const current = activeRef.current;
      if (event.key === "Escape" || event.type === "pointerdown" && current && !current.anchor.contains(event.target)) {
        activeRef.current = null;
        setActive(null);
      }
    };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", dismiss);
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "coa-spellbook", children: [
    /* @__PURE__ */ jsx("p", { className: "coa-eyebrow", children: "技能示例" }),
    /* @__PURE__ */ jsx("div", { className: "coa-spell-select", role: "group", "aria-label": `${spec.name} signature abilities`, children: spells.map((spell) => /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        "aria-label": spell.name,
        "aria-describedby": active?.spell.id === spell.id ? `coa-tooltip-${spell.id}` : void 0,
        onPointerEnter: (event) => {
          if (event.pointerType !== "touch") show(spell, event.currentTarget);
        },
        onPointerLeave: () => update(null),
        onFocus: (event) => {
          if (event.currentTarget.matches(":focus-visible")) show(spell, event.currentTarget);
        },
        onBlur: () => update(null),
        children: [
          spell.icon ? /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(spell.icon), alt: "", width: "46", height: "46" }) : /* @__PURE__ */ jsx("span", { className: "coa-icon-empty", "aria-hidden": "true", children: spell.name.split(" ").map((word) => word[0]).slice(0, 2).join("") }),
          /* @__PURE__ */ jsx("span", { className: "coa-ability-ring", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "coa-sr-only", children: spell.name })
        ]
      },
      spell.id
    )) }),
    /* @__PURE__ */ jsx("p", { className: "coa-ability-hint", children: "悬停查看技能" }),
    active && /* @__PURE__ */ jsx(SpellTooltip, { active, resolveAssetUrl })
  ] });
}
AbilitySamples.propTypes = { spec: runtime_prop_types_default.object.isRequired, resolveAssetUrl: runtime_prop_types_default.func.isRequired };
SpellTooltip.propTypes = { active: runtime_prop_types_default.object.isRequired, resolveAssetUrl: runtime_prop_types_default.func.isRequired, children: runtime_prop_types_default.node, portalRoot: runtime_prop_types_default.object };

// FeatureModules/src/SubComponents/conquest/talentModel.js
var budget = (level) => [Math.floor((Math.max(0, level - 9) + 1) / 2), Math.floor(Math.max(0, level - 9) / 2)];
var ordered = (ranks) => Object.keys(ranks).map(Number).sort((a, b) => a - b);
var all = (ids, ranks) => ids.every((id) => ranks[id] > 0);
var any = (ids, ranks) => ids.some((id) => ranks[id] > 0);
function createTalentModel(catalog, spec, level, pending = {}) {
  const nodes = new Map(catalog.nodes.map((node) => [node.id, node]));
  const own = catalog.nodes.filter((node) => node.spec === 0 || node.spec === spec);
  const trained = {};
  for (const node of own.filter((entry) => entry.mode === 2 && entry.level <= level)) {
    node.spells.forEach((id, index) => {
      if (catalog.spells[id]?.level <= level) trained[node.id] = index + 1;
    });
  }
  const automatic = { ...trained };
  for (const node of own.filter(n => n.x >= 10)) { trained[node.id] = node.max; automatic[node.id] = node.max; }
  const total = { ...pending, ...automatic };
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of own) {
      if (node.mode === 1 && level >= node.level && !automatic[node.id] && all(node.required, total) && (!node.parents.length || any(node.parents, total))) {
        automatic[node.id] = node.max;
        total[node.id] = node.max;
        changed = true;
      }
    }
  }
  const spent = (ranks = pending) => Object.entries(ranks).reduce((points, [id, rank2]) => {
    const node = nodes.get(Number(id));
    return node && node.x < 10 ? [points[0] + rank2 * node.classCost, points[1] + rank2 * node.specCost] : points;
  }, [0, 0]);
  const validate = () => {
    const choices = /* @__PURE__ */ new Set();
    const result = (code, id = 0) => ({ code, id });
    for (const id of ordered(pending)) {
      const node = nodes.get(id);
      const rank2 = pending[id];
      if (!node) return result(5, id);
      if (!Number.isInteger(rank2) || rank2 < 1 || rank2 > node.max) return result(6, id);
      if (node.class !== catalog.classId) return result(7, id);
      if (node.spec && node.spec !== spec) return result(8, id);
      if (node.mode === 1 || node.mode === 2) return result(15, id);
      if (level < Math.max(10, node.level)) return result(9, id);
      if (node.group) {
        const key = `${node.spec}:${node.group}`;
        if (choices.has(key)) return result(11, id);
        choices.add(key);
      }
    }
    const used = spent();
    const available = budget(level);
    if (used.some((value, index) => value > available[index])) return result(10);
    for (const id of ordered(pending)) {
      const node = nodes.get(id);
      if (used[0] - pending[id] * node.classCost < node.classGate || used[1] - pending[id] * node.specCost < node.specGate) return result(14, id);
      if (!all(node.required, total)) return result(12, id);
    }
    const reached = { ...trained };
    let progress = true;
    while (progress) {
      progress = false;
      for (const id of ordered(total)) {
        const node = nodes.get(id);
        if (node && !reached[id] && all(node.required, reached) && (!node.parents.length || any(node.parents, reached))) {
          reached[id] = total[id];
          progress = true;
        }
      }
    }
    for (const id of ordered(pending)) if (!reached[id]) return result(13, id);
    return result(0);
  };
  const rank = (id) => nodes.get(id)?.x >= 10 ? automatic[id] || 0 : pending[id] || automatic[id] || 0;
  return { nodes, own, pending, automatic, total, spent, validate, rank, spec, level, catalog };
}
function pruneTalents(catalog, spec, level, pending) {
  const next = { ...pending };
  for (let i = 0; i <= catalog.nodes.length; i += 1) {
    const check = createTalentModel(catalog, spec, level, next).validate();
    if (!check.code || !check.id) return next;
    delete next[check.id];
  }
  return next;
}
function changeTalent(model, id, delta) {
  const node = model.nodes.get(id);
  if (!node || node.x >= 10 || node.mode === 1 || node.mode === 2) return { code: 15, id };
  const rank = (model.pending[id] || 0) + delta;
  if (rank < 0 || rank > node.max) return { code: 6, id };
  let next = { ...model.pending };
  if (delta > 0 && node.group) {
    for (const other of ordered(next)) {
      const entry = model.nodes.get(other);
      if (other !== id && entry.spec === node.spec && entry.group === node.group) delete next[other];
    }
  }
  if (rank) next[id] = rank;
  else delete next[id];
  if (delta < 0) next = pruneTalents(model.catalog, model.spec, model.level, next);
  const result = createTalentModel(model.catalog, model.spec, model.level, next).validate();
  return result.code ? result : { code: 0, pending: next };
}
function talentPrerequisites(model, node) {
  return [
    { ids: node.required, any: false },
    { ids: node.parents, any: true }
  ].filter((group) => group.ids.length).map((group) => ({
    ...group,
    names: group.ids.map((id) => model.nodes.get(id)?.name || "未收录天赋"),
    met: group.any ? group.ids.some((id) => model.rank(id) > 0) : group.ids.every((id) => model.rank(id) > 0)
  }));
}
function talentReason(model, node, code) {
  if (node.x >= 10) return "系统自动获得，无需加点";
  switch (code) {
    case 0:
      return model.rank(node.id) === node.max ? "已达最高等级" : "点击学习";
    case 6:
      return "已达最高等级";
    case 9:
      return `需要等级 ${Math.max(10, node.level)}`;
    case 10:
      return "天赋点数不足";
    case 11:
      return "在此组中选择一个天赋";
    case 12:
      return `需要 ${node.required.filter((id) => !model.rank(id)).map((id) => model.nodes.get(id)?.name || "未收录的天赋").join(" 且 ")}`;
    case 13:
      return `需要 ${node.parents.length > 1 ? "以下任意一项：" : ""}${node.parents.map((id) => model.nodes.get(id)?.name || "未收录的天赋").join(" 或 ")}`;
    case 14:
      return `需要 ${node.classGate || node.specGate} 点其他天赋`;
    case 15:
      return node.mode === 2 ? "训练技能 · 模拟器按已学习处理" : "满足条件后自动获得";
    default:
      return "当前无法学习此天赋";
  }
}

// FeatureModules/src/SubComponents/conquest/spellText.js
var plain = (text) => (text || "").replace(/\|c[\da-f]{8}|\|r/gi, "").replace(/\r\n?|\\n/g, "\n");
var number = (value) => Number.isFinite(value) ? String(Math.round(value * 100) / 100) : "\u3008unresolved value\u3009";
var variables = {
  AP: "Attack Power",
  RAP: "Ranged Attack Power",
  SP: "Spell Power",
  BH: "Healing Power",
  spfi: "Fire Spell Power",
  spa: "Arcane Spell Power",
  sps: "Shadow Spell Power",
  spfr: "Frost Spell Power",
  spna: "Nature Spell Power",
  spho: "Holy Spell Power",
  HEALTH: "Maximum Health",
  health: "Current Health",
  power1: "Current Mana",
  POWER1: "Maximum Mana",
  STR: "力量",
  AGI: "敏捷",
  INT: "智力",
  STA: "耐力",
  SPI: "精神"
};
function describeSpellText(result) {
  const stats = new Set(Object.values(variables));
  const amounts = [];
  const amount = (expression) => {
    const dependencies = [...new Set([...expression.matchAll(/〈([^〉]+)〉/g)].map((match) => match[1]).filter((name) => stats.has(name)))];
    amounts.push(dependencies);
    return `\uE000${amounts.length - 1}\uE001`;
  };
  let text = result.text;
  text = text.replace(/\$\[([^}\n]+)\}/g, (_, expression) => amount(expression));
  text = text.replace(
    /\((\d+(?:\.\d+)?)[–-](\d+(?:\.\d+)?) ÷ (\d+(?:\.\d+)?)\)/g,
    (_, low, high, divisor) => Number(divisor) ? `${number(Number(low) / Number(divisor))}\u2013${number(Number(high) / Number(divisor))}` : amount("")
  );
  for (const expression of [...result.expressions || []].sort((a, b) => b.length - a.length)) {
    if (text.includes(expression)) text = text.replaceAll(expression, amount(expression));
  }
  for (let offset = 0; offset < text.length; ) {
    const match = /\$\?[sSaApP]\d*/g;
    match.lastIndex = offset;
    const found = match.exec(text);
    if (!found) break;
    const yes = balanced(text, match.lastIndex, "[", "]");
    const no = yes && balanced(text, yes.end, "[", "]");
    if (!yes || !no) {
      offset = match.lastIndex;
      continue;
    }
    const replacement = "Additional conditional effects require in-game information.";
    text = text.slice(0, found.index) + replacement + text.slice(no.end);
    offset = found.index + replacement.length;
  }
  for (let start = 0; start < text.length; start += 1) {
    if (text[start] !== "(") continue;
    const expression = balanced(text, start, "(", ")");
    if (!expression || !expression.body.includes("\u3008")) continue;
    const syntax = expression.body.replace(/〈[^〉]+〉/g, "").replace(/\b(?:cond|gt|lt|gte|lte|eq|floor|ceil|abs|min|max)\b/g, "");
    if (!/^[\d\s.+\-*/÷^%=<>,?:!()[\]{}]*$/.test(syntax)) continue;
    const replacement = amount(expression.body);
    text = text.slice(0, start) + replacement + text.slice(expression.end);
    start += replacement.length - 1;
  }
  text = text.replace(/〈([^〉]+)〉/g, (_, key) => {
    if (stats.has(key)) return `your ${key}`;
    if (/^d$/i.test(key)) return "a variable duration";
    if (/^n\d*$/i.test(key)) return "a variable number of";
    return amount(`\u3008${key}\u3009`);
  });
  text = text.replace(/\$[^\s.,]+/g, () => amount(""));
  const basedOn = (index) => amounts[Number(index)].length ? `based on your ${amounts[Number(index)].join(" 且 ")}` : "that varies with the effect";
  text = text.replace(
    /\uE000(\d+)\uE001\s+((?:(?:Physical|Fire|Frost|Shadow|Holy|Nature|Arcane|Chaos|bleed)\s+)?damage|health|healing)\b/gi,
    (_, index, noun) => `${noun} ${basedOn(index)}`
  );
  text = text.replace(/\uE000(\d+)\uE001%/g, (_, index) => `a percentage ${basedOn(index)}`);
  text = text.replace(/\uE000(\d+)\uE001/g, (_, index) => `an amount ${basedOn(index)}`);
  text = text.replace(/See spell \d+\./g, "Additional ability details are unavailable.").replace(/\bspell \d+\b/gi, "An unavailable ability").replace(/\beffect \d+\b/gi, "an effect").replace(/\[With [^:\n]+: ; otherwise: \]/g, "");
  return { text, approximate: Boolean(result.symbolic) };
}
function balanced(text, start, open, close) {
  if (text[start] !== open) return null;
  let depth = 1;
  for (let i = start + 1; i < text.length; i += 1) {
    if (text[i] === open) depth += 1;
    if (text[i] === close && --depth === 0) return { body: text.slice(start + 1, i), end: i + 1 };
    if (text[i] !== close) continue;
  }
  return null;
}
function arithmetic(text) {
  const tokens = text.match(/\d+(?:\.\d+)?|\.\d+|[()+\-*/]/g) || [];
  if (tokens.join("") !== text.replace(/\s/g, "")) return null;
  let at = 0;
  const factor = () => {
    if (tokens[at] === "-") {
      at += 1;
      return -factor();
    }
    if (tokens[at] === "+") {
      at += 1;
      return factor();
    }
    if (tokens[at] === "(") {
      at += 1;
      const v = sum();
      if (tokens[at++] !== ")") throw new Error();
      return v;
    }
    const value = Number(tokens[at++]);
    if (!Number.isFinite(value)) throw new Error();
    return value;
  };
  const product = () => {
    let value = factor();
    while (tokens[at] === "*" || tokens[at] === "/") {
      const op = tokens[at++];
      const next = factor();
      value = op === "*" ? value * next : value / next;
    }
    return value;
  };
  const sum = () => {
    let value = product();
    while (tokens[at] === "+" || tokens[at] === "-") {
      const op = tokens[at++];
      const next = product();
      value = op === "+" ? value + next : value - next;
    }
    return value;
  };
  try {
    const result = sum();
    return at === tokens.length && Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}
function formatSpellText(catalog, id, { level, known = /* @__PURE__ */ new Set(), extended = false } = {}, chain = []) {
  const spell = catalog.spells[id];
  if (!spell) return { text: `Spell ${id} is unavailable in the exported catalog.`, embedded: [], extended: false, symbolic: true };
  if (chain.includes(id) || chain.length > 10) return { text: `See ${spell.name}.`, embedded: [], extended: false, symbolic: true };
  const context = { level, known, extended };
  const embedded = [];
  const expressions = [];
  let hasExtended = false;
  let symbolic = false;
  const defined = {};
  const variableText = catalog.lookups.spelldescriptionvariables[spell.variables]?.Variables || "";
  for (const match of variableText.matchAll(/^\$(\w+)=(.*)$/gm)) defined[match[1]] = match[2].trim();
  const numericToken = (key, sourceId, index, mathMode) => {
    const row = catalog.spells[sourceId || id];
    if (!row) {
      symbolic = true;
      return `\u3008spell ${sourceId} value\u3009`;
    }
    const effect = row.effects[(Number(index) || 1) - 1];
    const capped = row.maxLevel ? Math.min(level, row.maxLevel) : level;
    const levels = Math.max(0, capped - row.baseLevel);
    if (["w", "W"].includes(key)) {
      symbolic = true;
      return `\u3008current ${row.name} effect ${index || 1}\u3009`;
    }
    if (["s", "S", "m", "M"].includes(key) && effect) {
      const base = effect.EffectBasePoints + (key.toLowerCase() === "s" ? Math.trunc(levels * effect.EffectRealPointsPerLevel) : 0);
      const low = base + (effect.EffectDieSides > 0 ? 1 : effect.EffectDieSides);
      const high = base + (effect.EffectDieSides > 0 ? effect.EffectDieSides : 0);
      if (key === "M") return number(Math.abs(high));
      if (key === "s" || key === "S") return low !== high ? `${number(Math.abs(low))}\u2013${number(Math.abs(high))}` : number(Math.abs(low));
      return number(Math.abs(low));
    }
    if ((key === "ppl" || key === "PPL") && effect) return number(levels * effect.EffectRealPointsPerLevel);
    if ((key === "t" || key === "T") && effect) return number(effect.EffectAmplitude / 1e3);
    if ((key === "a" || key === "A") && effect) {
      const radius = catalog.lookups.spellradius[effect.EffectRadiusIndex];
      if (radius) return number(Math.min(radius.Radius + radius.RadiusPerLevel * level, radius.RadiusMax || Infinity));
    }
    if (key === "d" || key === "D") {
      const duration = catalog.lookups.spellduration[row.duration];
      if (duration) return duration.Duration === -1 ? "until cancelled" : `${number(Math.min(duration.Duration + duration.DurationPerLevel * level, duration.MaxDuration || Infinity) / 1e3)}${mathMode ? "" : " sec"}`;
    }
    if (key === "u" || key === "U") return number(row.stacks);
    if (key === "h" || key === "H") return number(row.procChance);
    if (key === "i" || key === "I") return number(row.targets);
    if ((key === "r" || key === "R") && effect) return number(effect.EffectMiscValue);
    symbolic = true;
    return `\u3008${variables[key + (index || "")] || variables[key] || key + (index || "")}\u3009`;
  };
  const format = (source, depth = 0, mathMode = false) => {
    if (depth > 14) {
      symbolic = true;
      return "\u3008nested value\u3009";
    }
    let text2 = plain(source);
    const tags = /@(ext|sim|ifknown|ifnotknown):((?:(?!@(ext|sim|ifknown|ifnotknown):)[\s\S])*?):\1@/g;
    for (let i = 0; i < 12 && /@(ext|sim|ifknown|ifnotknown):/.test(text2); i += 1) {
      const previous = text2;
      text2 = text2.replace(tags, (_, tag, body) => {
        if (tag === "ext") {
          hasExtended = true;
          return extended ? body.split("~")[0] : body.split("~")[1] || "";
        }
        if (tag === "sim") return body.split("~")[0];
        if (tag === "ifknown") {
          const split2 = body.indexOf(":");
          return known.has(Number(body.slice(0, split2))) ? body.slice(split2 + 1) : "";
        }
        const split = body.lastIndexOf(":");
        return !known.has(Number(body.slice(split + 1))) ? body.slice(0, split) : "";
      });
      if (text2 === previous) break;
    }
    text2 = text2.replace(/@(s|re):(\d+):(-?\d+)@/g, (_, tag, reference, flags) => {
      const mask = Number(flags) < 0 ? -Number(flags) : 0;
      if (mask & 4) hasExtended = true;
      if (mask & 4 && !extended || mask & 8 && extended) return "";
      const child = catalog.spells[reference];
      if (!child) {
        symbolic = true;
        return `See spell ${reference}.`;
      }
      const result = formatSpellText(catalog, Number(reference), context, [...chain, id]);
      hasExtended || (hasExtended = result.extended);
      symbolic || (symbolic = result.symbolic);
      embedded.push({ spell: child, result, nameOnly: Boolean(mask & 1), descriptionOnly: Boolean(mask & 2) && !(mask & 1) });
      return "";
    });
    text2 = text2.replace(/@(req|learns|unlockby|replaces|usewith|nousewith):(\d+)@/g, (_, tag, ref) => {
      const labels = { req: "Requires", learns: "Teaches", unlockby: "Unlocked by", replaces: "Replaces", usewith: "Use with", nousewith: "Cannot use with" };
      return `${labels[tag]}: ${catalog.spells[ref]?.name || `spell ${ref}`}`;
    });
    for (let offset = 0; offset < text2.length; ) {
      const match = /\$\?([sSaApP])(\d+)/g;
      match.lastIndex = offset;
      const found = match.exec(text2);
      if (!found) break;
      const yes = balanced(text2, match.lastIndex, "[", "]");
      const no = yes && balanced(text2, yes.end, "[", "]");
      if (!yes || !no) {
        offset = match.lastIndex;
        continue;
      }
      let result;
      if (found[1].toLowerCase() === "s") result = known.has(Number(found[2])) ? yes.body : no.body;
      else {
        symbolic = true;
        result = `[With ${catalog.spells[found[2]]?.name || `effect ${found[2]}`}: ${yes.body}; otherwise: ${no.body}]`;
      }
      const rendered = format(result, depth + 1);
      text2 = text2.slice(0, found.index) + rendered + text2.slice(no.end);
      offset = found.index + rendered.length;
    }
    for (let i = 0; i < 14 && text2.includes("${"); i += 1) {
      const start = text2.lastIndexOf("${");
      const expression = balanced(text2, start + 1, "{", "}");
      if (!expression) break;
      const body = format(expression.body, depth + 1, true);
      const result = arithmetic(body);
      if (result === null) symbolic = true;
      const precision = /^\.(\d)/.exec(text2.slice(expression.end));
      const rendered = result === null ? `(${body})` : mathMode ? String(result) : precision ? result.toFixed(Number(precision[1])) : number(result);
      if (result === null) expressions.push(rendered);
      text2 = text2.slice(0, start) + rendered + text2.slice(expression.end + (precision?.[0].length || 0));
    }
    text2 = text2.replace(/\$<([^>]+)>/g, (_, name) => defined[name] ? format(defined[name], depth + 1, mathMode) : (symbolic = true, `\u3008${name}\u3009`));
    text2 = text2.replace(/\$([*/]?)(\d+(?:\.\d+)?);((?:\d+)?[a-zA-Z]+\d*)/g, (_, operator, factor, token) => {
      const resolved = format("$" + token, depth + 1, true);
      const multiply = operator === "*";
      const value = arithmetic(`(${resolved})${multiply ? "*" : "/"}${factor}`);
      const rendered = `(${resolved} ${multiply ? "*" : "\xF7"} ${factor})`;
      if (value === null) expressions.push(rendered);
      return value === null ? rendered : mathMode ? String(value) : number(value);
    });
    text2 = text2.replace(/\$PL\b/g, String(level));
    text2 = text2.replace(/\$(\d+)?(ppl|PPL|[sSmMtTaAdDuUhHiIrRwW])(\d)?\b/g, (_, ref, key, index) => numericToken(key, Number(ref), index, mathMode));
    text2 = text2.replace(/(\d+(?:\.\d+)?)(\s*)\$l([^:;]*):([^;]*);/g, (_, count, gap, one, many) => count + gap + (Number(count) === 1 ? one : many));
    text2 = text2.replace(/\$l([^:;]*):([^;]*);/g, (_, one, many) => {
      symbolic = true;
      return `${one}/${many}`;
    });
    text2 = text2.replace(/\$([a-zA-Z][a-zA-Z\d]*)/g, (_, key) => {
      symbolic = true;
      return `\u3008${variables[key] || key}\u3009`;
    });
    text2 = text2.replace(/\$(\d+)([a-zA-Z]+\d*)/g, (_, ref, key) => {
      symbolic = true;
      return `\u3008${catalog.spells[ref]?.name || `spell ${ref}`} ${key}\u3009`;
    });
    return text2.replace(/\n{3,}/g, "\n\n").trim();
  };
  const text = format(spell.rawDescription);
  return { text: text || (embedded.length ? "" : "No description in the source spell record."), embedded, expressions, extended: hasExtended, symbolic };
}

// FeatureModules/src/SubComponents/conquest/talentAssets.js
var catalogs = /* @__PURE__ */ new Map();
var requests = /* @__PURE__ */ new Map();
var warmedImages = /* @__PURE__ */ new Set();
function cachedTalentCatalog(url) {
  return catalogs.get(url);
}
function acquireTalentCatalog(url,classId){const slug=url.match(/([^/]+)\.json$/)[1];if(catalogs.has(url))return {promise:Promise.resolve(catalogs.get(url)),release(){}};const promise=window.COA_NATIVE_LOAD_CATALOG(slug).then(data=>{catalogs.set(url,data);return data});return {promise,release(){}};}
function talentImageSources(catalog, specId) {
  const sources = /* @__PURE__ */ new Set([catalog.backgrounds?.[specId]]);
  for (const [key, path] of Object.entries(catalog.ui || {})) if (!key.startsWith("choice-")) sources.add(path);
  for (const node of catalog.nodes) {
    if (node.spec !== 0 && node.spec !== specId) continue;
    sources.add(catalog.ui?.[`choice-group-${node.class}-${node.spec}-${node.group}`]);
    for (const spellId of node.spells) {
      sources.add(catalog.spells[spellId]?.icon);
      sources.add(catalog.ui?.[`choice-spell-${spellId}`]);
    }
  }
  return [...sources].filter(Boolean);
}
function warmTalentImages(sources, signal) {
  const queue = [...new Set(sources)].filter((src) => !warmedImages.has(src));
  const next = async () => {
    while (!signal.aborted && queue.length) {
      const src = queue.shift();
      if (warmedImages.has(src)) continue;
      const image = new Image();
      image.fetchPriority = "low";
      image.decoding = "async";
      const cancel = () => image.removeAttribute("src");
      signal.addEventListener("abort", cancel, { once: true });
      try {
        image.src = src;
        await image.decode();
        if (!signal.aborted) warmedImages.add(src);
      } catch {
      } finally {
        signal.removeEventListener("abort", cancel);
      }
    }
  };
  return Promise.all([next(), next()]);
}

// FeatureModules/src/SubComponents/conquest/TalentPlanner.jsx
var UI2 = "/Web/Features/conquest-of-azeroth/creation-ui/";
var FRAME = ["tl", "tr", "bl", "br", "top", "bottom", "left", "right"];
function SourceDescription({ result, resolveAssetUrl }) {
  const description = describeSpellText(result);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    description.text && /* @__PURE__ */ jsx("p", { className: "coa-talent-spell-text", children: description.text }),
    result.embedded.map((entry, index) => /* @__PURE__ */ jsxs("div", { className: "coa-talent-embedded", children: [
      /* @__PURE__ */ jsx("img", { className: "coa-tooltip-divider", src: resolveAssetUrl("/Web/Features/conquest-of-azeroth/talent-ui/tooltip-divider.webp"), alt: "" }),
      !entry.descriptionOnly && /* @__PURE__ */ jsxs("div", { children: [
        entry.spell.icon && /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(entry.spell.icon), alt: "", width: "20", height: "20" }),
        /* @__PURE__ */ jsx("strong", { children: entry.spell.name })
      ] }),
      !entry.nameOnly && /* @__PURE__ */ jsx(SourceDescription, { result: entry.result, resolveAssetUrl })
    ] }, `${entry.spell.id}-${index}`))
  ] });
}
function TalentCanvas({ catalog, character, spec, resolveAssetUrl, play, active, portalRoot }) {
  const [build, setBuild] = useState(()=>{try{const s=JSON.parse(localStorage.getItem(catalog.localStorageKey)||'null');if(s){const reverse=catalog.localSpecMap;const pending=Object.fromEntries((s.ranks||[]).filter(([id])=>catalog.nodes.some(n=>n.id===id&&n.x<10)));return {spec:reverse[String(s.spec)]||spec.id,level:s.level||catalog.maxLevel,pending}}}catch{}return {spec:spec.id,level:catalog.maxLevel,pending:{}}});
  useEffect(()=>{try{const localSpec=Object.keys(catalog.localSpecMap).find(k=>catalog.localSpecMap[k]===build.spec);const previous=JSON.parse(localStorage.getItem(catalog.localStorageKey)||'null')||{};const own=new Set(catalog.nodes.filter(n=>n.spec===0||n.spec===build.spec).map(n=>n.id));const others=(previous.ranks||[]).filter(([id])=>!own.has(id));localStorage.setItem(catalog.localStorageKey,JSON.stringify({spec:Number(localSpec),level:build.level,ranks:[...others,...Object.entries(build.pending).map(([id,r])=>[Number(id),r])]}))}catch{}},[build,catalog]);
  const [hovered, setHovered] = useState(null);
  const [choice, setChoice] = useState(null);
  const [selected, setSelected] = useState(null);
  const [extended, setExtended] = useState(false);
  const [message, setMessage] = useState("");
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(false);
  const shell = useRef(null);
  const choiceTimer = useRef(null);
  const hoveredRef = useRef(null);
  const model = useMemo(() => createTalentModel(catalog, spec.id, build.level, build.spec === spec.id ? build.pending : Object.fromEntries(Object.entries(build.pending).filter(([id]) => catalog.nodes.find((node) => node.id === Number(id))?.spec === 0))), [catalog, spec.id, build]);
  const used = model.spent();
  const points = budget(build.level);
  const groupsByTree = useMemo(() => Object.fromEntries(["class", "spec"].map((tree) => {
    const groups = /* @__PURE__ */ new Map();
    for (const node of model.own.filter((entry) => entry.spec === (tree === "class" ? 0 : spec.id))) {
      const key = node.group ? `g${node.group}` : `n${node.id}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(node);
    }
    return [tree, [...groups.values()].sort((a, b) => a[0].y - b[0].y || a[0].x - b[0].x)];
  })), [model, spec.id]);
  const known = useMemo(() => new Set(Object.entries(model.total).flatMap(([id, rank]) => model.nodes.get(Number(id)).spells.slice(0, rank))), [model]);
  const activeNode = hovered && model.nodes.get(hovered.id);
  const activeSpell = activeNode && catalog.spells[activeNode.spells[Math.min(activeNode.max, Math.max(1, model.rank(activeNode.id) + 1)) - 1]];
  const description = activeSpell && formatSpellText(catalog, activeSpell.id, { level: build.level, known, extended });
  const activeCheck = activeNode && changeTalent(model, activeNode.id, 1);
  const prerequisites = activeNode ? talentPrerequisites(model, activeNode) : [];
  const prerequisiteIds = new Set(prerequisites.flatMap((group) => group.ids));
  const ui = (file) => resolveAssetUrl(UI2 + file);
  const art = (key) => catalog.ui[key] ? resolveAssetUrl(catalog.ui[key]) : void 0;
  const updateHover = (next) => {
    hoveredRef.current = next;
    setHovered(next);
  };
  const hideTooltip = () => updateHover(null);
  const show = (node, anchor) => {
    updateHover({ id: node.id, anchor });
    setSelected(node.id);
  };
  const purchase = (node, delta) => {
    if (node.x >= 10) return;
    const result = changeTalent(model, node.id, delta);
    setSelected(node.id);
    if (result.code) setMessage(talentReason(model, node, result.code));
    else {
      setBuild((current) => ({ ...current, spec: spec.id, pending: result.pending }));
      setMessage(`${node.name}: rank ${result.pending[node.id] || 0}/${node.max}`);
      play();
    }
  };
  useEffect(() => {
    setBuild((current) => current.spec === spec.id ? current : {
      ...current,
      spec: spec.id,
      pending: pruneTalents(catalog, spec.id, current.level, Object.fromEntries(Object.entries(current.pending).filter(([id]) => catalog.nodes.find((node) => node.id === Number(id))?.spec === 0)))
    });
    updateHover(null);
    setChoice(null);
    setSelected(null);
    setMessage("");
  }, [spec.id, catalog]);
  useEffect(() => {
    if (!active) {
      updateHover(null);
      setChoice(null);
      setExtended(false);
    }
  }, [active]);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setScale(Math.min(1, (entry.contentRect.width - 12) / 1294));
    });
    observer.observe(shell.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const key = (event) => {
      if (event.key === "Shift") setExtended(event.type === "keydown");
      if (event.key === "Escape") {
        updateHover(null);
        setChoice(null);
      }
    };
    const pointer = (event) => {
      const current = hoveredRef.current;
      if (!event.target.closest(".coa-talent-node, .coa-talent-choice")) {
        updateHover(null);
        setChoice(null);
      } else if (current && !current.anchor.isConnected) updateHover(null);
    };
    const blur = () => {
      setExtended(false);
      updateHover(null);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("keyup", key);
    document.addEventListener("pointerdown", pointer);
    window.addEventListener("blur", blur);
    return () => {
      clearTimeout(choiceTimer.current);
      document.removeEventListener("keydown", key);
      document.removeEventListener("keyup", key);
      document.removeEventListener("pointerdown", pointer);
      window.removeEventListener("blur", blur);
    };
  }, []);
  const renderTree = (tree) => {
    const groupEntries = groupsByTree[tree];
    const currentNodes = /* @__PURE__ */ new Map();
    const entries = groupEntries.map((group) => {
      const node = group.find((entry) => model.rank(entry.id)) || group[0];
      for (const alternative of group) currentNodes.set(alternative.id, node);
      return { node, group };
    });
    const gateRows = /* @__PURE__ */ new Map();
    for (const { node } of entries) {
      const gate = tree === "class" ? node.classGate : node.specGate;
      if (gate) gateRows.set(gate, Math.min(gateRows.get(gate) ?? Infinity, node.y));
    }
    const spent = used[tree === "class" ? 0 : 1];
    const nextGate = [...gateRows.keys()].filter((gate) => gate > spent).sort((a, b) => a - b)[0];
    const treeX = tree === "class" ? 128 : 135;
    const lines = [];
    const drawn = /* @__PURE__ */ new Set();
    for (const { node, group } of entries) for (const variant of group) for (const id of variant.parents) {
      const parent = currentNodes.get(id);
      if (!parent || parent.id === node.id) continue;
      const key = `${parent.id}:${node.id}`;
      if (drawn.has(key)) continue;
      drawn.add(key);
      const x1 = treeX + 14 + parent.x * 44;
      const y1 = 110 + 14 + parent.y * 44;
      const x2 = treeX + 14 + node.x * 44;
      const y2 = 110 + 14 + node.y * 44;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const gated = node.classGate > used[0] || node.specGate > used[1];
      const active2 = model.rank(id) > 0;
      const color = gated ? "locked" : active2 ? "yellow" : "gray";
      const offset = node.shape === "SpendSquare" ? 7 + 2 * (Math.abs((angle - Math.PI / 2) % (Math.PI / 2)) - Math.PI / 4) : 4;
      lines.push(/* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx("line", { x1, y1, x2, y2, stroke: "#000", strokeWidth: "4" }),
        /* @__PURE__ */ jsx("line", { x1, y1, x2, y2, stroke: gated ? "#333" : active2 ? "#a68a0f" : "#4d4d4d", strokeWidth: "2" }),
        /* @__PURE__ */ jsx(
          "image",
          {
            href: art(`talents-arrow-head-${color}`),
            x: "-12",
            y: "-12",
            width: "24",
            height: "24",
            transform: `translate(${x2 - dx / length * (15 + offset)},${y2 - dy / length * (15 + offset)}) rotate(${angle * 180 / Math.PI - 90})`
          }
        )
      ] }, key));
    }
    const nodeButton = (node, group, subnode = false) => {
      const rank = model.rank(node.id);
      const check = changeTalent(model, node.id, 1);
      const isChoice = !subnode && group.length > 1;
      const shape = isChoice || !subnode && node.shape === "SpendHex" ? "choice" : node.shape === "SpendSquare" ? "square" : "circle";
      const prerequisite = group.some((entry) => prerequisiteIds.has(entry.id));
      const state = rank ? rank === node.max ? "yellow" : "green" : node.mode === 0 || node.mode === 3 ? check.code ? "locked" : "green" : "gray";
      const spell = catalog.spells[node.spells[Math.max(0, rank - 1)]];
      const choiceKey = isChoice && !rank ? `choice-group-${node.class}-${node.spec}-${node.group}` : `choice-spell-${spell.id}`;
      const icon = shape === "choice" && catalog.ui[choiceKey] ? art(choiceKey) : spell.icon ? resolveAssetUrl(spell.icon) : art("questionmark");
      return /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: `coa-talent-node coa-node-${shape} coa-node-${state}${subnode ? " coa-node-flyout" : ""}`,
          "data-node": node.id,
          "aria-disabled": node.x >= 10 || undefined,
          "data-rank": rank,
          "data-max": node.max,
          "data-state": state,
          "aria-label": `${isChoice ? "选择天赋：" : ""}${node.name}，等级 ${rank} / ${node.max}`,
          "data-prerequisite-for": prerequisite ? activeNode.id : void 0,
          "aria-describedby": hovered?.id === node.id && !isChoice ? `coa-talent-tooltip-${node.id}` : void 0,
          "aria-haspopup": isChoice ? "dialog" : void 0,
          "aria-expanded": isChoice ? choice?.[0].id === group[0].id : void 0,
          style: subnode ? void 0 : { left: treeX + node.x * 44 - 1, top: 110 + node.y * 44 - 1 },
          onPointerEnter: (event) => {
            clearTimeout(choiceTimer.current);
            if (!isChoice && !subnode) setChoice(null);
            if (isChoice) {
              updateHover(null);
              setChoice(group);
            } else if (event.pointerType !== "touch") show(node, event.currentTarget);
          },
          onPointerLeave: () => {
            hideTooltip();
            if (isChoice) choiceTimer.current = setTimeout(() => setChoice(null), 150);
          },
          onFocus: (event) => {
            if (!isChoice && event.currentTarget.matches(":focus-visible")) show(node, event.currentTarget);
          },
          onBlur: hideTooltip,
          onClick: () => {
            if (isChoice) {
              setChoice(group);
              updateHover(null);
            } else {
              purchase(node, 1);
              if (subnode) {
                setChoice(null);
                updateHover(null);
              }
            }
          },
          onContextMenu: (event) => {
            event.preventDefault();
            purchase(node, -1);
            if (subnode) {
              setChoice(null);
              updateHover(null);
            }
          },
          onKeyDown: (event) => {
            if (event.key === "Delete" || event.key === "Backspace") {
              event.preventDefault();
              purchase(node, -1);
            }
            if (isChoice && event.key === "ArrowDown") {
              event.preventDefault();
              setChoice(group);
              requestAnimationFrame(() => shell.current.querySelector(".coa-talent-choice button")?.focus());
            }
          },
          children: [
            /* @__PURE__ */ jsx("img", { className: "coa-node-shadow", src: art(`talents-node-${subnode ? "choiceflyout-" : ""}${shape === "choice" && subnode ? "circle" : shape}-shadow`), alt: "" }),
            icon ? /* @__PURE__ */ jsx("img", { className: "coa-node-icon", src: icon, alt: "", width: "30", height: "30" }) : /* @__PURE__ */ jsx("span", { className: "coa-node-icon coa-node-missing", "aria-hidden": "true", children: "?" }),
            /* @__PURE__ */ jsx("img", { className: "coa-node-border", src: art(`talents-node-${subnode ? "choiceflyout-" : ""}${shape === "choice" && subnode ? "circle" : shape}-${state}`), alt: "" }),
            subnode && /* @__PURE__ */ jsx("img", { className: "coa-node-border coa-node-choice-highlight", src: art(`talents-node-choiceflyout-${shape}-${state}`), alt: "" }),
            prerequisite && /* @__PURE__ */ jsx("img", { className: "coa-node-border coa-node-prerequisite-glow", src: art(`talents-node-${subnode ? "choiceflyout-" : ""}${shape === "choice" && subnode ? "circle" : shape}-yellow`), alt: "" }),
            !(isChoice && !rank) && (node.max > 1 || rank || state === "green") ? /* @__PURE__ */ jsxs("span", { className: "coa-node-rank", children: [
              rank,
              "/",
              node.max
            ] }) : null
          ]
        },
        node.id
      );
    };
    return /* @__PURE__ */ jsxs("div", { className: `coa-talent-canvas coa-talent-${tree}`, role: "region", "aria-label": `${tree === "class" ? character.name : spec.name} talent tree`, children: [
      /* @__PURE__ */ jsxs("div", { className: "coa-talent-tree-title", children: [
        /* @__PURE__ */ jsx("h3", { children: tree === "class" ? character.name : spec.name }),
        /* @__PURE__ */ jsx("span", { children: points[tree === "class" ? 0 : 1] - spent }),
        /* @__PURE__ */ jsx("small", { children: "可用点数" })
      ] }),
      tree === "spec" && /* @__PURE__ */ jsx("img", { className: "coa-talent-passives", src: art("ca-passive-bg"), alt: "" }),
      /* @__PURE__ */ jsx("svg", { className: "coa-talent-lines", width: "640", height: "640", "aria-hidden": "true", children: lines }),
      entries.map(({ node, group }) => nodeButton(node, group)),
      nextGate && /* @__PURE__ */ jsxs("div", { className: "coa-talent-gate", style: {
        top: 110 + gateRows.get(nextGate) * 44 + 7,
        left: treeX + Math.min(...entries.filter(({ node }) => node.y === gateRows.get(nextGate)).map(({ node }) => node.x)) * 44 - 99
      }, children: [
        /* @__PURE__ */ jsx("span", { children: nextGate - spent }),
        /* @__PURE__ */ jsx("img", { src: art("talents-gate"), alt: "", width: "84", height: "14" })
      ] }),
      choice && choice[0].spec === (tree === "class" ? 0 : spec.id) && /* @__PURE__ */ jsx(
        "div",
        {
          className: "coa-talent-choice",
          role: "dialog",
          "aria-label": "Choose a talent",
          style: { width: choice.length * 42 + 40, left: Math.max(4, Math.min(640 - choice.length * 42 - 40, treeX + choice[0].x * 44 - choice.length * 21 - 6)), top: 110 + choice[0].y * 44 - 79 },
          onPointerEnter: () => clearTimeout(choiceTimer.current),
          onPointerLeave: () => {
            hideTooltip();
            choiceTimer.current = setTimeout(() => setChoice(null), 150);
          },
          children: choice.map((node) => nodeButton(node, [node], true))
        }
      )
    ] }, tree);
  };
  const selectedNode = selected && model.nodes.get(selected);
  useLayoutEffect(() => {
    portalRoot?.style.setProperty("--talent-scale", scale);
  }, [portalRoot, scale]);
  const buttonArt = Object.fromEntries(["left", "center", "right"].flatMap((part) => ["", "-pressed"].map((suffix) => [`--button-${part}${suffix}`, `url("${art(`${part === "center" ? "_" : ""}ui-dialogbox-button-${part}${suffix}`)}")`])));
  const fittedControls = scale < 0.85 && !zoom;
  const displayScale = zoom ? 1 : scale;
  const fittedFooterHeight = scale < 0.25 ? 106 : 90;
  const windowHeight = fittedControls ? 600 + fittedFooterHeight / scale : 666;
  return /* @__PURE__ */ jsxs("section", { className: "coa-talent-planner", "aria-label": `${spec.name} interactive talent preview`, ref: shell, children: [
    /* @__PURE__ */ jsx("div", { className: `coa-talent-scaled${zoom ? " coa-talent-zoomed" : ""}`, style: { height: windowHeight * displayScale + 16 }, children: /* @__PURE__ */ jsxs("div", { className: `coa-talent-window${fittedControls ? " coa-talent-fit-controls" : ""}`, style: { height: windowHeight, transform: `scale(${displayScale})`, "--talent-content-scale": displayScale, "--talent-fitted-footer-height": `${fittedFooterHeight}px`, "--talent-background": `url("${resolveAssetUrl(catalog.backgrounds[spec.id])}")`, "--talent-footer": `url("${art("talents-background-bottombar")}")` }, children: [
      /* @__PURE__ */ jsx("span", { className: "creation-frame-title", "aria-hidden": "true", style: { backgroundImage: `url("${ui("frame-title.webp")}")` } }),
      /* @__PURE__ */ jsx("span", { className: "creation-frame-streak", "aria-hidden": "true", style: { backgroundImage: `url("${ui("frame-streak.webp")}")` } }),
      /* @__PURE__ */ jsx("img", { className: "creation-frame-portrait", src: ui(`${character.slug}.webp`), alt: "", width: "61", height: "61" }),
      /* @__PURE__ */ jsx("span", { className: "creation-frame-caption", children: "征服艾泽拉斯 — 天赋" }),
      /* @__PURE__ */ jsx("div", { className: "creation-frame-art", "aria-hidden": "true", children: FRAME.map((part) => /* @__PURE__ */ jsx("span", { className: `creation-frame-${part}`, style: { backgroundImage: `url("${ui(`frame-${part}.webp`)}")` } }, part)) }),
      renderTree("class"),
      renderTree("spec"),
      /* @__PURE__ */ jsx("div", { className: "coa-talent-footer", children: /* @__PURE__ */ jsxs("div", { className: "coa-talent-footer-content", children: [
        /* @__PURE__ */ jsxs("div", { className: "coa-talent-footer-tools", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            used[0],
            "/",
            points[0],
            " 职业 · ",
            used[1],
            "/",
            points[1],
            " 专精"
          ] }),
          scale < 0.85 && /* @__PURE__ */ jsx("button", { type: "button", className: "coa-native-button coa-talent-zoom", style: buttonArt, "aria-pressed": zoom, onClick: () => {
            setZoom((value) => !value);
            updateHover(null);
          }, children: zoom ? "适应窗口" : "放大天赋树" }),
          selectedNode && model.pending[selectedNode.id] > 0 && /* @__PURE__ */ jsx("button", { type: "button", className: "coa-native-button coa-talent-unlearn-button", style: buttonArt, onClick: () => purchase(selectedNode, -1), "aria-label": `Unlearn ${selectedNode.name}`, children: "Unlearn" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "coa-talent-footer-actions", children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "coa-native-button", style: buttonArt, onClick: () => {
            setBuild((current) => ({ ...current, pending: {} }));
            updateHover(null);
            setChoice(null);
            setMessage("天赋已重置。");
          }, children: "重置天赋" }),
          /* @__PURE__ */ jsxs("label", { children: [
            "等级 ",
            /* @__PURE__ */ jsx("select", { "aria-label": "天赋模拟等级", value: build.level, onChange: (event) => {
              setBuild({ spec: spec.id, level: Number(event.target.value), pending: {} });
              setMessage("等级已切换，天赋已重置。");
              updateHover(null);
              setChoice(null);
            }, children: Array.from({ length: catalog.maxLevel - 9 }, (_, i) => /* @__PURE__ */ jsx("option", { value: i + 10, children: i + 10 }, i + 10)) })
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("span", { className: "coa-sr-only", role: "status", children: message }),
    active && activeSpell && /* @__PURE__ */ jsxs(SpellTooltip, { portalRoot, active: { spell: activeSpell, anchor: hovered.anchor, tooltipId: `coa-talent-tooltip-${activeNode.id}`, avoidSelector: `[data-prerequisite-for="${activeNode.id}"]` }, resolveAssetUrl, children: [
      /* @__PURE__ */ jsx(SourceDescription, { result: description, resolveAssetUrl }),
      description.extended && /* @__PURE__ */ jsx("div", { className: "coa-tooltip-extended", children: extended ? "松开 Shift 收起扩展信息" : "按住 Shift 查看更多信息" }),
      /* @__PURE__ */ jsxs("div", { className: "coa-talent-tooltip-rank", children: [
        "等级 ",
        model.rank(activeNode.id),
        "/",
        activeNode.max,
        model.rank(activeNode.id) < activeNode.max ? " · 显示下一等级" : ""
      ] }),
      /* @__PURE__ */ jsx("div", { className: activeCheck.code ? "coa-talent-requirement" : "coa-talent-learn", children: talentReason(model, activeNode, activeCheck.code) }),
      prerequisites.map((group) => /* @__PURE__ */ jsxs("div", { className: `coa-talent-prerequisites ${group.met ? "coa-prerequisite-met" : "coa-prerequisite-missing"}`, children: [
        group.any && group.names.length > 1 ? "需要以下任意天赋：" : "需要：",
        group.names.join(group.any ? " 或 " : " 且 ")
      ] }, group.any ? "parents" : "required")),
      model.pending[activeNode.id] > 0 && /* @__PURE__ */ jsx("div", { className: "coa-talent-unlearn", children: "右键点击或按 Delete 退点" })
    ] })
  ] });
}
function TalentCatalog(props) {
  const { character, resolveAssetUrl } = props;
  const url = resolveAssetUrl(`/Web/content/features/conquest-talents/${character.slug}.json`);
  const [state, setState] = useState({ url, data: cachedTalentCatalog(url), error: false });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (cachedTalentCatalog(url)) {
      setState({ url, data: cachedTalentCatalog(url), error: false });
      return void 0;
    }
    let cancelled = false;
    const request = acquireTalentCatalog(url, character.classId);
    setState({ url, data: null, error: false });
    request.promise.then((data) => {
      if (!cancelled) setState({ url, data, error: false });
    }).catch((error) => {
      if (!cancelled && error.name !== "AbortError") setState({ url, data: null, error: true });
    });
    return () => {
      cancelled = true;
      request.release();
    };
  }, [url, character.classId, attempt]);
  if (state.error && state.url === url) return /* @__PURE__ */ jsxs("div", { className: "coa-talent-loading", role: "alert", children: [
    "天赋资料加载失败。",
    /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setAttempt((value) => value + 1), children: "重新加载" })
  ] });
  if (!state.data || state.url !== url) return /* @__PURE__ */ jsx("div", { className: "coa-talent-loading", role: "status", children: "正在加载天赋树…" });
  return /* @__PURE__ */ jsx(TalentCanvas, { ...props, catalog: state.data }, character.slug);
}
function TalentPlanner(props) {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const dialog = useRef(null);
  const launcher = useRef(null);
  const { character, spec, resolveAssetUrl, play } = props;
  useEffect(() => {
    const connection = navigator.connection;
    if (!props.prefetchReady || connection?.saveData || ["slow-2g", "2g"].includes(connection?.effectiveType)) return void 0;
    const controller = new AbortController();
    let request;
    const start = async () => {
      if (controller.signal.aborted) return;
      const url = resolveAssetUrl(`/Web/content/features/conquest-talents/${character.slug}.json`);
      request = acquireTalentCatalog(url, character.classId, "low");
      try {
        const catalog = await request.promise;
        if (!controller.signal.aborted) await warmTalentImages(talentImageSources(catalog, spec.id).map(resolveAssetUrl), controller.signal);
      } catch {
      }
    };
    const idle = window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 2e3 }) : window.setTimeout(start, 300);
    return () => {
      if (window.requestIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      controller.abort();
      request?.release();
    };
  }, [character.slug, character.classId, spec.id, resolveAssetUrl, props.prefetchReady]);
  const art = (key) => resolveAssetUrl(`/Web/Features/conquest-of-azeroth/talent-ui/${key}.webp`);
  const buttonArt = Object.fromEntries(["left", "center", "right"].flatMap((part) => ["", "-pressed"].map((suffix) => [`--button-${part}${suffix}`, `url("${art(`${part === "center" ? "_" : ""}ui-dialogbox-button-${part}${suffix}`)}")`])));
  useLayoutEffect(() => {
    const element = dialog.current;
    const trigger = launcher.current;
    if (!open) {
      if (element.open) element.close();
      return void 0;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const embeddingFrame = window.frameElement;
    if (embeddingFrame) {
      embeddingFrame.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
      element.style.setProperty("--coa-embed-viewport-height", Math.min(window.innerHeight, window.parent.innerHeight) + "px");
    }
    element.showModal();
    element.querySelector(".coa-talent-close")?.focus({ preventScroll: true });
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);
  return /* @__PURE__ */ jsxs("div", { className: "creation-talent-launch", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        ref: launcher,
        className: "coa-native-button coa-talent-open",
        style: buttonArt,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        onClick: () => {
          setOpened(true);
          setOpen(true);
          play();
        },
        children: "打开天赋菜单"
      }
    ),
    createPortal(/* @__PURE__ */ jsxs(
      "dialog",
      {
        ref: dialog,
        className: "coa-talent-dialog",
        "aria-label": `${character.name} \xB7 ${spec.name} talent menu`,
        onCancel: (event) => {
          event.preventDefault();
          setOpen(false);
        },
        onKeyDown: (event) => {
          if (event.key !== "Tab") return;
          const controls = [...event.currentTarget.querySelectorAll('button:not([disabled]), select:not([disabled]), [tabindex="0"]')].filter((element) => element.getClientRects().length);
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        },
        onClick: (event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setOpen(false);
        },
        children: [
          opened && /* @__PURE__ */ jsx(TalentCatalog, { ...props, active: open, portalRoot: dialog.current }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "coa-talent-close",
              "aria-label": "关闭天赋菜单",
              onClick: () => setOpen(false),
              style: { "--close-up": `url("${art("close-button")}")`, "--close-down": `url("${art("close-button-pressed")}")`, "--close-highlight": `url("${art("close-button-highlight")}")` }
            }
          )
        ]
      }
    ), document.body)
  ] });
}
var plannerTypes = { character: runtime_prop_types_default.object.isRequired, spec: runtime_prop_types_default.object.isRequired, resolveAssetUrl: runtime_prop_types_default.func.isRequired, play: runtime_prop_types_default.func.isRequired, prefetchReady: runtime_prop_types_default.bool };
TalentPlanner.propTypes = plannerTypes;
TalentCatalog.propTypes = { ...plannerTypes, active: runtime_prop_types_default.bool, portalRoot: runtime_prop_types_default.object };
TalentCanvas.propTypes = { ...TalentCatalog.propTypes, catalog: runtime_prop_types_default.object.isRequired };
SourceDescription.propTypes = { result: runtime_prop_types_default.object.isRequired, resolveAssetUrl: runtime_prop_types_default.func.isRequired };

// FeatureModules/src/SubComponents/conquest/CharacterCreation.jsx
var BASE = "/features/conquest-of-azeroth";
var UI3 = "/Web/Features/conquest-of-azeroth/creation-ui/";
var ORDER = ["necromancer", "pyromancer", "cultist", "starcaller", "sun-cleric", "tinker", "runemaster", "primalist", "reaper", "venomancer", "chronomancer", "bloodmage", "guardian", "stormbringer", "felsworn", "barbarian", "witch-doctor", "witch-hunter", "knight-of-xoroth", "templar", "ranger"];
var FRAME2 = ["tl", "tr", "bl", "br", "top", "bottom", "left", "right"];
var warmedImages2 = /* @__PURE__ */ new Set();
function warmImage(src) {
  if (warmedImages2.has(src)) return;
  warmedImages2.add(src);
  const image = new Image();
  image.src = src;
  image.decode().catch(() => warmedImages2.delete(src));
}
function CrossfadeImage({ src, alt = "", className, imageClassName, width, height, onReady }) {
  const [images, setImages] = useState({ current: { src, alt }, previous: null });
  const loadedSrc = useRef(src);
  useEffect(() => {
    if (src === loadedSrc.current) return void 0;
    let cancelled = false;
    const image = new Image();
    image.fetchPriority = "high";
    image.src = src;
    image.decode().catch(() => {
    }).then(() => {
      if (cancelled) return;
      loadedSrc.current = src;
      setImages((current) => ({
        current: { src, alt },
        previous: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? null : current.current
      }));
    });
    return () => {
      cancelled = true;
    };
  }, [src, alt]);
  return /* @__PURE__ */ jsxs("div", { className: `creation-image-crossfade ${className}`, children: [
    /* @__PURE__ */ jsx("img", { className: imageClassName, src: images.current.src, alt: images.current.alt, width, height, fetchpriority: "high", onLoad: () => onReady?.(images.current.src) }),
    images.previous && /* @__PURE__ */ jsx(
      "img",
      {
        className: "creation-image-previous",
        src: images.previous.src,
        alt: "",
        "aria-hidden": "true",
        onAnimationEnd: () => setImages((current) => ({ ...current, previous: null }))
      },
      images.current.src
    )
  ] });
}
CrossfadeImage.propTypes = {
  src: runtime_prop_types_default.string.isRequired,
  alt: runtime_prop_types_default.string,
  className: runtime_prop_types_default.string.isRequired,
  imageClassName: runtime_prop_types_default.string.isRequired,
  width: runtime_prop_types_default.number,
  height: runtime_prop_types_default.number,
  onReady: runtime_prop_types_default.func
};
function CharacterCreation({ character, classes, resolveAssetUrl, Spellbook }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isEmbedded = queryParams.get("embed") === "1";
  const hideToolbar = queryParams.get("toolbar") === "0";
  const isArticleLayout = queryParams.get("layout") === "article";
  const requested = new URLSearchParams(location.search).get("spec");
  const spec = character.specs.find((entry) => entry.slug === requested) || character.specs[0];
  const [sound, setSound] = useState(() => {
    try {
      return sessionStorage.getItem("coa-creation-sound") !== "off";
    } catch {
      return true;
    }
  });
  const [readyArtwork, setReadyArtwork] = useState(null);
  const [readyEnvironment, setReadyEnvironment] = useState(null);
  const audio = useRef(null);
  const tabs = useRef(null);
  const stage = useRef(null);
  const picker = useRef(null);
  const previousClass = useRef(character.slug);
  const roster = ORDER.map((slug) => classes.find((entry) => entry.slug === slug)).filter(Boolean);
  const ui = (file) => resolveAssetUrl(UI3 + file);
  const href = (entry, selectedSpec) => {
    const query = new URLSearchParams();
    if (selectedSpec) query.set("spec", selectedSpec.slug);
    if (isEmbedded) query.set("embed", "1");
    if (hideToolbar) query.set("toolbar", "0");
    if (isArticleLayout) query.set("layout", "article");
    return `${BASE}/${entry.slug}${query.size ? `?${query}` : ""}`;
  };
  const warmSpec = (entry) => warmImage(resolveAssetUrl(entry.artwork));
  const warmClass = (entry) => {
    warmImage(ui(`${entry.slug}-background.webp`));
    entry.specs.forEach((entrySpec) => {
      warmSpec(entrySpec);
      warmImage(resolveAssetUrl(entrySpec.icon));
    });
  };
  const play = () => {
    if (!sound || !audio.current) return;
    audio.current.currentTime = 0;
    audio.current.play().catch(() => {
    });
  };
  const moveTab = (event) => {
    const links = [...tabs.current.querySelectorAll('[role="tab"]')];
    const index = links.indexOf(event.target);
    const offset = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    const target = event.key === "Home" ? links[0] : event.key === "End" ? links.at(-1) : offset ? links[(index + offset + links.length) % links.length] : null;
    if (target) {
      event.preventDefault();
      target.focus();
      target.click();
    }
  };
  useEffect(() => {
    const previous = document.title;
    document.title = `${character.name} \xB7 Conquest of Azeroth | GrimfallWoW`;
    return () => {
      document.title = previous;
    };
  }, [character.name]);
  useEffect(() => {
    if (!isArticleLayout && previousClass.current !== character.slug && window.matchMedia("(max-width: 1100px)").matches) {
      stage.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    previousClass.current = character.slug;
  }, [character.slug, isArticleLayout]);
  useEffect(() => {
    const element = audio.current;
    if (element) element.volume = 0.75;
    return () => element?.pause();
  }, []);
  useEffect(() => {
    const rail = picker.current;
    const mobile = window.matchMedia("(max-width: 760px)");
    const revealSelected = () => {
      if (!mobile.matches) return;
      const selected = rail.querySelector('[aria-current="page"]');
      if (!selected) return;
      const bounds = rail.getBoundingClientRect();
      const item = selected.getBoundingClientRect();
      if (item.top < bounds.top + 12) rail.scrollTop += item.top - bounds.top - 12;
      else if (item.bottom > bounds.bottom - 12) rail.scrollTop += item.bottom - bounds.bottom + 12;
    };
    revealSelected();
    const observer = new ResizeObserver(revealSelected);
    observer.observe(rail);
    rail.querySelectorAll(".creation-class-row").forEach((row) => observer.observe(row));
    mobile.addEventListener("change", revealSelected);
    return () => {
      observer.disconnect();
      mobile.removeEventListener("change", revealSelected);
    };
  }, [character.slug]);
  return /* @__PURE__ */ jsxs("article", { className: `coa-creation${hideToolbar ? " coa-creation-no-toolbar" : ""}${isArticleLayout ? " coa-creation-article" : ""}`, style: { "--creation-ring": `url("${ui("ring.webp")}")`, "--creation-hover": `url("${ui("hover.webp")}")`, "--creation-selected": `url("${ui("selected.webp")}")`, "--creation-backdrop": `url("${ui(`${character.slug}-background.webp`)}")`, "--spec-panel": `url("${ui("spec-background.webp")}")`, "--spec-divider": `url("${ui("spec-divider.webp")}")`, "--ability-ring": `url("${ui("ability-ring.webp")}")`, "--art-border": `url("${ui("art-border.webp")}")` }, children: [
    /* @__PURE__ */ jsx(CrossfadeImage, { className: "creation-environment", imageClassName: "creation-environment-image", src: ui(`${character.slug}-background.webp`), onReady: setReadyEnvironment }),
    /* @__PURE__ */ jsx("audio", { ref: audio, src: ui("select.wav"), preload: "none", "aria-hidden": "true" }),
    !hideToolbar && /* @__PURE__ */ jsxs("div", { className: "creation-toolbar", children: [
      /* @__PURE__ */ jsx(Link, { to: isEmbedded ? BASE : "/features", target: isEmbedded ? "_top" : void 0, className: "creation-back", children: isEmbedded ? "← 全职业天赋" : "← 网站首页" }),
      /* @__PURE__ */ jsx("span", { children: "征服艾泽拉斯" }),
      /* @__PURE__ */ jsxs("button", { type: "button", className: "creation-sound", "aria-pressed": sound, onClick: () => {
        const enabled = !sound;
        setSound(enabled);
        try {
          sessionStorage.setItem("coa-creation-sound", enabled ? "on" : "off");
        } catch {
        }
        if (!enabled) audio.current?.pause();
        else if (audio.current) {
          audio.current.currentTime = 0;
          audio.current.play().catch(() => {
          });
        }
      }, children: [
        "音效 ",
        sound ? "开启" : "关闭"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { id: "specializations", className: "creation-stage", ref: stage, children: [
      /* @__PURE__ */ jsxs("section", { className: "creation-information", "aria-label": `${character.name} class information`, children: [
        /* @__PURE__ */ jsxs("div", { className: "creation-heading-row", children: [ /* @__PURE__ */ jsxs("h1", { children: [jsx("img", { className: "creation-heading-icon", src: ui(`${character.slug}.webp`), alt: "" }), jsx("span", { children: character.name })] }),
        /* @__PURE__ */ jsx("div", { className: "creation-spec-tabs", role: "tablist", "aria-label": `${character.name} specializations`, ref: tabs, onKeyDown: moveTab, children: character.specs.map((entry) => /* @__PURE__ */ jsxs(Link, { role: "tab", id: `creation-tab-${entry.id}`, "aria-controls": "creation-spec-panel", "aria-selected": entry.id === spec.id, tabIndex: entry.id === spec.id ? 0 : -1, to: href(character, entry), onClick: play, onPointerEnter: () => warmSpec(entry), onFocus: () => warmSpec(entry), preventScrollReset: true, children: [
          /* @__PURE__ */ jsxs("span", { className: "creation-spec-orb", children: [
            /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(entry.icon), alt: "", width: "48", height: "48" }),
            /* @__PURE__ */ jsx("span", { className: "creation-class-ring" }),
            /* @__PURE__ */ jsx("span", { className: "creation-class-glow" })
          ] }),
          /* @__PURE__ */ jsx("span", { children: entry.name })
        ] }, entry.id)) }),
         ] }), /* @__PURE__ */ jsxs("div", { className: "creation-spec-copy", role: "tabpanel", id: "creation-spec-panel", "aria-labelledby": `creation-tab-${spec.id}`, tabIndex: 0, children: [
          /* @__PURE__ */ jsx("span", { className: "creation-frame-title", "aria-hidden": "true", style: { backgroundImage: `url("${ui("frame-title.webp")}")` } }),
          /* @__PURE__ */ jsx("span", { className: "creation-frame-streak", "aria-hidden": "true", style: { backgroundImage: `url("${ui("frame-streak.webp")}")` } }),
          /* @__PURE__ */ jsx("img", { className: "creation-frame-portrait", src: ui(`${character.slug}.webp`), width: "61", height: "61", alt: "" }),
          /* @__PURE__ */ jsx("span", { className: "creation-frame-caption", children: "专精" }),
          /* @__PURE__ */ jsx("div", { className: "creation-frame-art", "aria-hidden": "true", children: FRAME2.map((part) => /* @__PURE__ */ jsx("span", { className: `creation-frame-${part}`, style: { backgroundImage: `url("${ui(`frame-${part}.webp`)}")` } }, part)) }),
          /* @__PURE__ */ jsxs("div", { className: "creation-spec-interior", children: [
            /* @__PURE__ */ jsxs("div", { className: "creation-loadout", children: [
              /* @__PURE__ */ jsx("div", { className: "creation-stat-icons", "aria-label": "Primary attributes", children: spec.stats.map((stat) => /* @__PURE__ */ jsxs("span", { children: [
                /* @__PURE__ */ jsx("img", { src: ui(`stat-${stat.toLowerCase()}.webp`), alt: "", width: "36", height: "36" }),
                /* @__PURE__ */ jsx("span", { children: ({Strength:"力量",Agility:"敏捷",Intellect:"智力",Stamina:"耐力",Spirit:"精神"})[stat]||stat })
              ] }, stat)) }),
              /* @__PURE__ */ jsxs("dl", { className: "creation-attributes", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("dt", { children: "护甲" }),
                  /* @__PURE__ */ jsx("dd", { children: spec.armor.join(" / ") })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("dt", { children: "资源" }),
                  /* @__PURE__ */ jsx("dd", { children: spec.resources.join(" \xB7 ") })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("h2", { children: spec.name }),
            /* @__PURE__ */ jsx("div", { className: "creation-role-icons", children: spec.roles.map((role) => /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("img", { src: ui(`role-${role.toLowerCase()}.webp`), alt: "", width: "44", height: "44" }),
              /* @__PURE__ */ jsx("span", { children: ({Tank:"坦克",Healer:"治疗",Melee:"近战输出",Ranged:"远程输出",Caster:"法系输出",Support:"辅助"})[role]||role })
            ] }, role)) }),
            /* @__PURE__ */ jsx("div", { className: "creation-spec-divider", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("p", { className: "creation-spec-description", children: spec.description }),
            /* @__PURE__ */ jsxs("p", { className: "creation-difficulty", children: [
              "复杂度：",
              spec.difficulty
            ] }),
            /* @__PURE__ */ jsx(Spellbook, { spec, resolveAssetUrl }, spec.id)
          ] })
        ] }, spec.id)
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "creation-portrait-column", "aria-label": `${spec.name} artwork and class description`, children: [
        /* @__PURE__ */ jsxs("div", { className: "creation-portrait", children: [
          /* @__PURE__ */ jsx(CrossfadeImage, { className: "creation-artwork", imageClassName: "creation-painting", src: resolveAssetUrl(spec.artwork), alt: `${character.name} \xB7 ${spec.name} specialization artwork`, width: 616, height: 372, onReady: setReadyArtwork }),
          /* @__PURE__ */ jsxs("div", { className: "creation-portrait-title", children: [
            /* @__PURE__ */ jsx("span", { children: character.name }),
            /* @__PURE__ */ jsx("strong", { children: spec.name })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "creation-fantasy", children: character.fantasy })
      ] }),
      /* @__PURE__ */ jsx(TalentPlanner, { prefetchReady: readyArtwork === resolveAssetUrl(spec.artwork) && readyEnvironment === ui(`${character.slug}-background.webp`), character, spec, resolveAssetUrl, play }, character.slug)
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "creation-class-picker", "aria-label": "Conquest of Azeroth classes", ref: picker, children: [roster.slice(0, 10), roster.slice(10)].map((row, index) => /* @__PURE__ */ jsx("div", { className: "creation-class-row", children: row.map((entry) => /* @__PURE__ */ jsxs(Link, { to: href(entry), state: { preserveScroll: true }, "aria-label": entry.name, "aria-current": entry.slug === character.slug ? "page" : void 0, onClick: play, onPointerEnter: () => warmClass(entry), onFocus: () => warmClass(entry), preventScrollReset: true, children: [
      /* @__PURE__ */ jsxs("span", { className: "creation-class-orb", children: [
        /* @__PURE__ */ jsx("img", { src: ui(`${entry.slug}.webp`), alt: "", width: "128", height: "128" }),
        /* @__PURE__ */ jsx("span", { className: "creation-class-ring" }),
        /* @__PURE__ */ jsx("span", { className: "creation-class-glow" })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "creation-class-name", children: entry.name })
    ] }, entry.slug)) }, index)) })
  ] });
}
CharacterCreation.propTypes = { character: runtime_prop_types_default.object.isRequired, classes: runtime_prop_types_default.array.isRequired, resolveAssetUrl: runtime_prop_types_default.func.isRequired, Spellbook: runtime_prop_types_default.func.isRequired };

// FeatureModules/src/SubComponents/conquest/ConquestOfAzeroth.jsx
var BASE2 = "/features/conquest-of-azeroth";
var cache = /* @__PURE__ */ new Map();
function useRoster(url) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ data: cache.get(url), error: false });
  useEffect(() => {
    if (cache.has(url)) {
      setState({ data: cache.get(url), error: false });
      return void 0;
    }
    const controller = new AbortController();
    setState({ data: null, error: false });
    fetch(url, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("Class roster unavailable");
      const data = await response.json();
      if (!Array.isArray(data.classes) || !data.classes.length) throw new Error("Invalid class roster");
      cache.set(url, data);
      setState({ data, error: false });
    }).catch((error) => {
      if (error.name !== "AbortError") setState({ data: null, error: true });
    });
    return () => controller.abort();
  }, [url, attempt]);
  return { ...state, retry: () => setAttempt((value) => value + 1) };
}
function ConquestOfAzeroth({ route }) {
  const { resolveAssetUrl } = useSiteContent();
  const location = useLocation();
  const defaultSelection = useMemo(() => ({ visitKey: location.key, roll: Math.random() }), [location.key]);
  const url = resolveAssetUrl(route.dataPath);
  const { data, error, retry } = useRoster(url);
  if (error) return /* @__PURE__ */ jsxs("div", { className: "coa-load-state", role: "alert", children: [
    /* @__PURE__ */ jsx("h1", { children: "征服艾泽拉斯" }),
    /* @__PURE__ */ jsx("p", { children: "The class roster could not be loaded." }),
    /* @__PURE__ */ jsx("button", { type: "button", onClick: retry, children: "Try again" })
  ] });
  if (!data) return /* @__PURE__ */ jsx("div", { className: "coa-load-state", role: "status", children: "Opening the class archives\u2026" });
  const character = route.classSlug ? data.classes.find((entry) => entry.slug === route.classSlug) : data.classes[Math.floor(defaultSelection.roll * data.classes.length)];
  if (!character) return /* @__PURE__ */ jsxs("div", { className: "coa-load-state", children: [
    /* @__PURE__ */ jsx("h1", { children: "Class not found" }),
    /* @__PURE__ */ jsx(Link, { to: BASE2, children: "Explore all classes" })
  ] });
  return /* @__PURE__ */ jsx(CharacterCreation, { character, classes: data.classes, resolveAssetUrl, Spellbook: AbilitySamples });
}
ConquestOfAzeroth.propTypes = { route: runtime_prop_types_default.shape({ dataPath: runtime_prop_types_default.string.isRequired, classSlug: runtime_prop_types_default.string }).isRequired };
window.COA_NATIVE_COMPONENTS={CharacterCreation,AbilitySamples};
