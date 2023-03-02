import { Button } from '@mui/material'
import LoginPanel from '@/components/LoginPanel'

export default function Index() {
  const [loginPanelVisible, setLoginPanelVisible] = useState(false);

  const handleClose = () => {
    setLoginPanelVisible(false)
  }

  return (
    <div className="relative flex items-center justify-center h-full">
      <h1 className="absolute top-[140px] left-1/2 z-10 -translate-x-1/2 select-none text-3xl text-white">智能载体管控系统</h1>

      {
        !loginPanelVisible && <Button variant="contained" className="!h-[95px] !w-[135px] !text-lg" onClick={() => setLoginPanelVisible(true)}>开始使用</Button>
      }

      {
        loginPanelVisible && <LoginPanel onClose={handleClose} />
      }
    </div >
  )
}
