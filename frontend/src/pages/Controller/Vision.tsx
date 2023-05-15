import { useState } from 'react';

import Board from '../../components/Board';
import CameraPage from './CameraPage';
import MbPage from './MbPage';
import SocketMonitor from '../../components/SocketMonitor';
import ToolPage from './ToolPage';
import TeachPage from './TeachPage';
import TrayPage from './TrayPage';
import { ReactComponent as StartIcon } from '../../assets/icons/play.svg';
import './vision.scss';

type ShowPage = 'mb' | 'camera' | 'tool' | 'tray' | 'teach';

const Vision = () => {
  const [showPage, setShowPage] = useState<ShowPage>('mb');
  const [isStart, setIsStart] = useState<boolean>(false);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setShowPage(event.target.value as ShowPage);
  };

  return (
    <main className="flex w-full flex-wrap justify-evenly overflow-auto bg-[#ececec] py-4 dark:bg-black dark:text-white">
      <section className="flex h-full w-full flex-wrap gap-4 px-4 lg:flex-nowrap">
        <section className="h-full lg:w-1/4">
          <Board width="w-full h-full" title="Controller">
            <section className="p-4">
              <section className="flex flex-col gap-5 text-blue-dark dark:text-white">
                <section className="my-2 flex w-full items-center font-semibold">
                  <div className="mr-6 flex gap-3 font-bold">
                    <span className="h-4 w-4">
                      <StartIcon fill="#a9d6e5" />
                    </span>
                    Start
                  </div>
                  <label
                    htmlFor="start-btn"
                    className="switch flex w-full items-center font-semibold"
                  >
                    <input
                      id="start-btn"
                      className="start-btn__checkbox"
                      type="checkbox"
                      checked={isStart}
                      onChange={() => setIsStart(!isStart)}
                    />
                    <span className="slider round" />
                  </label>
                </section>

                <section>
                  <select
                    className="rounded-md border-[1px] border-gray-180 px-2"
                    onChange={onChange}
                    disabled={!isStart}
                  >
                    <option value="mb">MB</option>
                    <option value="camera">Camera</option>
                    <option value="tool">Tool</option>
                    <option value="tray">Tray</option>
                    <option value="teach">Teach</option>
                  </select>
                </section>

                {showPage === 'mb' && <MbPage isStart={isStart} />}
                {showPage === 'camera' && <CameraPage isStart={isStart} />}
                {showPage === 'tool' && <ToolPage isStart={isStart} />}
                {showPage === 'tray' && <TrayPage isStart={isStart} />}
                {showPage === 'teach' && <TeachPage isStart={isStart} />}
              </section>
            </section>
          </Board>
        </section>
        <section className="h-full lg:w-3/4">
          <Board width="w-full h-full" title="Vision">
            <SocketMonitor />
          </Board>
        </section>
      </section>
    </main>
  );
};

export default Vision;
