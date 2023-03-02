import { RouterProvider } from 'react-router-dom';
import routes from '@/router';

import useInit from "../hooks/useInit"
import useTime from "../hooks/useTime"
import DeviceStatus from '@/components/DeviceStatus'

export default function () {
  const currentTime = useTime()

  return (
    <div className="bg-cover h-screen" style={{ background: `url(public/background/index.png)` }}>
      <div className="flex h-[40px] items-center justify-between">
        <div className="ml-2 select-none text-lg text-white">
        </div>
        <div className="mr-2 select-none font-['LCDFont'] text-3xl text-white">{currentTime}</div>
      </div>

      <div className="h-[calc(100vh-90px)]">
        <RouterProvider router={routes} />
      </div>

      <DeviceStatus />
    </div>
  )
}
