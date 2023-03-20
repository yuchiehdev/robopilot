import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { SOCKET_URL } from '../../data/fetchUrl';

const SocketMonitor = () => {
  const [isImgSent, setIsImgSent] = useState(false);

  const { lastMessage } = useWebSocket(SOCKET_URL, {
    shouldReconnect: () => true,
    onClose: () => {
      setIsImgSent(false);
    },
    onOpen: () => {
      setIsImgSent(true);
    },
  });

  const socketImg = (
    <img className="h-auto w-full" src={lastMessage?.data} alt="socket monitor" />
  );

  return isImgSent ? (
    socketImg
  ) : (
    <section className="flex h-full flex-col items-center justify-center gap-10 text-base">
      <h1>wait for socket data...</h1>
      <ScaleLoader
        color="rgb(142,211,0)"
        height={60}
        width={10}
        radius={5}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </section>
  );
};

export default SocketMonitor;
