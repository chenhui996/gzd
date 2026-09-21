---
name: gzd-table-antd-demo-migration
description: Use when converting an Ant Design Table demo, screenshot, columns/dataSource example, or rowSelection example into a gzd Table demo backed by AG Grid 36.
---

# Migrate Ant Design Table Demos

## Goal

Reproduce the source demo's user-visible behavior with the repository's `Table` wrapper and AG Grid Community APIs. Preserve semantics rather than translating Ant Design props mechanically.

## Workflow

1. Inspect `src/components/table/Table.tsx`, `src/components/table/index.md`, `package.json`, nearby demos, and `git status`. Preserve unrelated or pre-existing changes.
2. Identify the source demo's data model, columns, renderers, interactions, layout, and intentionally omitted features.
3. Prefer AG Grid Community's native API. Check the installed AG Grid version and local types before using an uncertain property.
4. If faithful behavior requires Enterprise functionality or a substantial custom workaround, explain the limitation and obtain direction before changing the implementation.
5. When implementation is requested, create `src/components/table/demo/<kebab-name>.tsx` and add:
   `<code src="./demo/<kebab-name>.tsx">示例标题</code>`
   under `## 代码演示` in `src/components/table/index.md`.
6. Run focused ESLint, `tsc -b`, `npm run docs:build`, and `git diff --check`. Confirm dumi generated the expected demo route.

If the user requests code only, return the converted code without editing the repository.

## Core Mapping

| Ant Design Table | gzd / AG Grid |
| --- | --- |
| `TableColumnsType<T>` | `ColDef<T>[]` |
| `title` | `headerName` |
| `dataIndex` | `field` |
| `render` | typed React `cellRenderer` |
| `dataSource` | `rowData` |
| `key` / `rowKey` | `getRowId` |
| `sorter` | `sortable` and `comparator` when needed |
| `defaultSortOrder` | `initialSort` |
| `filters` / `onFilter` | Community column filter or external filter |
| `pagination.pageSize` | `pagination`, `paginationPageSize`, and usually `paginationPageSizeSelector={false}` |
| checkbox `rowSelection` | `rowSelection={{ mode: "multiRow" }}` |
| disabled checkbox | `rowSelection.isRowSelectable` |
| fixed column | `pinned` |

## Repository Conventions

- Import `Table` and UI render helpers such as `Flex`, `Space`, and `Tag` from `gzd`.
- Register `AllCommunityModule` through the demo's `modules` prop.
- Use `ColDef<T>` and typed renderer/event params from `ag-grid-community`.
- Use `domLayout="autoHeight"` for small non-paginated demos; use an explicit bounded height when pagination or scrolling needs it.
- The wrapper defaults columns to sortable and resizable. Explicitly disable features absent from the source demo, including `suppressMovable`, so conversion does not add behavior.
- Keep demo metadata at the top with `title` and `description`.
- Use the source data and visible labels unless the user asks for localization or simplification.
- Do not introduce Enterprise modules, licenses, an Ant Design Table adapter, or unrelated component changes.

## Selection Details

For checkbox selection, use `RowSelectionOptions<T>` with `mode: "multiRow"`, `checkboxes: true`, and `headerCheckbox: true`. Map Ant Design `getCheckboxProps(...).disabled` to `isRowSelectable`. Use `SelectionChangedEvent<T>` to derive selected records and keys.

## Completion Checklist

- The demo uses gzd `Table`, not Ant Design `Table`.
- Data, columns, custom rendering, and supported interactions match the source.
- Community/Enterprise boundaries are respected.
- Stable row IDs and required modules are present.
- The documentation link, type check, lint, docs build, and diff check succeed.
