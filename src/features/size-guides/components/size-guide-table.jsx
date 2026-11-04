function SizeGuideTable({ sizeGuide }) {
  const columns = [...(sizeGuide?.columns ?? [])].sort(
    (left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0),
  );

  const rows = [...(sizeGuide?.rows ?? [])].sort(
    (left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0),
  );

  function getMeasurementValue(measurements, key) {
    return measurements?.find((measurement) => measurement.key === key)?.value ?? "—";
  }

  if (!rows.length || !columns.length) {
    return <p className="text-sm text-slate">Size measurements are not available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-md border-collapse text-left">
        <thead>
          <tr className="border-b border-cloud">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate">
              Size
            </th>

            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.size} className="border-b border-cloud last:border-b-0">
              <td className="px-4 py-4 font-semibold text-ink">{row.size}</td>

              {columns.map((column) => (
                <td key={column.key} className="px-4 py-4 text-sm text-slate">
                  {getMeasurementValue(row.measurements, column.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { SizeGuideTable };
