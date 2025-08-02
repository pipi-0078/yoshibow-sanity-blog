import React from 'react';

// Sanityから渡ってくる値の型
type Props = {
  value: {
    themeColor?: string;
    tableData: {
      _key: string;
      cells: string[];
    }[];
  };
};

const CustomTable = ({ value }: Props) => {
  if (!value?.tableData || value.tableData.length === 0) {
    return null;
  }

  const rows = value.tableData;
  const headerRow = rows[0];
  const bodyRows = rows.slice(1);
  const headerBgColor = value.themeColor || '#f3f4f6'; // デフォルト色

  return (
    // 横スクロールを実現するためのラッパー
    <div className="my-6 w-full overflow-x-auto rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead style={{ backgroundColor: headerBgColor }}>
          <tr>
            {headerRow.cells.map((cell, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700
                  ${index === 0 ? 'sticky left-0 z-10' : ''}`} // 最初の列を固定
                style={index === 0 ? { backgroundColor: headerBgColor } : {}} // スクロール時に背景が透けないように
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {bodyRows.map((row, rowIndex) => (
            <tr key={row._key || rowIndex}>
              {row.cells.map((cell, index) => (
                <td
                  key={index}
                  className={`whitespace-nowrap px-6 py-4 text-sm text-gray-800
                    ${index === 0 ? 'sticky left-0 z-10 font-medium' : ''}`} // 最初の列を固定
                  style={index === 0 ? { backgroundColor: 'white' } : {}} // スクロール時に背景が透けないように
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;