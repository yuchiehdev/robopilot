/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import { MdOutlineInsertPageBreak } from 'react-icons/md';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';
import AUTHORIZATION from '../../data/authorization';

const authList: Record<string, Record<string, Set<string>>> = AUTHORIZATION;

const tableHeader: string[] = [
  'Actions',
  'Site Vender',
  'Developer',
  'Engineer',
  'Guest',
];
const tbodySections: string[] = Object.keys(authList); // pages
const tbodyRows: string[] = ['Create', 'View', 'Edit', 'Delete'];
const tbodyRowsData: string[] = Object.keys(Object.values(authList)[0]); // CRUD

const LevelIllustration = () => {
  return (
    <main className="py-2 px-10 pt-4">
      <section className="scrollBarStyle h-[98%] w-full overflow-y-auto">
        <table className="w-full drop-shadow-sm">
          <thead className="sticky top-[-2px]">
            <tr className="border-2 border-table-border bg-white">
              {tableHeader.map((item, index) => (
                <th
                  className="text-start text-sm leading-8 tracking-wide text-table-font"
                  key={item}
                  style={index === 0 ? { paddingLeft: '1.25rem' } : {}}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          {tbodySections.map((item: string) => (
            <tbody>
              <tr
                className="border-2 border-table-border bg-table-bg hover:cursor-pointer hover:bg-table-hover"
                key={item}
              >
                <td className=" py-1 pl-5 text-start text-xs font-extrabold leading-6 tracking-wide ei:text-sm">
                  <div className="flex items-center gap-3">
                    <MdOutlineInsertPageBreak className="h-4 w-4 text-[#185ee0]" />
                    {item}
                  </div>
                </td>
                <td>{null}</td>
                <td>{null}</td>
                <td>{null}</td>
                <td>{null}</td>
              </tr>
              {tbodyRowsData.map((row, index) => {
                return (
                  <tr
                    className="border-2 border-table-border bg-white hover:cursor-pointer"
                    key={index}
                  >
                    <td
                      key={tableHeader[index]}
                      className="py-3 pl-5 text-start text-xs tracking-wide ei:text-sm"
                    >
                      <div className="flex items-center gap-3">{tbodyRows[index]}</div>
                    </td>
                    {tableHeader.map((thItem, index) => {
                      return index === 0 ? null : (
                        <td
                          className="py-3 pl-5 text-start text-xs tracking-wide ei:text-sm"
                          key={tableHeader[index]}
                          style={index === 0 ? { paddingLeft: '1.25rem' } : {}}
                        >
                          <div className="flex items-center gap-3">
                            {authList[item][row].has(thItem) ? (
                              <ImCheckboxChecked className="h-4 w-4 text-[#185ee0]" />
                            ) : (
                              <ImCheckboxUnchecked className="h-4 w-4 text-[#185ee0]" />
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </section>
    </main>
  );
};

export default LevelIllustration;
