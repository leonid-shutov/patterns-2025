"use strict";

const RENDERERS = {
  console: (data) => {
    const h = ["(index)", ...Object.keys(data[0])],
      w = h.map((k, i) =>
        Math.max(
          k.length,
          ...data.map((r, j) => String(i ? (r[k] ?? "") : j).length),
        ),
      ),
      p = (s, i) => String(s).padEnd(w[i], " ");
    let out =
      "| " +
      h.map(p).join(" | ") +
      " |\n|-" +
      w.map((x) => "-".repeat(x)).join("-|-") +
      "-|\n";
    for (let i = 0; i < data.length; i++)
      out +=
        "| " +
        [i, ...h.slice(1).map((k) => data[i][k] ?? "")].map(p).join(" | ") +
        " |\n";
    return out.trim();
  },

  web: (data) => {
    const keys = Object.keys(data[0]);
    const line = (row) =>
      "<tr>" + keys.map((key) => `<td>${row[key]}</td>`).join("") + "</tr>";
    const output = [
      "<table><tr>",
      keys.map((key) => `<th>${key}</th>`).join(""),
      "</tr>",
      data.map(line).join(""),
      "</table>",
    ];
    return output.join("");
  },

  markdown: (data) => {
    const keys = Object.keys(data[0]);
    const line = (row) =>
      "|" + keys.map((key) => `${row[key]}`).join("|") + "|\n";
    const output = [
      "|",
      keys.map((key) => `${key}`).join("|"),
      "|\n",
      "|",
      keys.map(() => "---").join("|"),
      "|\n",
      data.map(line).join(""),
    ];
    return output.join("");
  },
};

const abstractStrategy = () => {
  throw new Error("Not implemented");
};

const selectStrategy = (strategies, name) => {
  const strategy = name in strategies ? strategies[name] : abstractStrategy;
  return (...args) => strategy(...args);
};

// Usage

//const png = selectStrategy(RENDERERS, "png");
const con = selectStrategy(RENDERERS, "console");
const web = selectStrategy(RENDERERS, "web");
const mkd = selectStrategy(RENDERERS, "markdown");

const persons = [
  { name: "Marcus Aurelius", city: "Rome", born: 121 },
  { name: "Victor Glushkov", city: "Rostov on Don", born: 1923 },
  { name: "Ibn Arabi", city: "Murcia", born: 1165 },
  { name: "Mao Zedong", city: "Shaoshan", born: 1893 },
  { name: "Rene Descartes", city: "La Haye en Touraine", born: 1596 },
];

//console.group("Unknown Strategy:");
//png(persons);
//console.groupEnd();

console.group("\nConsoleRenderer:");
console.log(con(persons));
console.groupEnd();

console.group("\nWebRenderer:");
console.log(web(persons));
console.groupEnd();

console.group("\nMarkdownRenderer:");
console.log(mkd(persons));
console.groupEnd();
