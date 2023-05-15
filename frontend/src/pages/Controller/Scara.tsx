import { useState } from 'react';

import Board from '../../components/Board';
import example1Img from '../../assets/example1.jpg';
import { ReactComponent as AddIcon } from '../../assets/icons/plus-single.svg';
import { ReactComponent as MinusIcon } from '../../assets/icons/minus-single.svg';
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow-up-long.svg';
import { ReactComponent as ArrowRotateIcon } from '../../assets/icons/arrow-rotate-left.svg';
import './Scara.scss';

const Controller = () => {
  const [showArrowX, setShowArrowX] = useState<boolean>(false);
  const [showArrowY, setShowArrowY] = useState<boolean>(false);
  const [showArrowZ, setShowArrowZ] = useState<boolean>(false);
  const [showArrowC, setShowArrowC] = useState<boolean>(false);

  return (
    <main className="relative flex w-full flex-wrap justify-evenly overflow-auto bg-[#ececec] py-4 dark:bg-black dark:text-white">
      <section className="flex h-max w-full flex-wrap gap-4 px-4 lg:h-1/2 lg:flex-nowrap">
        <Board
          width="w-full lg:w-5/12"
          className="relative h-max overflow-auto text-sm md:h-full"
          title="Operation Panel"
        >
          <section className="mt-4 flex gap-2">
            <section className="flex w-1/4 flex-col gap-5 border-r-2 border-table-border px-4 py-3 font-medium">
              <section className="flex flex-col items-center justify-center gap-2">
                <h3>SERVO ON</h3>
                <span className="inline-block h-6 w-6 rounded-full border-2 border-gray-80 bg-gray-60">
                  {null}
                </span>
              </section>

              <section className="flex flex-col items-center justify-center gap-2">
                <h3>SERVO OFF</h3>
                <span className="inline-block h-6 w-6 rounded-full border-2 border-red-dark bg-red">
                  {null}
                </span>
              </section>

              <section className="flex flex-col items-center justify-center gap-2">
                <h3>ALM</h3>
                <span className="inline-block h-6 w-6 rounded-full border-2 border-gray-80 bg-gray-60">
                  {null}
                </span>
              </section>
            </section>

            <section className="flex w-3/4 flex-col gap-2">
              <section className="ml-1 flex flex-col gap-1 rounded-lg bg-table-bg p-2 dark:bg-blue-gray dark:text-blue-dark">
                <section className="flex items-center gap-1">
                  <h1 className="mr-1 w-14 font-bold">SPEED:</h1>
                  <button className="w-20 rounded-sm bg-gray-60 py-[1px] px-2 hover:bg-yellow-transparent">
                    LOW
                  </button>
                  <button className="w-20 rounded-sm bg-yellow py-[1px] px-2">MID</button>
                  <button className="w-20 rounded-sm bg-gray-60 py-[1px] px-2 hover:bg-yellow-transparent">
                    HIGH
                  </button>
                </section>

                <section className="flex items-center gap-1">
                  <h1 className="mr-1 w-14 font-bold">REMOT:</h1>
                  <button className="w-20 rounded-sm bg-yellow py-[1px] px-2">JOG</button>
                  <button className="w-20 rounded-sm bg-gray-60 py-[1px] px-2 hover:bg-yellow-transparent">
                    INC
                  </button>
                </section>
              </section>

              <section className="text-lg">
                <section
                  className="mx-4 flex h-12 justify-around py-2"
                  onMouseEnter={() => setShowArrowX(true)}
                  onMouseLeave={() => setShowArrowX(false)}
                >
                  <button className="flex w-1/3 items-center justify-center bg-blue-transparent hover:bg-green">
                    <span className="w-4">
                      <MinusIcon fill="#162848" />
                    </span>
                  </button>
                  <p className="w-1/3 border-t-2 border-b-2 border-blue-transparent text-center">
                    X
                  </p>
                  <button className="flex w-1/3 items-center justify-center bg-blue-transparent hover:bg-green">
                    <span className="w-4">
                      <AddIcon fill="#162848" />
                    </span>
                  </button>
                </section>

                <section
                  className="mx-4 flex h-12 justify-around py-2"
                  onMouseEnter={() => setShowArrowY(true)}
                  onMouseLeave={() => setShowArrowY(false)}
                >
                  <button className="flex w-1/3 items-center justify-center bg-blue-transparent hover:bg-green">
                    <span className="w-4">
                      <MinusIcon fill="#162848" />
                    </span>
                  </button>
                  <p className="w-1/3 border-t-2 border-b-2 border-blue-transparent text-center">
                    Y
                  </p>
                  <button className="flex w-1/3 items-center justify-center bg-blue-transparent hover:bg-green">
                    <span className="w-4">
                      <AddIcon fill="#162848" />
                    </span>
                  </button>
                </section>

                <section
                  className="mx-4 flex h-12 justify-around py-2"
                  onMouseEnter={() => setShowArrowZ(true)}
                  onMouseLeave={() => setShowArrowZ(false)}
                >
                  <button className="flex w-1/3 items-center justify-center bg-blue-transparent hover:bg-green">
                    <span className="w-4">
                      <MinusIcon fill="#162848" />
                    </span>
                  </button>
                  <p className="w-1/3 border-t-2 border-b-2 border-blue-transparent text-center">
                    Z
                  </p>
                  <button className="flex w-1/3 items-center justify-center bg-blue-transparent hover:bg-green">
                    <span className="w-4">
                      <AddIcon fill="#162848" />
                    </span>
                  </button>
                </section>

                <section
                  className="mx-4 flex h-12 justify-around py-2"
                  onMouseEnter={() => setShowArrowC(true)}
                  onMouseLeave={() => setShowArrowC(false)}
                >
                  <button className="flex w-1/3 items-center justify-center bg-blue-transparent hover:bg-green">
                    <span className="w-4">
                      <MinusIcon fill="#162848" />
                    </span>
                  </button>
                  <p className="w-1/3 border-t-2 border-b-2 border-blue-transparent text-center">
                    C
                  </p>
                  <button className="flex w-1/3 items-center justify-center bg-blue-transparent hover:bg-green">
                    <span className="w-4">
                      <AddIcon fill="#162848" />
                    </span>
                  </button>
                </section>
              </section>
            </section>
          </section>
        </Board>

        <Board
          width="w-full lg:w-1/3"
          className="relative h-max overflow-auto text-sm md:h-full"
        >
          <section className="relative flex h-full w-full justify-center gap-2 px-2">
            <img src={example1Img} alt="example" className="h-full w-auto" />
            {showArrowX && (
              <div className="absolute top-2/3 w-12 animate-bounceZ">
                <ArrowIcon fill="#00f" className="rotate-[115deg]" />
              </div>
            )}

            {showArrowY && (
              <div className="absolute top-[70%] w-12 animate-bounceY">
                <ArrowIcon fill="#0f0" className="rotate-[67deg]" />
              </div>
            )}

            {showArrowZ && (
              <div className="absolute top-[70%] w-12 animate-bounce">
                <ArrowIcon fill="#f00" />
              </div>
            )}

            {showArrowC && (
              <div className="arrow-c absolute top-[70%] w-12">
                <ArrowRotateIcon fill="#ff0" className="" />
              </div>
            )}
          </section>
        </Board>

        <Board
          width="w-full lg:w-1/4"
          className="relative h-max overflow-auto text-sm md:h-full"
          title="Current Position"
        >
          <section className="mt-4 flex flex-col gap-2">
            <section className="flex gap-2 pl-4">
              <h3 className="font-semibold">Work Coordinate:</h3>
              <p>.world</p>
            </section>

            <section className="flex gap-2 pl-4">
              <h3 className="font-semibold">Tool Coordinate:</h3>
              <p>.system</p>
            </section>

            <section className="mt-2 flex flex-col gap-2">
              <section className="flex w-full items-center">
                <p className="w-1/3 text-right text-sm font-semibold">X:</p>
                <p className="ml-4 w-1/3 bg-wiwynn-blue py-1 pr-2 text-right text-white">
                  600.000
                </p>
                <p className="w-1/3 pl-4">mm</p>
              </section>

              <section className="flex w-full items-center">
                <p className="w-1/3 text-right text-sm font-semibold">Y:</p>
                <p className="ml-4 w-1/3 bg-wiwynn-blue py-1 pr-2 text-right text-white">
                  0.000
                </p>
                <p className="w-1/3 pl-4">mm</p>
              </section>

              <section className="flex w-full items-center">
                <p className="w-1/3 text-right text-sm font-semibold">Z:</p>
                <p className="ml-4 w-1/3 bg-wiwynn-blue py-1 pr-2 text-right text-white">
                  0.000
                </p>
                <p className="w-1/3 pl-4">mm</p>
              </section>

              <section className="flex w-full items-center">
                <p className="w-1/3 text-right text-sm font-semibold">C:</p>
                <p className="ml-4 w-1/3 bg-wiwynn-blue py-1 pr-2 text-right text-white">
                  0.000
                </p>
                <p className="w-1/3 pl-4">mm</p>
              </section>

              <section className="flex w-full items-center">
                <p className="w-1/3 text-right text-sm font-semibold">T:</p>
                <p className="ml-4 w-1/3 bg-wiwynn-blue py-1 pr-2 text-right text-white">
                  0.000
                </p>
                <p className="w-1/3 pl-4">mm</p>
              </section>

              <section className="flex w-full items-center">
                <p className="w-1/3 text-right text-sm font-semibold">CONFIG:</p>
                <p className="ml-4 w-1/3 bg-wiwynn-blue py-1 pr-2 text-right text-white">
                  RIGHTY
                </p>
                <p className="w-1/3 pl-4">{null}</p>
              </section>
            </section>
          </section>
        </Board>
      </section>

      <section className="mt-0 flex w-full px-4 pt-4 lg:h-1/2">
        <Board
          width="w-full lg:w-full"
          className="relative h-max text-sm md:h-full"
          title="D_C2080 Data"
        >
          <section className="flex h-[90%]">
            <section className="w-1/6 overflow-y-auto border-r-2 border-table-border bg-light-60 py-2 pr-4 dark:bg-black">
              <ul className="flex flex-col gap-1">
                <li className="flex cursor-pointer flex-col gap-2 rounded-md bg-blue-transparent px-2 py-3 font-semibold dark:text-blue-dark">
                  Positional data
                </li>

                <li className="flex cursor-pointer flex-col gap-2 rounded-md px-2 py-3 font-semibold hover:bg-table-bg">
                  Coordinate data
                </li>
              </ul>
            </section>

            <section className="flex w-5/6 flex-col gap-3 overflow-auto px-4">
              <section className="flex justify-between p-1">
                <label htmlFor="coordinate-system" className="font-semibold">
                  Coordinate system
                  <select
                    id="coordinate-system"
                    name="coordinate-system"
                    className="mt-1 ml-2 rounded-md border-2 px-1 font-normal text-black focus:outline-none dark:bg-gray-220 dark:text-white"
                  >
                    <option>.world</option>
                    <option>CAMERA</option>
                    <option>GRIPPER</option>
                    <option>MB_FRAME</option>
                    <option>TRAY_A</option>
                    <option>TRAY_B</option>
                  </select>
                </label>

                <label htmlFor="base-name" className="font-semibold">
                  Base name
                  <input
                    id="base-name"
                    type="text"
                    name="base-name"
                    className="mt-1 ml-2 rounded-md border-2 px-1 font-normal text-black focus:outline-none dark:bg-gray-220 dark:text-white"
                  />
                </label>

                <section className="flex gap-4">
                  <button
                    className="h-8 w-28 rounded-full bg-wiwynn-blue px-8 py-1 font-semibold tracking-wide text-white"
                    // disabled={!AUTHORIZATION.Device.create.has(permission)}
                    // onClick={addDeviceHandler}
                  >
                    TEACH
                  </button>

                  <button
                    className="h-8 w-28 rounded-full bg-wiwynn-blue px-8 py-1 font-semibold tracking-wide text-white"
                    // disabled={!AUTHORIZATION.Device.create.has(permission)}
                    // onClick={addDeviceHandler}
                  >
                    MOVE
                  </button>

                  <button
                    className="h-8 w-28 rounded-full bg-wiwynn-blue px-8 py-1 font-semibold tracking-wide text-white"
                    // disabled={!AUTHORIZATION.Device.create.has(permission)}
                    // onClick={addDeviceHandler}
                  >
                    PAUSE
                  </button>
                </section>
              </section>

              <section className="h-auto w-full overflow-auto">
                <table className="relative mx-auto w-full text-center">
                  <thead className="sticky top-[-1px] z-20 border-b-[1px] bg-table-bg text-sm font-medium tracking-wide text-gray-220">
                    <tr className="border-2 border-table-border bg-table-bg text-sm leading-9 text-table-font">
                      <th className="text-center tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
                        No.
                      </th>
                      <th className="text-center tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
                        Name
                      </th>
                      <th className="text-center tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
                        X
                      </th>
                      <th className="text-center tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
                        Y
                      </th>
                      <th className="text-center tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
                        Z
                      </th>
                      <th className="text-center tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
                        C
                      </th>
                      <th className="text-center tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
                        T
                      </th>
                      <th className="text-center tracking-wide text-gray-220 dark:bg-gray-220 dark:text-light-60">
                        CONFIG
                      </th>
                    </tr>
                  </thead>

                  <tbody className="relative z-10">
                    {Array.from(Array(20).keys()).map((index) => (
                      <tr
                        key={index}
                        className="event-row border-2 border-table-border text-sm leading-10 hover:cursor-pointer hover:bg-table-hover dark:border-gray-200 dark:text-light-100 dark:hover:text-black"
                      >
                        <td>{index + 1}</td>
                        <td>PLACE({index + 1})</td>
                        <td>-22.594</td>
                        <td>-113.085</td>
                        <td>-72.000</td>
                        <td>0.000</td>
                        <td>0.000</td>
                        <td>LEFTY</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </section>
          </section>
        </Board>
      </section>
    </main>
  );
};

export default Controller;
